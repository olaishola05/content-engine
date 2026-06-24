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

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: unknown }) => `Link:${href}:${children}`,
}));

// Mock signOutAction
vi.mock('@/lib/actions/auth', () => ({
  signOutAction: vi.fn(),
}));

// Mock history server actions
vi.mock('@/lib/actions/history', () => ({
  getHistoryAction: vi.fn(),
}));

// Mock the component to avoid rendering issues
vi.mock('@/components/library/generation-detail', () => ({
  default: () => 'GenerationDetailComponent',
}));

describe('Library Detail Page Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: LibraryDetailPage } = await import('../page');

    await expect(
      LibraryDetailPage({
        params: Promise.resolve({ id: 'gen_123' }),
      })
    ).rejects.toThrow('Redirect to /sign-in');
  });

  it('redirects to /library if fetching generation fails (not found or unauthorized)', async () => {
    const { auth } = await import('@/lib/auth');
    const { getHistoryAction } = await import('@/lib/actions/history');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(getHistoryAction).mockResolvedValueOnce({
      success: false,
      error: 'Generation not found',
    });

    const { default: LibraryDetailPage } = await import('../page');

    await expect(
      LibraryDetailPage({
        params: Promise.resolve({ id: 'gen_invalid' }),
      })
    ).rejects.toThrow('Redirect to /library');
  });

  it('renders GenerationDetail if authenticated and generation exists', async () => {
    const { auth } = await import('@/lib/auth');
    const { getHistoryAction } = await import('@/lib/actions/history');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(getHistoryAction).mockResolvedValueOnce({
      success: true,
      generation: { id: 'gen_123', inputType: 'LINKEDIN_POST' } as never,
      outputs: [],
    });

    const { default: LibraryDetailPage } = await import('../page');

    const result = await LibraryDetailPage({
      params: Promise.resolve({ id: 'gen_123' }),
    });

    expect(result).toBeDefined();
    expect(getHistoryAction).toHaveBeenCalledWith('gen_123');
  });
});
