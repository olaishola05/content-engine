/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Mock the history action
vi.mock('@/lib/actions/history', () => ({
  listHistoryAction: vi.fn(),
  searchHistoryAction: vi.fn(),
}));

// Mock the components to avoid import issues and test the page logic
vi.mock('@/components/library/search-bar', () => ({
  default: ({ initialQuery }: { initialQuery?: string }) => `SearchBar:${initialQuery || ''}`,
}));

vi.mock('@/components/library/history-list', () => ({
  default: ({ generations }: { generations: any[] }) => `HistoryList:${generations.length}`,
}));

describe('Library List Page Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-in if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: LibraryPage } = await import('../page');

    await expect(LibraryPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Redirect to /sign-in');
  });

  it('renders with data from list action when authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    const { searchHistoryAction } = await import('@/lib/actions/history');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
    } as any);

    vi.mocked(searchHistoryAction).mockResolvedValueOnce({
      success: true,
      generations: [
        {
          id: 'gen1',
          createdAt: new Date(),
          inputText: 'Test input about AI',
          inputType: 'LINKEDIN_POST',
          platforms: ['X', 'INSTAGRAM'],
          outputs: [{ platform: 'X' }, { platform: 'INSTAGRAM' }],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
      hasMore: false,
    } as never);

    const { default: LibraryPage } = await import('../page');

    const result = await LibraryPage({ searchParams: Promise.resolve({ page: '1', query: 'AI' }) });
    expect(result).toBeDefined();

    // Verify search action was called (full search when query present)
    expect(searchHistoryAction).toHaveBeenCalledWith({ query: 'AI', page: 1, pageSize: 20 });
  });
});
