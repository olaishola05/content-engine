/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    user: {
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
  beforeEach(async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user_123',
      role: 'subscriber',
      encryptedAnthropicApiKey: null,
    } as any);
  });

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

  it('returns NEEDS_ONBOARDING when user has a brand profile but is a tester and has no API key', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_1',
      userId: 'user_123',
    } as never);
    // Mock user model to return role: 'tester', encryptedAnthropicApiKey: null
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 'user_123',
      role: 'tester',
      encryptedAnthropicApiKey: null,
    } as never);

    const result = await resolveOnboardingGate();
    expect(result.status).toBe('NEEDS_ONBOARDING');
  });

  it('returns PROFILE_EXISTS when user has a brand profile, is a tester, and has an API key', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_1',
      userId: 'user_123',
    } as never);
    // Mock user model to return role: 'tester', encryptedAnthropicApiKey: 'encrypted_key'
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 'user_123',
      role: 'tester',
      encryptedAnthropicApiKey: 'encrypted_key',
    } as never);

    const result = await resolveOnboardingGate();
    expect(result.status).toBe('PROFILE_EXISTS');
  });
});
