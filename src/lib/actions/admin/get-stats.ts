'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PlatformStat {
  platform: string;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  totalOutputs: number;
  platformBreakdown: PlatformStat[];
}

type AdminStatsResult =
  | { success: true; data: AdminStats }
  | { success: false; code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'ERROR'; error: string };

// ── Action ────────────────────────────────────────────────────────────────────

/**
 * Fetches aggregate platform statistics for the admin dashboard.
 * Only accessible by users with the `admin` role.
 */
export async function getAdminStatsAction(): Promise<AdminStatsResult> {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, code: 'UNAUTHORIZED', error: 'Not authenticated' };
    }

    // 2. Role check — must be admin
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== 'admin') {
      return { success: false, code: 'FORBIDDEN', error: 'Insufficient permissions' };
    }

    // 3. Aggregate stats in parallel
    const [totalUsers, totalGenerations, totalOutputs, outputRows] = await Promise.all([
      prisma.user.count(),
      prisma.generation.count(),
      prisma.generationOutput.count(),
      prisma.generationOutput.findMany({
        select: { platform: true },
      }),
    ]);

    // 4. Compute platform breakdown from raw rows (deterministic, no DB-level groupBy needed)
    const platformMap = new Map<string, number>();
    for (const { platform } of outputRows) {
      platformMap.set(platform, (platformMap.get(platform) ?? 0) + 1);
    }
    const platformBreakdown: PlatformStat[] = Array.from(platformMap.entries())
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);

    return {
      success: true,
      data: { totalUsers, totalGenerations, totalOutputs, platformBreakdown },
    };
  } catch (error) {
    console.error('[ADMIN/GET_STATS] Error:', error);
    return { success: false, code: 'ERROR', error: 'Failed to fetch stats' };
  }
}
