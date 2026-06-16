"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Generation, GenerationOutput } from '@prisma/client';

export type HistoryGetResult =
  | {
      success: true;
      generation: Generation;
      outputs: GenerationOutput[];
    }
  | { success: false; error: string };

/**
 * Fetches a single generation + all its outputs for the authenticated user.
 * Returns 404-style error if not found or not owned (or deleted).
 */
export async function getHistoryAction(
  generationId: string
): Promise<HistoryGetResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      include: {
        outputs: true,
      },
    });

    if (!generation) {
      return { success: false, error: 'Generation not found' };
    }

    if (generation.userId !== userId || generation.deletedAt) {
      return { success: false, error: 'Generation not found' };
    }

    return {
      success: true,
      generation,
      outputs: generation.outputs,
    };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/GET] getHistoryAction error:', error);
    return { success: false, error: 'Failed to fetch generation' };
  }
}
