"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';

export type HistorySearchInput = {
  query: string;
  page?: number;
  pageSize?: number;
};

export type HistorySearchResult =
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
 * Keyword search across inputText and generation outputs (variations JSON).
 * Simple contains for V1 (no full-text search).
 * Excludes soft-deleted.
 */
export async function searchHistoryAction(
  input: HistorySearchInput
): Promise<HistorySearchResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    if (!input.query || input.query.trim().length === 0) {
      return { success: false, error: 'Search query is required' };
    }

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const searchTerm = input.query.trim();

    // Fetch with include to allow post-filter on variations (V1 simple contains)
    const fetchSearch = unstable_cache(
      async () => prisma.generation.findMany({
        where: {
          userId,
          deletedAt: null,
          OR: [
            { inputText: { contains: searchTerm, mode: 'insensitive' as const } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          outputs: {
            select: { platform: true, variations: true },
          },
        },
      }),
      [`history-search-${userId}-${searchTerm}-${page}-${pageSize}`],
      { tags: [`history-${userId}`] }
    );

    const allMatching = await fetchSearch();

    // Post-filter for variations JSON match (V1 simple approach)
    const matching = allMatching.filter((g) => {
      if (g.inputText.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      return g.outputs.some((o) => {
        const varsStr = JSON.stringify(o.variations || {}).toLowerCase();
        return varsStr.includes(searchTerm.toLowerCase());
      });
    });

    const paginated = matching.slice(skip, skip + pageSize);
    const hasMore = skip + paginated.length < matching.length;

    return {
      success: true,
      generations: paginated.map((g) => ({
        id: g.id,
        createdAt: g.createdAt,
        inputText: g.inputText,
        inputType: g.inputType,
        platforms: g.platforms,
        outputs: g.outputs.map((o) => ({ platform: o.platform })),
      })),
      total: matching.length,
      page,
      pageSize,
      hasMore,
    };
  } catch (error) {
    console.error('[ACTIONS/HISTORY/SEARCH] searchHistoryAction error:', error);
    return { success: false, error: 'Failed to search history' };
  }
}
