import { describe, it, expect, vi } from 'vitest';
import { processQuestionnaire } from '../process-questionnaire';

// Mock the Vercel AI SDK generateObject
vi.mock('ai', () => {
  return {
    generateObject: vi.fn().mockImplementation(async () => {
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
          platformHandles: { linkedin: null, instagram: null, x: null, tiktok: null, youtube: null },
          ctaStyle: 'Direct',
          brandValues: ['Integrity'],
          uniquePositioning: 'First to market',
          primaryColor: null,
          font: null
        }
      };
    })
  };
});

// Mock the anthropic provider
vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn()
}));

describe('Questionnaire Processing Action', () => {
  it('returns structured JSON matching the BrandProfile schema from answers', async () => {
    const answers = {
      brandName: 'Test Brand',
      niche: 'Tech',
      audience: 'Developers',
      tone: 'Professional',
      pillars: 'Code, Design',
      values: 'Integrity',
      positioning: 'First to market'
    };
    
    const result = await processQuestionnaire(answers);
    
    expect(result.brandName).toBe('Test Brand');
    expect(result.niche).toBe('Tech');
    expect(result.contentPillars).toHaveLength(2);
  });
});
