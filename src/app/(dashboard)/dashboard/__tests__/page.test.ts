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

// Mock prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock signOutAction
vi.mock('@/lib/actions/auth', () => ({
  signOutAction: vi.fn(),
}));

type ReactElementLike = {
  props?: {
    href?: string;
    children?: unknown;
  };
};

// Recursive helper to find a node with a specific href prop in the React tree
function hasLinkWithHref(node: unknown, href: string): boolean {
  if (!node || typeof node !== 'object') return false;
  const element = node as ReactElementLike;
  if (element.props?.href === href) return true;
  
  const children = element.props?.children;
  if (Array.isArray(children)) {
    return children.some((child) => hasLinkWithHref(child, href));
  } else if (children && typeof children === 'object') {
    return hasLinkWithHref(children, href);
  }
  
  return false;
}

describe('DashboardPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: DashboardPage } = await import('../page');

    await expect(DashboardPage()).rejects.toThrow('Redirect to /sign-in');
  });

  it('renders correctly with brand profile info and links to /generate', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com', name: 'John Doe' },
    } as never);

    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'profile_123',
      userId: 'user_123',
      brandName: 'Test Brand',
      tagline: 'Make test easy',
      profileType: 'FULL',
      niche: 'Software Development',
      audience: 'Engineers',
      contentPillars: ['Testing', 'NextJS'],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const { default: DashboardPage } = await import('../page');

    const result = await DashboardPage();
    expect(result).toBeDefined();

    // Verify that the rendered page contains a Link pointing to /generate
    const containsGenerateLink = hasLinkWithHref(result, '/generate');
    expect(containsGenerateLink).toBe(true);
  });
});
