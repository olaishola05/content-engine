import { describe, it, expect, vi } from 'vitest';

// The onboarding gate logic is: 
// - Unauthenticated → redirect to /sign-in
// - Authenticated + no brand profile → show onboarding
// - Authenticated + brand profile exists → redirect to /dashboard

// We test the pure gate function extracted from the layout
import { resolveOnboardingGate } from '../gate';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      findUnique: vi.fn(),
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

describe('Onboarding Gate', () => {
  it('returns UNAUTHENTICATED when there is no session', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await resolveOnboardingGate();
    expect(result.status).toBe('UNAUTHENTICATED');
  });

  it('returns NEEDS_ONBOARDING when user has no brand profile', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

    const result = await resolveOnboardingGate();
    expect(result.status).toBe('NEEDS_ONBOARDING');
  });

  it('returns PROFILE_EXISTS when user already has a brand profile', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_1',
      userId: 'user_123',
    } as never);

    const result = await resolveOnboardingGate();
    expect(result.status).toBe('PROFILE_EXISTS');
  });
});
