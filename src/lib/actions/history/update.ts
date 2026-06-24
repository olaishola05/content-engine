"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidateTag } from 'next/cache';

export type UpdateOutputResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Updates a specific variation's content in a GenerationOutput.
 * Verifies ownership via the parent generation.
 * Used for inline re-edit of text outputs.
 */
export async function updateOutputAction(
  outputId: string,
  variationIndex: number,
  newContent: string
): Promise<UpdateOutputResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // Find the output and its generation for ownership
    const output = await prisma.generationOutput.findUnique({
      where: { id: outputId },
      include: { generation: true },
    });

    if (!output) {
      return { success: false, error: 'Output not found' };
    }

    if (output.generation.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update the variations JSON
    const variations = Array.isArray(output.variations) ? [...output.variations] : [];
    if (variationIndex < 0 || variationIndex >= variations.length) {
      return { success: false, error: 'Invalid variation index' };
    }

    // Assume variation is object with content, or string; update content
    const currentVar = variations[variationIndex];
    if (typeof currentVar === 'string') {
      variations[variationIndex] = newContent;
    } else if (currentVar && typeof currentVar === 'object') {
      variations[variationIndex] = { ...currentVar, content: newContent };
    } else {
      variations[variationIndex] = { content: newContent };
    }

    await prisma.generationOutput.update({
      where: { id: outputId },
      data: { variations },
    });

    revalidateTag(`history-${userId}`, 'max');
    return { success: true };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/UPDATE] updateOutputAction error:', error);
    return { success: false, error: 'Failed to update output' };
  }
}
