/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/actions/admin/get-stats', () => ({
  getAdminStatsAction: vi.fn(),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Admin Dashboard Page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirects unauthenticated users to /sign-in', async () => {
    const { auth } = await import('@/lib/auth');
    const { redirect } = await import('next/navigation');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: AdminPage } = await import('../page');
    await AdminPage();

    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('returns 403 response for non-admin users', async () => {
    const { auth } = await import('@/lib/auth');
    const { getAdminStatsAction } = await import('@/lib/actions/admin/get-stats');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'tester_1', name: 'Bob', email: 'bob@test.com' },
    } as any);

    vi.mocked(getAdminStatsAction).mockResolvedValueOnce({
      success: false,
      code: 'FORBIDDEN',
      error: 'Insufficient permissions',
    });

    const { default: AdminPage } = await import('../page');
    const result = await AdminPage();
    const ReactDOMServer = await import('react-dom/server');
    const html = ReactDOMServer.renderToStaticMarkup(result as React.ReactElement);

    expect(html).toContain('403');
  });

  it('renders stat cards for admin user with correct values', async () => {
    const { auth } = await import('@/lib/auth');
    const { getAdminStatsAction } = await import('@/lib/actions/admin/get-stats');
    const ReactDOMServer = await import('react-dom/server');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'admin_1', name: 'Carol', email: 'carol@test.com' },
    } as any);

    vi.mocked(getAdminStatsAction).mockResolvedValueOnce({
      success: true,
      data: {
        totalUsers: 42,
        totalGenerations: 120,
        totalOutputs: 360,
        platformBreakdown: [
          { platform: 'X', count: 80 },
          { platform: 'LINKEDIN', count: 60 },
          { platform: 'INSTAGRAM', count: 40 },
        ],
      },
    });

    const { default: AdminPage } = await import('../page');
    const result = await AdminPage();
    const html = ReactDOMServer.renderToStaticMarkup(result as React.ReactElement);

    expect(html).toContain('42');
    expect(html).toContain('120');
    expect(html).toContain('360');
    expect(html).toContain('X');
    expect(html).toContain('LINKEDIN');
  });
});
