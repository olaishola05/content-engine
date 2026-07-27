import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { streamObject, generateObject } from 'ai';
import { z } from 'zod';
import { resolveAnthropicModel } from '@/lib/ai-client';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { getSkillContent } from '@/lib/skills/loader';
import { buildBlogArticleSystemPrompt } from '../../../../lib/prompts/blog-article';
import { buildContentAtomsSystemPrompt } from '../../../../lib/prompts/content-atoms';
import { buildYoutubeSeoSystemPrompt } from '../../../../lib/prompts/youtube-seo';

// Input validation schema
const blogArticleRequestSchema = z.object({
  generationId: z.string().min(1, 'generationId is required'),
  selectedHeadline: z.string().min(1, 'selectedHeadline is required'),
  selectedAngle: z.string().min(1, 'selectedAngle is required'),
  tone: z.enum(['educational', 'storytelling', 'promotional', 'vulnerable', 'direct']),
});

// Output schema for structured object streaming of the blog article
const articleOutputSchema = z.object({
  seoTitle: z.string(),
  metaDescription: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  estimatedReadTime: z.string(),
  contentMarkdown: z.string(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
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

    // 2. Validate parameters
    const json = await req.json();
    const validation = blogArticleRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { generationId, selectedHeadline, selectedAngle, tone } = validation.data;

    // 3. Fetch parent Generation and verify ownership
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
    });
    if (!generation) {
      return NextResponse.json({ error: 'Parent generation not found' }, { status: 400 });
    }
    if (generation.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 400 });
    }

    // 4. Retrieve brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });
    if (!brandProfile) {
      return NextResponse.json(
        { error: 'Brand profile not found. Please complete your onboarding first.' },
        { status: 400 }
      );
    }

    // 5. Resolve AI model (BYOK support for testers; MISSING_API_KEY handled inside resolver for others)
    const { model: resolvedModel, error: modelError } = await resolveAnthropicModel(userId);
    if (modelError) return modelError;

    // 6. Load marketing skills context
    const copywritingSkill = await getSkillContent('copywriting');
    const aiSeoSkill = await getSkillContent('ai-seo');

    // Assemble system prompt with skills context injected
    const systemPromptText = `
${buildBlogArticleSystemPrompt(brandProfile, selectedHeadline, selectedAngle, tone)}

## Advanced Strategic Copywriting Frameworks
Use the guidelines below to maximize hook engagement, creative angle variety, and message clarity:

${copywritingSkill ? `### Core Copywriting Principles:\n${copywritingSkill.content}\n` : ''}
${aiSeoSkill ? `### AI Search Optimisation Guidelines:\n${aiSeoSkill.content}\n` : ''}
`;

    // 7. Trigger streamObject using resolved model (BYOK or server default)
    const result = await streamObject({
      model: resolvedModel,
      schema: articleOutputSchema,
      system: systemPromptText,
      prompt: `Generate the long-form blog post for the chosen angle.
Headline: "${selectedHeadline}"
Angle description: "${selectedAngle}"
Source Content:\n\n${generation.inputText}`,
      onFinish: async ({ object }) => {
        try {
          if (!object) return;

          // Asynchronously extract content atoms (Step 2.1)
          const atomsPrompt = buildContentAtomsSystemPrompt(object.contentMarkdown);
          const { object: atoms } = await generateObject({
            model: resolvedModel,
            schema: z.object({
              quotable: z.string(),
              statistic: z.string(),
              take: z.string(),
              howto: z.string(),
            }),
            system: atomsPrompt,
            prompt: `Please extract the 4 content atoms from the following article:\n\n${object.contentMarkdown}`,
          });

          // Asynchronously extract YouTube SEO (Step 2.2) if source is a transcript
          let youtubeSeo = null;
          if (generation.inputType === 'YOUTUBE_TRANSCRIPT') {
            const youtubeSeoPrompt = buildYoutubeSeoSystemPrompt(
              generation.inputText,
              object.seoTitle
            );
            const { object: ytSeo } = await generateObject({
              model: resolvedModel,
              schema: z.object({
                titles: z.array(z.string()),
                description: z.string(),
                tags: z.array(z.string()),
              }),
              system: youtubeSeoPrompt,
              prompt: `Please generate the YouTube SEO assets for this transcript/summary:\n\n${generation.inputText}`,
            });
            youtubeSeo = ytSeo;
          }

          // Persist the complete blog generation output to DB
          await prisma.generationOutput.create({
            data: {
              generationId: generation.id,
              platform: 'blog',
              recommendedIndex: 0,
              recommendationReason: 'Selected angle',
              variations: {
                ...object,
                atoms,
                youtubeSeo,
              } as unknown as Prisma.InputJsonValue,
            },
          });
        } catch (finishError) {
          console.error('[API/GENERATE/BLOG] Error in onFinish post-processing:', finishError);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API/GENERATE/BLOG] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
