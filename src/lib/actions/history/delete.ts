"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export type HistoryDeleteResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Soft deletes a generation by setting deletedAt.
 * Only owner can delete. Idempotent if already deleted.
 */
export async function deleteHistoryAction(
  generationId: string
): Promise<HistoryDeleteResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      return { success: false, error: 'Generation not found' };
    }

    if (generation.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (generation.deletedAt) {
      // Already deleted
      return { success: true };
    }

    await prisma.generation.update({
      where: { id: generationId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/DELETE] deleteHistoryAction error:', error);
    return { success: false, error: 'Failed to delete generation' };
  }
}
