/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    generation: {
      count: vi.fn(),
    },
    generationOutput: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// ─── Tests: getAdminStatsAction ───────────────────────────────────────────────

describe('getAdminStatsAction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns UNAUTHORIZED if user is not authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { getAdminStatsAction } = await import('../get-stats');
    const result = await getAdminStatsAction();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('UNAUTHORIZED');
    }
  });

  it('returns FORBIDDEN if authenticated user is not an admin', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_1' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      role: 'tester',
    } as any);

    const { getAdminStatsAction } = await import('../get-stats');
    const result = await getAdminStatsAction();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('FORBIDDEN');
    }
  });

  it('returns stats for authenticated admin', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'admin_1' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      role: 'admin',
    } as any);
    vi.mocked(prisma.user.count).mockResolvedValueOnce(42);
    vi.mocked(prisma.generation.count).mockResolvedValueOnce(120);
    vi.mocked(prisma.generationOutput.count).mockResolvedValueOnce(360);
    vi.mocked(prisma.generationOutput.findMany).mockResolvedValueOnce([
      { platform: 'X' },
      { platform: 'X' },
      { platform: 'LINKEDIN' },
      { platform: 'INSTAGRAM' },
      { platform: 'INSTAGRAM' },
      { platform: 'INSTAGRAM' },
    ] as any);

    const { getAdminStatsAction } = await import('../get-stats');
    const result = await getAdminStatsAction();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalUsers).toBe(42);
      expect(result.data.totalGenerations).toBe(120);
      expect(result.data.totalOutputs).toBe(360);
      expect(result.data.platformBreakdown).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ platform: 'X', count: 2 }),
          expect.objectContaining({ platform: 'LINKEDIN', count: 1 }),
          expect.objectContaining({ platform: 'INSTAGRAM', count: 3 }),
        ])
      );
    }
  });
});
