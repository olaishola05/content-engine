"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { buildCarouselCopySystemPrompt } from '../../prompts/carousel-copy';


const carouselCopySchema = z.object({
  slides: z.array(z.string()),
});

export type CarouselCopyOutput = z.infer<typeof carouselCopySchema>;

export type CarouselCopyResult =
  | { success: true; generationId: string; data: CarouselCopyOutput }
  | { success: false; error: string };

/**
 * Generates slide copy for Instagram or TikTok carousels
 * based on the user's brand profile and input content.
 * Uses the carousel-copy prompt for adaptable narrative arcs.
 * Saves a parent Generation record with direction = 'VISUAL'.
 */
export async function generateCarouselCopyAction(input: {
  inputText: string;
  carouselType: 'instagram' | 'tiktok';
}): Promise<CarouselCopyResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting (visual exports / copy gen)
    const rateLimitResult = await visualExportRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return { success: false, error: 'Too many requests. Limit is 5 exports per hour.' };
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
    const systemPrompt = buildCarouselCopySystemPrompt(
      input.inputText,
      input.carouselType,
      brandProfile
    );
    const { object } = await generateObject({
      model: anthropic('claude-3-7-sonnet-latest'),
      schema: carouselCopySchema,
      system: systemPrompt,
      prompt: `Please generate the ${input.carouselType} carousel slide copy for this source content:\n\n${input.inputText}`,
    });

    // 5. Create parent Generation record in the database
    const generation = await prisma.generation.create({
      data: {
        userId,
        inputText: input.inputText,
        inputType: 'TOPIC_IDEA', // or appropriate; using placeholder as visuals are derived
        direction: 'VISUAL',
        platforms: [input.carouselType === 'instagram' ? 'INSTAGRAM' : 'TIKTOK'],
        tone: 'direct', // default
      },
    });

    revalidateTag(`history-${userId}`, 'max');

    return {
      success: true,
      generationId: generation.id,
      data: object,
    };
  } catch (error) {
    console.error('[ACTIONS/GENERATE/CAROUSEL] generateCarouselCopyAction error:', error);
    return { success: false, error: 'Failed to generate carousel copy. Please try again.' };
  }
}
