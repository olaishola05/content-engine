"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';

export type HistoryListInput = {
  page?: number;
  pageSize?: number;
};

export type HistoryListResult =
  | {
      success: true;
      generations: Array<{
        id: string;
        createdAt: Date;
        inputText: string;
        inputType: string;
        platforms: string[];
        outputs: Array<{ platform: string }>;
      }>;
      total: number;
      page: number;
      pageSize: number;
      hasMore: boolean;
    }
  | { success: false; error: string };

/**
 * Fetches paginated history for the authenticated user.
 * Excludes soft-deleted generations (deletedAt is not null).
 * Includes minimal output data for platform badges.
 */
export async function listHistoryAction(
  input: HistoryListInput = {}
): Promise<HistoryListResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const fetchHistory = unstable_cache(
      async () => Promise.all([
        prisma.generation.findMany({
          where: { userId, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
          include: { outputs: { select: { platform: true } } },
        }),
        prisma.generation.count({
          where: { userId, deletedAt: null },
        }),
      ]),
      [`history-list-${userId}-${page}-${pageSize}`],
      { tags: [`history-${userId}`] }
    );

    const [generations, total] = await fetchHistory();

    const hasMore = skip + generations.length < total;

    return {
      success: true,
      generations: generations.map((g) => ({
        id: g.id,
        createdAt: g.createdAt,
        inputText: g.inputText,
        inputType: g.inputType,
        platforms: g.platforms,
        outputs: g.outputs,
      })),
      total,
      page,
      pageSize,
      hasMore,
    };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/LIST] listHistoryAction error:', error);
    return { success: false, error: 'Failed to fetch history' };
  }
}
