import { describe, it, expect } from 'vitest';

// Relative imports — @/ alias is not configured in vitest (Next.js compiler only)
import { buildBlogAngleSystemPrompt } from '../blog-angle';
import { buildBlogArticleSystemPrompt } from '../blog-article';
import { buildContentAtomsSystemPrompt } from '../content-atoms';
import { buildYoutubeSeoSystemPrompt } from '../youtube-seo';

// Shared minimal brand stub
const mockBrand = {
  brandName: 'TestBrand',
  niche: 'Developer tools',
  audience: 'Software engineers',
  toneOfVoice: 'direct',
  contentPillars: ['productivity', 'AI'],
  keyPhrases: ['ship fast', 'build in public'],
  avoidPhrases: ['synergy', 'leverage'],
  brandValues: ['transparency', 'quality'],
  uniquePositioning: 'The fastest way to ship AI features',
  ctaStyle: 'Subscribe for more',
};

// ─── blog-angle.ts ────────────────────────────────────────────────────────────

describe('buildBlogAngleSystemPrompt', () => {
  it('returns a non-empty string', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'educational', 'LINKEDIN_POST');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the brand name in the prompt', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'educational', 'LINKEDIN_POST');
    expect(result).toContain('TestBrand');
  });

  it('includes instructions to return exactly 3 angles', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'educational', 'LINKEDIN_POST');
    expect(result).toContain('3');
  });

  it('includes a recommendedIndex field in the output format', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'educational', 'LINKEDIN_POST');
    expect(result).toContain('recommendedIndex');
  });

  it('includes the selected tone in the prompt', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'storytelling', 'YOUTUBE_TRANSCRIPT');
    expect(result).toContain('storytelling');
  });

  it('formats the input type as human-readable text', () => {
    const result = buildBlogAngleSystemPrompt(mockBrand, 'direct', 'YOUTUBE_TRANSCRIPT');
    expect(result).toContain('YouTube');
  });
});

// ─── blog-article.ts ──────────────────────────────────────────────────────────

describe('buildBlogArticleSystemPrompt', () => {
  it('returns a non-empty string', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'How to Ship AI Features Fast',
      'SEO-first how-to approach',
      'educational'
    );
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the selected headline in the prompt', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'How to Ship AI Features Fast',
      'SEO-first approach',
      'educational'
    );
    expect(result).toContain('How to Ship AI Features Fast');
  });

  it('enforces definition block length requirement (40-60 words)', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'Test headline',
      'Test angle',
      'educational'
    );
    expect(result).toContain('40');
    expect(result).toContain('60');
  });

  it('requires SEO title under 60 chars in output', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'Test headline',
      'Test angle',
      'educational'
    );
    expect(result).toContain('seoTitle');
    expect(result).toContain('60');
  });

  it('requires meta description under 160 chars in output', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'Test headline',
      'Test angle',
      'educational'
    );
    expect(result).toContain('metaDescription');
    expect(result).toContain('160');
  });

  it('requires FAQ section in the output', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'Test headline',
      'Test angle',
      'educational'
    );
    expect(result).toContain('faqs');
  });

  it('includes dual SEO optimization instruction', () => {
    const result = buildBlogArticleSystemPrompt(
      mockBrand,
      'Test headline',
      'Test angle',
      'educational'
    );
    expect(result.toLowerCase()).toContain('ai search');
  });
});

// ─── content-atoms.ts ─────────────────────────────────────────────────────────

describe('buildContentAtomsSystemPrompt', () => {
  const sampleBlogContent = 'This is a sample blog post about AI development.';

  it('returns a non-empty string', () => {
    const result = buildContentAtomsSystemPrompt(sampleBlogContent);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the blog content in the prompt', () => {
    const result = buildContentAtomsSystemPrompt(sampleBlogContent);
    expect(result).toContain(sampleBlogContent);
  });

  it('requires exactly 4 output fields: quotable, statistic, take, howto', () => {
    const result = buildContentAtomsSystemPrompt(sampleBlogContent);
    expect(result).toContain('quotable');
    expect(result).toContain('statistic');
    expect(result).toContain('take');
    expect(result).toContain('howto');
  });

  it('enforces 280 char max on each atom', () => {
    const result = buildContentAtomsSystemPrompt(sampleBlogContent);
    expect(result).toContain('280');
  });
});

// ─── youtube-seo.ts ───────────────────────────────────────────────────────────

describe('buildYoutubeSeoSystemPrompt', () => {
  const sampleTranscript = 'In this video I show you how to build AI features fast.';
  const sampleBlogTitle = 'How to Ship AI Features in 24 Hours';

  it('returns a non-empty string', () => {
    const result = buildYoutubeSeoSystemPrompt(sampleTranscript, sampleBlogTitle);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the blog title in the prompt', () => {
    const result = buildYoutubeSeoSystemPrompt(sampleTranscript, sampleBlogTitle);
    expect(result).toContain(sampleBlogTitle);
  });

  it('requires exactly 3 title options', () => {
    const result = buildYoutubeSeoSystemPrompt(sampleTranscript, sampleBlogTitle);
    expect(result).toContain('titles');
    expect(result).toContain('3');
  });

  it('requires exactly 10 tags in output', () => {
    const result = buildYoutubeSeoSystemPrompt(sampleTranscript, sampleBlogTitle);
    expect(result).toContain('tags');
    expect(result).toContain('10');
  });

  it('includes the source transcript in the prompt', () => {
    const result = buildYoutubeSeoSystemPrompt(sampleTranscript, sampleBlogTitle);
    expect(result).toContain(sampleTranscript);
  });
});
