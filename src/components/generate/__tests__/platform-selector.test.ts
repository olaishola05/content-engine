import { describe, it, expect } from 'vitest';
import { platforms, togglePlatform } from '../platform-selector';

describe('platforms config', () => {
  it('exports exactly 5 platforms', () => {
    expect(platforms).toHaveLength(5);
  });

  it('includes all required platform values', () => {
    const values = platforms.map((p) => p.value);
    expect(values).toContain('X');
    expect(values).toContain('INSTAGRAM');
    expect(values).toContain('TIKTOK');
    expect(values).toContain('YOUTUBE');
    expect(values).toContain('LINKEDIN');
  });

  it('each platform has a label', () => {
    for (const p of platforms) {
      expect(p.label).toBeTruthy();
    }
  });
});

describe('togglePlatform', () => {
  it('adds a platform when not already selected', () => {
    const result = togglePlatform(['X'], 'LINKEDIN');
    expect(result).toContain('LINKEDIN');
    expect(result).toContain('X');
  });

  it('removes a platform when already selected', () => {
    const result = togglePlatform(['X', 'LINKEDIN'], 'LINKEDIN');
    expect(result).not.toContain('LINKEDIN');
    expect(result).toContain('X');
  });

  it('does not remove the last platform (min 1 required)', () => {
    const result = togglePlatform(['X'], 'X');
    expect(result).toContain('X');
    expect(result).toHaveLength(1);
  });

  it('removes a platform when toggled and others remain', () => {
    const result = togglePlatform(['X', 'LINKEDIN'], 'X');
    expect(result).not.toContain('X');
    expect(result).toContain('LINKEDIN');
  });
});
