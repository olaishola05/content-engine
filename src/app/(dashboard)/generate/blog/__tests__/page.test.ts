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

// Mock the Client Component import to avoid rendering issues
vi.mock('../blog-client', () => ({
  default: () => 'BlogClientComponent',
}));

describe('BlogGeneratePage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: BlogGeneratePage } = await import('../page');

    await expect(BlogGeneratePage()).rejects.toThrow('Redirect to /sign-in');
  });

  it('renders without throwing redirect if user is authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as never);

    const { default: BlogGeneratePage } = await import('../page');

    const result = await BlogGeneratePage();
    expect(result).toBeDefined();
  });
});
