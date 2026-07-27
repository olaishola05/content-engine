import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import ReviewForm from '../ReviewForm';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock updateBrandProfile action
vi.mock('@/lib/actions/brand/save-profile', () => ({
  updateBrandProfile: vi.fn().mockResolvedValue({ success: true, profileId: 'bp_1' }),
}));

// Mock saveUserApiKeyAction action
vi.mock('@/lib/actions/brand/save-api-key', () => ({
  saveUserApiKeyAction: vi.fn().mockResolvedValue({ success: true }),
}));

const mockProfile = {
  brandName: 'Test Brand',
  tagline: 'Just do it',
  niche: 'Tech',
  audience: 'Developers',
  toneOfVoice: 'Professional',
  contentPillars: ['Code', 'Design'],
  keyPhrases: ['Ship it'],
  avoidPhrases: ['Bug'],
  platformHandles: { linkedin: null, instagram: null, x: null, tiktok: null, youtube: null },
  ctaStyle: 'Direct',
  brandValues: ['Integrity'],
  uniquePositioning: 'First to market',
  primaryColor: '#000000',
  font: 'Inter',
};

describe('ReviewForm Component', () => {
  it('does not render API Key input field for regular subscribers', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <ReviewForm profile={mockProfile} path="A" isTester={false} />
    );
    expect(html).not.toContain('API Credentials');
    expect(html).not.toContain('Anthropic API Key');
  });

  it('renders API Key input field for testers', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <ReviewForm profile={mockProfile} path="A" isTester={true} />
    );
    expect(html).toContain('API Credentials');
    expect(html).toContain('Anthropic API Key');
    expect(html).toContain('type="password"');
  });
});
