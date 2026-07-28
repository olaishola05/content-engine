/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('V1 Landing Page (Home)', () => {
  it('renders navbar with logo, navigation links, and CTA buttons', async () => {
    const { default: HomePage } = await import('../page');
    const jsxResult = await HomePage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);

    expect(html).toContain('ContentEngine');
    expect(html).toContain('Features');
    expect(html).toContain('How It Works');
    expect(html).toContain('Outputs');
    expect(html).toContain('Pricing');
    expect(html).toContain('FAQ');
    expect(html).toContain('/sign-in');
    expect(html).toContain('/sign-up');
  });

  it('renders hero section with badge, headline, subheadline, and primary CTAs', async () => {
    const { default: HomePage } = await import('../page');
    const jsxResult = await HomePage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);

    expect(html).toContain('Private Beta');
    expect(html).toContain('One Input');
    expect(html).toContain('Start Repurposing Free');
  });

  it('renders before vs after comparison section', async () => {
    const { default: HomePage } = await import('../page');
    const jsxResult = await HomePage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);

    expect(html).toContain('Manual Repurposing');
    expect(html).toContain('With ContentEngine');
  });

  it('renders brand voice ingestion card and multi-platform matrix', async () => {
    const { default: HomePage } = await import('../page');
    const jsxResult = await HomePage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);

    expect(html).toContain('Brand Voice Ingestion');
    expect(html).toContain('LinkedIn Posts &amp; PDFs');
    expect(html).toContain('Instagram 4:5 Carousels');
    expect(html).toContain('TikTok Photo Mode');
  });

  it('renders testimonials, pricing, BYOK security banner, FAQ accordion, final CTA, and footer', async () => {
    const { default: HomePage } = await import('../page');
    const jsxResult = await HomePage();

    const html = ReactDOMServer.renderToStaticMarkup(jsxResult as React.ReactElement);

    expect(html).toContain('Loved by Founders');
    expect(html).toContain('Simple &amp; Free During Private Beta');
    expect(html).toContain('BYOK Access &amp; Privacy');
    expect(html).toContain('AES-256');
    expect(html).toContain('Frequently Asked Questions');
    expect(html).toContain('Start Generating 5-Platform Packs');
    expect(html).toContain('©');
  });
});
