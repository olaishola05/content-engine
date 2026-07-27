/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    brandProfile: {
      findUnique: vi.fn(),
    },
  },
}));

// 2. Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// 3. Mock next/headers + navigation
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// 4. Mock saveUserApiKeyAction
vi.mock('@/lib/actions/brand/save-api-key', () => ({
  saveUserApiKeyAction: vi.fn(),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated users to /sign-in', async () => {
    const { auth } = await import('@/lib/auth');
    const { redirect } = await import('next/navigation');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { default: SettingsPage } = await import('../settings/page');
    await SettingsPage();

    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('renders settings page successfully for an authenticated subscriber', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_1', name: 'Alice', email: 'alice@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      role: 'subscriber',
      encryptedAnthropicApiKey: null,
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_1',
      brandName: 'Alice Brand',
      niche: 'Tech',
      audience: 'Developers',
      contentPillars: ['AI', 'Cloud'],
      tagline: 'Build the future',
    } as any);

    const { default: SettingsPage } = await import('../settings/page');
    const result = await SettingsPage();

    // Should return JSX (not null, not a redirect)
    expect(result).not.toBeNull();
  });

  it('includes API key section for tester role', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');
    const ReactDOMServer = await import('react-dom/server');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'tester_1', name: 'Bob', email: 'bob@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      role: 'tester',
      encryptedAnthropicApiKey: 'encrypted_abc',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_2',
      brandName: 'Tester Brand',
      niche: 'Marketing',
      audience: 'Founders',
      contentPillars: ['Growth'],
      tagline: 'Scale fast',
    } as any);

    const { default: SettingsPage } = await import('../settings/page');
    const jsxResult = await SettingsPage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);
    expect(html).toContain('API Key');
    expect(html).toContain('sk-ant-');
  });

  it('includes API key section for any user role', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');
    const ReactDOMServer = await import('react-dom/server');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'admin_1', name: 'Carol', email: 'carol@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      role: 'admin',
      encryptedAnthropicApiKey: null,
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_3',
      brandName: 'Admin Brand',
      niche: 'SaaS',
      audience: 'CTOs',
      contentPillars: ['Product'],
      tagline: 'Ship it',
    } as any);

    const { default: SettingsPage } = await import('../settings/page');
    const jsxResult = await SettingsPage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);
    expect(html).toContain('API Key');
    expect(html).toContain('id="api-key-input"');
  });
});
