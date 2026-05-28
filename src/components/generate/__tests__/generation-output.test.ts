import { describe, it, expect } from 'vitest';
import { getHookStrengthProps, isPlatformOutputComplete } from '../generation-output';

describe('getHookStrengthProps', () => {
  it('returns green badge classes for High strength', () => {
    const props = getHookStrengthProps('High');
    expect(props.bgClass).toBeDefined();
    expect(props.textClass).toBeDefined();
    expect(props.borderClass).toBeDefined();
  });

  it('returns amber/yellow badge classes for Medium strength', () => {
    const props = getHookStrengthProps('Medium');
    expect(props.bgClass).toBeDefined();
    expect(props.textClass).toBeDefined();
  });

  it('returns red badge classes for Low strength', () => {
    const props = getHookStrengthProps('Low');
    expect(props.bgClass).toBeDefined();
    expect(props.textClass).toBeDefined();
  });

  it('returns fallback for unknown strength', () => {
    const props = getHookStrengthProps('Unknown');
    expect(props.bgClass).toBeDefined();
    expect(props.textClass).toBeDefined();
  });
});

describe('isPlatformOutputComplete', () => {
  it('returns false for undefined/null/empty output', () => {
    expect(isPlatformOutputComplete(undefined)).toBe(false);
    expect(isPlatformOutputComplete({} as never)).toBe(false);
  });

  it('returns false if variations are fewer than 3', () => {
    expect(isPlatformOutputComplete({
      variations: [
        { angle: '1', content: 'hello', hookStrength: 'High', altHooks: [] }
      ]
    } as never)).toBe(false);
  });

  it('returns false if any variation content is missing/empty', () => {
    expect(isPlatformOutputComplete({
      variations: [
        { angle: '1', content: 'hello', hookStrength: 'High', altHooks: [] },
        { angle: '2', content: '', hookStrength: 'Medium', altHooks: [] },
        { angle: '3', content: 'world', hookStrength: 'Low', altHooks: [] }
      ]
    } as never)).toBe(false);
  });

  it('returns true if all 3 variations have non-empty content', () => {
    expect(isPlatformOutputComplete({
      variations: [
        { angle: '1', content: 'hello', hookStrength: 'High', altHooks: [] },
        { angle: '2', content: 'there', hookStrength: 'Medium', altHooks: [] },
        { angle: '3', content: 'world', hookStrength: 'Low', altHooks: [] }
      ]
    } as never)).toBe(true);
  });
});
