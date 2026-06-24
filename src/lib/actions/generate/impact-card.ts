"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { buildImpactStatementSystemPrompt } from '../../prompts/impact-statement';


const impactStatementSchema = z.object({
  statements: z.array(z.string()),
});

export type ImpactStatementOutput = z.infer<typeof impactStatementSchema>;

export type ImpactStatementResult =
  | { success: true; generationId: string; data: ImpactStatementOutput }
  | { success: false; error: string };

/**
 * Extracts 3 impactful statement options for Impact/Quote cards
 * based on the user's brand profile and input content.
 * Uses the impact-statement prompt.
 * Saves a parent Generation record with direction = 'VISUAL'.
 */
export async function generateImpactStatementAction(input: {
  inputText: string;
}): Promise<ImpactStatementResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting (visual exports)
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
    const systemPrompt = buildImpactStatementSystemPrompt(input.inputText, brandProfile);
    const { object } = await generateObject({
      model: anthropic('claude-3-7-sonnet-latest'),
      schema: impactStatementSchema,
      system: systemPrompt,
      prompt: `Please extract the 3 most impactful statement options for this source content:\n\n${input.inputText}`,
    });

    // 5. Create parent Generation record in the database
    const generation = await prisma.generation.create({
      data: {
        userId,
        inputText: input.inputText,
        inputType: 'TOPIC_IDEA',
        direction: 'VISUAL',
        platforms: ['IMPACT'],
        tone: 'direct',
      },
    });

    revalidateTag(`history-${userId}`, 'max');

    return {
      success: true,
      generationId: generation.id,
      data: object,
    };
  } catch (error) {
    console.error('[ACTIONS/GENERATE/IMPACT] generateImpactStatementAction error:', error);
    return { success: false, error: 'Failed to extract impact statements. Please try again.' };
  }
}
