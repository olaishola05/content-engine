"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { textGenRateLimit } from '@/lib/ratelimit';
import { revalidateTag } from 'next/cache';
import { buildBlogAngleSystemPrompt } from '../../prompts/blog-angle';
import type { Generation, GenerationOutput } from '@prisma/client';
import type { InputType, Tone } from '../../prompts/text-generation';

const blogAnglesSchema = z.object({
  recommendedIndex: z.number(),
  recommendationReason: z.string(),
  angles: z.array(
    z.object({
      headline: z.string(),
      angle: z.string(),
      direction: z.enum(['Search Intent', 'Thought Leadership', 'Case Study']),
    })
  ),
});

export type BlogAnglesOutput = z.infer<typeof blogAnglesSchema>;

export type BlogAnglesResult =
  | { success: true; generationId: string; data: BlogAnglesOutput }
  | { success: false; error: string };

/**
 * Step 1: Generates 3 headlines and angles with AI recommendations
 * based on the user's brand profile and input content.
 * Saves a parent Generation record with direction = 'LONG'.
 */
export async function generateBlogAnglesAction(input: {
  inputText: string;
  inputType: InputType;
  tone: Tone;
}): Promise<BlogAnglesResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting
    const rateLimitResult = await textGenRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return { success: false, error: 'Too many requests. Limit is 10 generations per hour.' };
    }

    // 3. Retrieve user's brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });
    if (!brandProfile) {
      return {
        success: false,
        error: 'Brand profile not found. Please complete your onboarding questionnaire first.',
      };
    }

    // 4. Trigger generateObject using Anthropic Sonnet
    const systemPrompt = buildBlogAngleSystemPrompt(brandProfile, input.tone, input.inputType);
    const { object } = await generateObject({
      model: anthropic('claude-3-7-sonnet-latest'),
      schema: blogAnglesSchema,
      system: systemPrompt,
      prompt: `Please generate the 3 distinct blog post angles and your recommendation for this source content:\n\n${input.inputText}`,
    });

    // 5. Create parent Generation record in the database
    const generation = await prisma.generation.create({
      data: {
        userId,
        inputText: input.inputText,
        inputType: input.inputType,
        direction: 'LONG',
        platforms: ['blog'],
        tone: input.tone,
      },
    });

    revalidateTag(`history-${userId}`, 'max');

    return {
      success: true,
      generationId: generation.id,
      data: object,
    };
  } catch (error) {
    console.error('[ACTIONS/GENERATE/BLOG] generateBlogAnglesAction error:', error);
    return { success: false, error: 'Failed to generate angles. Please try again.' };
  }
}

export type BlogGenerationResult =
  | { success: true; generation: Generation; output: GenerationOutput | null }
  | { success: false; error: string };

/**
 * Helper Server Action to fetch the completed generation and output details.
 */
export async function getBlogGenerationAction(
  generationId: string
): Promise<BlogGenerationResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Retrieve Generation
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
    });
    if (!generation) {
      return { success: false, error: 'Generation not found' };
    }

    // 3. Ensure ownership
    if (generation.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 4. Retrieve Generation Output
    const output = await prisma.generationOutput.findFirst({
      where: { generationId, platform: 'blog' },
    });

    return {
      success: true,
      generation,
      output,
    };
  } catch (error) {
    console.error('[ACTIONS/GENERATE/BLOG] getBlogGenerationAction error:', error);
    return { success: false, error: 'Failed to retrieve blog generation' };
  }
}
