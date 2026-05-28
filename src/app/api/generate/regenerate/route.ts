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

const regenerateRequestSchema = z.object({
  generationId: z.string().min(1, 'Generation ID is required'),
  platform: z.enum(['X', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN']),
});

const outputSchema = z.object({
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
  ).length(1),
});

/**
 * API route handler to regenerate repurposed text outputs for a single specified platform.
 * Verifies user auth, rate limits request, validates body parameters, ensures the generation
 * record belongs to the user, and streams the structured output from Claude.
 * 
 * @param req - NextRequest object containing generationId and platform
 * @returns A streamed text response containing the generated structure
 */
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
    const validation = regenerateRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { generationId, platform } = validation.data;

    // 5. Retrieve original generation inputs & verify ownership
    const originalGeneration = await prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!originalGeneration || originalGeneration.userId !== userId) {
      return NextResponse.json(
        { error: 'Generation not found or does not belong to you.' },
        { status: 404 }
      );
    }

    // 6. Retrieve user's brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brandProfile) {
      return NextResponse.json(
        { error: 'Brand profile not found. Please complete your onboarding questionnaire first.' },
        { status: 400 }
      );
    }

    // 7. Load marketing skills context
    const socialSkill = await getSkillContent('social');
    const copywritingSkill = await getSkillContent('copywriting');

    // Assemble system prompt with skills context injected
    const systemPromptText = `
${buildTextGenerationSystemPrompt(
  brandProfile,
  [platform] as Platform[],
  originalGeneration.tone as Tone,
  originalGeneration.inputType as InputType
)}

## Advanced Strategic Copywriting Frameworks
Use the guidelines below to maximize hook engagement, creative angle variety, and message clarity:

${copywritingSkill ? `### Core Copywriting Principles:\n${copywritingSkill.content}\n` : ''}
${socialSkill ? `### Social Media Optimisation Guidelines:\n${socialSkill.content}\n` : ''}
`;

    // 8. Trigger streamObject using Anthropic Sonnet Latest
    const result = await streamObject({
      model: anthropic('claude-3-7-sonnet-latest'),
      schema: outputSchema,
      system: systemPromptText,
      prompt: `Please repurpose the following original content into the requested platform and tone:\n\n${originalGeneration.inputText}`,
      onFinish: async ({ object }) => {
        try {
          if (!object?.outputs?.[0]) return;

          const newOutput = object.outputs[0];

          // Check if there is an existing output record for this generation and platform
          const existingOutput = await prisma.generationOutput.findFirst({
            where: {
              generationId,
              platform,
            },
          });

          if (existingOutput) {
            // Update the existing output
            await prisma.generationOutput.update({
              where: { id: existingOutput.id },
              data: {
                recommendedIndex: newOutput.recommendedIndex,
                recommendationReason: newOutput.recommendationReason,
                variations: newOutput.variations as unknown as Prisma.InputJsonValue,
              },
            });
          } else {
            // Create a new output
            await prisma.generationOutput.create({
              data: {
                generationId,
                platform,
                recommendedIndex: newOutput.recommendedIndex,
                recommendationReason: newOutput.recommendationReason,
                variations: newOutput.variations as unknown as Prisma.InputJsonValue,
              },
            });
          }
        } catch (dbError) {
          console.error('[API/GENERATE/REGENERATE] Failed to persist regenerated output:', dbError);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API/GENERATE/REGENERATE] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
