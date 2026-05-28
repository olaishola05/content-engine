import { describe, it, expect } from 'vitest';
import { validateGenerationInput } from '../client-validation';

describe('validateGenerationInput', () => {
  const validInput = {
    inputText: 'My LinkedIn post about building in public',
    inputType: 'LINKEDIN_POST' as const,
    platforms: ['X', 'LINKEDIN'] as const,
    tone: 'educational' as const,
    direction: 'SHORT' as const,
  };

  it('returns success for a fully valid input', () => {
    const result = validateGenerationInput(validInput);
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('fails when inputText is empty', () => {
    const result = validateGenerationInput({ ...validInput, inputText: '' });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Input content is required');
  });

  it('fails when inputText is only whitespace', () => {
    const result = validateGenerationInput({ ...validInput, inputText: '   ' });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Input content is required');
  });

  it('fails when platforms array is empty', () => {
    const result = validateGenerationInput({ ...validInput, platforms: [] });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Select at least one platform');
  });

  it('fails when direction is LONG (disabled until Phase 4)', () => {
    const result = validateGenerationInput({ ...validInput, direction: 'LONG' as const });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Long direction is disabled');
  });

  it('passes when direction is BOTH', () => {
    const result = validateGenerationInput({ ...validInput, direction: 'BOTH' as const });
    expect(result.success).toBe(true);
  });
});
