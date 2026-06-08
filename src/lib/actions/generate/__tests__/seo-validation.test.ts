import { describe, it, expect } from 'vitest';
import {
  validateSeoTitle,
  validateMetaDescription,
  validateDefinitionBlock,
  validateHeadingStructure,
  validateHasTableOrList,
  validateHasStats,
  validateHasCta,
  validateAtoms,
  validateYoutubeSeo,
} from '../seo-validation';

describe('SEO & Content Quality Validation Helpers', () => {
  describe('validateSeoTitle', () => {
    it('passes for titles under 60 characters', () => {
      expect(validateSeoTitle('How to Ship AI Features in 24 Hours')).toBe(true);
    });

    it('fails for titles over 60 characters', () => {
      expect(
        validateSeoTitle(
          'How to Build and Deploy Extremely High-Quality AI Applications in Less Than Twenty-Four Hours'
        )
      ).toBe(false);
    });
  });

  describe('validateMetaDescription', () => {
    it('passes for descriptions under 160 characters', () => {
      expect(
        validateMetaDescription(
          'Learn the exact steps to build and ship AI features fast using modern dev tools.'
        )
      ).toBe(true);
    });

    it('fails for descriptions over 160 characters', () => {
      expect(
        validateMetaDescription(
          'In this comprehensive tutorial, we cover everything you need to know to build, deploy, scale, and optimize next-generation AI agents on a budget in 2026. Read now!'
        )
      ).toBe(false);
    });
  });

  describe('validateDefinitionBlock', () => {
    it('passes if first paragraph has between 40 and 60 words', () => {
      // 45 words definition block
      const md = `An AI Content Engine is an automated system that uses artificial intelligence to repurpose core content into platform-specific social media variations. By analyzing input text, it maintains consistent brand positioning and tone while generating high-performing posts for LinkedIn, YouTube, and other channels.
      
      ## Why Use One?
      Here is the rest of the article...`;
      expect(validateDefinitionBlock(md)).toBe(true);
    });

    it('fails if first paragraph is too short (< 40 words)', () => {
      const md = `An AI Content Engine is an automated system that uses artificial intelligence to repurpose core content. It saves time.`;
      expect(validateDefinitionBlock(md)).toBe(false);
    });

    it('fails if first paragraph is too long (> 60 words)', () => {
      const md = `An AI Content Engine is an automated system that uses artificial intelligence to repurpose core content into platform-specific social media variations. By analyzing input text, it maintains consistent brand positioning and tone while generating high-performing posts for LinkedIn, YouTube, and other channels. This allows modern marketing teams to scale their distribution efforts by a factor of ten without increasing head count or spending more money on expensive agencies that deliver sub-par results.`;
      expect(validateDefinitionBlock(md)).toBe(false);
    });
  });

  describe('validateHeadingStructure', () => {
    it('passes if article contains H2 or H3 headings', () => {
      const md = `# Title\n\n## How does it work?\nBody\n### Step 1\nBody`;
      expect(validateHeadingStructure(md)).toBe(true);
    });

    it('fails if article has no H2 or H3 headings', () => {
      const md = `# Title\nBody text with no subheadings.`;
      expect(validateHeadingStructure(md)).toBe(false);
    });
  });

  describe('validateHasTableOrList', () => {
    it('passes if article has a table', () => {
      const md = `| Column 1 | Column 2 |\n|---|---|\n| A | B |`;
      expect(validateHasTableOrList(md)).toBe(true);
    });

    it('passes if article has a numbered list', () => {
      const md = `1. First step\n2. Second step`;
      expect(validateHasTableOrList(md)).toBe(true);
    });

    it('passes if article has a bulleted list', () => {
      const md = `- Point A\n- Point B`;
      expect(validateHasTableOrList(md)).toBe(true);
    });

    it('fails if article has no lists or tables', () => {
      const md = `Plain text body with no formatting elements.`;
      expect(validateHasTableOrList(md)).toBe(false);
    });
  });

  describe('validateHasStats', () => {
    it('passes if percentage stat is present', () => {
      expect(validateHasStats('We saw a 45% increase in traffic.')).toBe(true);
    });

    it('passes if ratio or multiplier stat is present', () => {
      expect(validateHasStats('It scales the process by 10x.')).toBe(true);
    });

    it('fails if no statistics are present', () => {
      expect(validateHasStats('We saw an increase in traffic.')).toBe(false);
    });
  });

  describe('validateHasCta', () => {
    it('passes if bracketed placeholder or call to action is present', () => {
      expect(validateHasCta('Sign up today to get started.')).toBe(true);
    });

    it('fails if no call to action is present', () => {
      expect(validateHasCta('This is just informational text.')).toBe(false);
    });
  });

  describe('validateAtoms', () => {
    const validAtoms = {
      quotable: 'AI will change everything.',
      statistic: '45% of engineers use AI tools.',
      take: 'No-code is overrated.',
      howto: '1. Paste text. 2. Click generate.',
    };

    it('passes for exactly 4 valid atoms', () => {
      expect(validateAtoms(validAtoms)).toBe(true);
    });

    it('fails if any atom is missing', () => {
      expect(validateAtoms({ ...validAtoms, quotable: '' })).toBe(false);
    });

    it('fails if any atom exceeds 280 characters', () => {
      expect(
        validateAtoms({
          ...validAtoms,
          take: 'a'.repeat(281),
        })
      ).toBe(false);
    });
  });

  describe('validateYoutubeSeo', () => {
    const validYt = {
      titles: ['T1', 'T2', 'T3'],
      description: 'Engaging video description.',
      tags: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    };

    it('passes for valid YouTube SEO assets', () => {
      expect(validateYoutubeSeo(validYt)).toBe(true);
    });

    it('fails if there are not exactly 3 titles', () => {
      expect(validateYoutubeSeo({ ...validYt, titles: ['T1', 'T2'] })).toBe(false);
    });

    it('fails if description is missing', () => {
      expect(validateYoutubeSeo({ ...validYt, description: '' })).toBe(false);
    });

    it('fails if there are not exactly 10 tags', () => {
      expect(validateYoutubeSeo({ ...validYt, tags: ['A'] })).toBe(false);
    });
  });
});
