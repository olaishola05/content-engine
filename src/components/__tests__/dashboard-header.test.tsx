import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { DashboardHeader } from '../dashboard-header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock signOutAction
vi.mock('../../lib/actions/auth', () => ({
  signOutAction: vi.fn(),
}));

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'subscriber',
};

describe('DashboardHeader Component', () => {
  it('renders general navigation links for normal users', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <DashboardHeader user={mockUser} />
    );
    expect(html).toContain('ContentEngine');
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('href="/generate"');
    expect(html).toContain('href="/library"');
    expect(html).toContain('href="/dashboard/settings"');
    expect(html).not.toContain('href="/dashboard/admin"');
  });

  it('renders admin navigation link for users with admin role', () => {
    const adminUser = { ...mockUser, role: 'admin' };
    const html = ReactDOMServer.renderToStaticMarkup(
      <DashboardHeader user={adminUser} />
    );
    expect(html).toContain('href="/dashboard/admin"');
  });

  it('does not render admin navigation link for testers', () => {
    const testerUser = { ...mockUser, role: 'tester' };
    const html = ReactDOMServer.renderToStaticMarkup(
      <DashboardHeader user={testerUser} />
    );
    expect(html).not.toContain('href="/dashboard/admin"');
  });
});
