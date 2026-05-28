import { describe, it, expect } from 'vitest';
import { inputTypes, isInputTypeDisabled } from '../input-type-selector';

describe('inputTypes config', () => {
  it('exports exactly 5 input types', () => {
    expect(inputTypes).toHaveLength(5);
  });

  it('includes all required input type values', () => {
    const values = inputTypes.map((t) => t.value);
    expect(values).toContain('LINKEDIN_POST');
    expect(values).toContain('YOUTUBE_TRANSCRIPT');
    expect(values).toContain('BLOG_ARTICLE');
    expect(values).toContain('TOPIC_IDEA');
    expect(values).toContain('DOCUMENT_UPLOAD');
  });

  it('each input type has a label and description', () => {
    for (const type of inputTypes) {
      expect(type.label).toBeTruthy();
      expect(type.description).toBeTruthy();
    }
  });
});

describe('isInputTypeDisabled', () => {
  it('marks DOCUMENT_UPLOAD as disabled (Phase 4 feature)', () => {
    expect(isInputTypeDisabled('DOCUMENT_UPLOAD')).toBe(true);
  });

  it('marks LINKEDIN_POST as enabled', () => {
    expect(isInputTypeDisabled('LINKEDIN_POST')).toBe(false);
  });

  it('marks YOUTUBE_TRANSCRIPT as enabled', () => {
    expect(isInputTypeDisabled('YOUTUBE_TRANSCRIPT')).toBe(false);
  });

  it('marks BLOG_ARTICLE as enabled', () => {
    expect(isInputTypeDisabled('BLOG_ARTICLE')).toBe(false);
  });

  it('marks TOPIC_IDEA as enabled', () => {
    expect(isInputTypeDisabled('TOPIC_IDEA')).toBe(false);
  });
});
