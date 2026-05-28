import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { textGenRateLimit } from '@/lib/ratelimit';
import { getSkillContent } from '@/lib/skills/loader';
import {
  buildTextGenerationSystemPrompt,
  type InputType,
  type Platform,
  type Tone,
} from '../../../../lib/prompts/text-generation';

// Input request validation schema
const textGenerationRequestSchema = z.object({
  inputText: z.string().min(1, 'Input content is required'),
  inputType: z.enum([
    'LINKEDIN_POST',
    'YOUTUBE_TRANSCRIPT',
    'BLOG_ARTICLE',
    'TOPIC_IDEA',
    'DOCUMENT_UPLOAD',
  ]),
  platforms: z.array(z.enum(['X', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN'])).min(1, 'Select at least one platform'),
  tone: z.enum(['educational', 'storytelling', 'promotional', 'vulnerable', 'direct']),
  direction: z.enum(['SHORT', 'LONG', 'BOTH']).default('SHORT'),
});

// Zod output schema for structured object streaming
const outputSchema = z.object({
  generationId: z.string(),
  outputs: z.array(
    z.object({
      platform: z.enum(['X', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN']),
      recommendedIndex: z.number().min(0).max(2),
      recommendationReason: z.string(),
      variations: z.array(
        z.object({
          angle: z.string(),
          content: z.string(),
          hookStrength: z.enum(['High', 'Medium', 'Low']),
          altHooks: z.array(z.string()).length(2),
        })
      ).length(3),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting
    const rateLimitResult = await textGenRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Limit is 10 text generations per hour.' },
        { status: 429 }
      );
    }

    // 3. Check Anthropic API Key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error: 'Anthropic API key is missing. Please contact administrator to set ANTHROPIC_API_KEY.',
          code: 'MISSING_API_KEY',
        },
        { status: 400 }
      );
    }

    // 4. Validate body parameters
    const json = await req.json();
    const validation = textGenerationRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { inputText, inputType, platforms, tone, direction } = validation.data;

    // 5. Retrieve user's brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brandProfile) {
      return NextResponse.json(
        { error: 'Brand profile not found. Please complete your onboarding questionnaire first.' },
        { status: 400 }
      );
    }

    // 6. Load marketing skills context
    const socialSkill = await getSkillContent('social');
    const copywritingSkill = await getSkillContent('copywriting');

    // Assemble system prompt with skills context injected
    const systemPromptText = `
${buildTextGenerationSystemPrompt(brandProfile, platforms as Platform[], tone as Tone, inputType as InputType)}

## Advanced Strategic Copywriting Frameworks
Use the guidelines below to maximize hook engagement, creative angle variety, and message clarity:

${copywritingSkill ? `### Core Copywriting Principles:\n${copywritingSkill.content}\n` : ''}
${socialSkill ? `### Social Media Optimisation Guidelines:\n${socialSkill.content}\n` : ''}
`;

    // 7. Create Generation record in DB before streaming
    const generation = await prisma.generation.create({
      data: {
        userId,
        inputText,
        inputType,
        direction,
        platforms: platforms as string[],
        tone,
      },
    });

    // 8. Trigger streamObject using Anthropic Sonnet Latest
    const result = await streamObject({
      model: anthropic('claude-3-7-sonnet-latest'),
      schema: outputSchema,
      system: systemPromptText,
      prompt: `Please repurpose the following original content into the requested platforms and tone. Important: populate the generationId field with "${generation.id}" in your JSON response:\n\n${inputText}`,
      onFinish: async ({ object }) => {
        try {
          if (!object?.outputs) return;

          // Save outputs to prisma DB linked to the created generation
          await prisma.generationOutput.createMany({
            data: object.outputs.map((out) => ({
              generationId: generation.id,
              platform: out.platform,
              recommendedIndex: out.recommendedIndex,
              recommendationReason: out.recommendationReason,
              variations: out.variations as unknown as Prisma.InputJsonValue,
            })),
          });
        } catch (dbError) {
          console.error('[API/GENERATE/TEXT] Failed to persist generation outputs:', dbError);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API/GENERATE/TEXT] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
