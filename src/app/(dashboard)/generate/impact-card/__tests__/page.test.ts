import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url) => {
    throw new Error(`Redirect to ${url}`);
  }),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock the Client Component
vi.mock('../impact-card-client', () => ({
  default: () => 'ImpactCardClientComponent',
}));

// Mock the onboarding gate for integration tests
vi.mock('@/app/(onboarding)/gate', () => ({
  resolveOnboardingGate: vi.fn(),
}));

describe('ImpactCardGeneratePage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: ImpactCardGeneratePage } = await import('../page');

    await expect(ImpactCardGeneratePage()).rejects.toThrow('Redirect to /sign-in');
  });

  it('redirects to /onboarding if user needs onboarding', async () => {
    const { auth } = await import('@/lib/auth');
    const { resolveOnboardingGate } = await import('@/app/(onboarding)/gate');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(resolveOnboardingGate).mockResolvedValueOnce({
      status: 'NEEDS_ONBOARDING',
      userId: 'user_123',
    });

    const { default: ImpactCardGeneratePage } = await import('../page');

    await expect(ImpactCardGeneratePage()).rejects.toThrow('Redirect to /onboarding');
  });

  it('renders without throwing redirect if user is authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    const { resolveOnboardingGate } = await import('@/app/(onboarding)/gate');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(resolveOnboardingGate).mockResolvedValueOnce({
      status: 'PROFILE_EXISTS',
      userId: 'user_123',
    });

    const { default: ImpactCardGeneratePage } = await import('../page');

    const result = await ImpactCardGeneratePage();
    expect(result).toBeDefined();
  });
});
