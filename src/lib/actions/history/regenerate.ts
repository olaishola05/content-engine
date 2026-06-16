"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
// generateBlogAnglesAction is imported dynamically inside the function (to support vitest resolution for server actions in tests).

/* eslint-disable @typescript-eslint/no-explicit-any */

export type RegenerateResult =
  | { success: true; newGenerationId: string }
  | { success: false; error: string };

/**
 * Regenerates a new Generation record from an existing one.
 * Reuses original input, but allows updated settings (e.g. tone).
 * Calls the appropriate generate action (e.g. blog for text) to create brand new record.
 * Original is never mutated.
 */
export async function regenerateGenerationAction(
  generationId: string,
  options: { tone?: string } = {}
): Promise<RegenerateResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    const original = await prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!original) {
      return { success: false, error: 'Generation not found' };
    }

    if (original.userId !== userId || original.deletedAt) {
      return { success: false, error: 'Unauthorized' };
    }

    const tone = options.tone || original.tone;

    // Dispatch to appropriate generate action based on inputType or direction.
    // For text-like, use blogAngles (as in Phase 4). For visual, could use carousel/impact.
    // Here, use blog as example; extend as needed. The called action will create the new record.
    const { generateBlogAnglesAction } = await import('@/lib/actions/generate/blog');
    const result = await generateBlogAnglesAction({
      inputText: original.inputText,
      inputType: original.inputType as any,
      tone: tone as any,
    });

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to regenerate' };
    }

    return { success: true, newGenerationId: result.generationId };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/REGENERATE] regenerateGenerationAction error:', error);
    return { success: false, error: 'Failed to regenerate' };
  }
}
