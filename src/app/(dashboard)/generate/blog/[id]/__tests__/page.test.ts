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

// Mock blog server actions
vi.mock('@/lib/actions/generate/blog', () => ({
  getBlogGenerationAction: vi.fn(),
}));

// Mock the Client Component import to avoid rendering issues
vi.mock('../blog-view-client', () => ({
  default: () => 'BlogViewClientComponent',
}));

describe('BlogViewPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: BlogViewPage } = await import('../page');

    await expect(
      BlogViewPage({
        params: Promise.resolve({ id: 'gen_123' }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow('Redirect to /sign-in');
  });

  it('redirects to /generate/blog if fetching generation fails', async () => {
    const { auth } = await import('@/lib/auth');
    const { getBlogGenerationAction } = await import('@/lib/actions/generate/blog');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(getBlogGenerationAction).mockResolvedValueOnce({
      success: false,
      error: 'Generation not found',
    });

    const { default: BlogViewPage } = await import('../page');

    await expect(
      BlogViewPage({
        params: Promise.resolve({ id: 'gen_invalid' }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow('Redirect to /generate/blog');
  });

  it('renders BlogViewClient if authenticated and generation exists', async () => {
    const { auth } = await import('@/lib/auth');
    const { getBlogGenerationAction } = await import('@/lib/actions/generate/blog');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);
    vi.mocked(getBlogGenerationAction).mockResolvedValueOnce({
      success: true,
      generation: { id: 'gen_123', inputType: 'YOUTUBE_TRANSCRIPT' } as never,
      output: null,
    });

    const { default: BlogViewPage } = await import('../page');

    const result = await BlogViewPage({
      params: Promise.resolve({ id: 'gen_123' }),
      searchParams: Promise.resolve({ tone: 'educational', headline: 'HL', angle: 'A' }),
    });

    expect(result).toBeDefined();
    expect(getBlogGenerationAction).toHaveBeenCalledWith('gen_123');
  });
});
