import { describe, it, expect, vi } from 'vitest';
import { extractBrandFromText } from '../extract-brand';

// Mock the Vercel AI SDK generateObject
vi.mock('ai', () => {
  return {
    generateObject: vi.fn().mockImplementation(async ({ prompt }) => {
      if (prompt.includes('sparse')) {
        return {
          object: {
            brandName: 'Sparse Brand',
            tagline: null,
            niche: null,
            audience: null,
            toneOfVoice: null,
            contentPillars: [],
            keyPhrases: [],
            avoidPhrases: [],
            platformHandles: { linkedin: null, instagram: null, x: null, tiktok: null, youtube: null },
            ctaStyle: null,
            brandValues: [],
            uniquePositioning: null,
            primaryColor: null,
            font: null
          }
        };
      }
      
      return {
        object: {
          brandName: 'Test Brand',
          tagline: 'Just do it',
          niche: 'Tech',
          audience: 'Developers',
          toneOfVoice: 'Professional',
          contentPillars: ['Code', 'Design'],
          keyPhrases: ['Ship it'],
          avoidPhrases: ['Bug'],
          platformHandles: { linkedin: 'test_li', instagram: null, x: null, tiktok: null, youtube: null },
          ctaStyle: 'Direct',
          brandValues: ['Integrity'],
          uniquePositioning: 'First to market',
          primaryColor: '#000000',
          font: 'Inter'
        }
      };
    })
  };
});

// Mock the anthropic provider
vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn()
}));

describe('Brand Extraction Action', () => {
  it('returns structured JSON with all required fields', async () => {
    const result = await extractBrandFromText('Here is my full brand document...');
    expect(result.brandName).toBe('Test Brand');
    expect(result.tagline).toBe('Just do it');
    expect(result.contentPillars).toHaveLength(2);
  });

  it('returns null for missing fields with a sparse document', async () => {
    const result = await extractBrandFromText('Here is a sparse document');
    expect(result.brandName).toBe('Sparse Brand');
    expect(result.tagline).toBeNull();
    expect(result.contentPillars).toHaveLength(0);
  });
});
