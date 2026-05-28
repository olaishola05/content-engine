import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs/promises';

// Mock fs/promises to keep tests fast and isolated
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  readdir: vi.fn(),
}));

describe('Marketing Skills Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully loads a skill file and parses content', async () => {
    const mockSkillMarkdown = `---
name: copywriting
description: "Expert copywriting guidelines"
---
# Copywriting Guide
Follow these rules...`;

    vi.mocked(fs.readFile).mockResolvedValue(mockSkillMarkdown);

    // Import the loader dynamically after mocking
    const { getSkillContent } = await import('../skills/loader');
    const result = await getSkillContent('copywriting');

    expect(fs.readFile).toHaveBeenCalledWith(
      expect.stringContaining('.agents/skills/copywriting/SKILL.md'),
      'utf-8'
    );
    expect(result).toBeDefined();
    expect(result?.name).toBe('copywriting');
    expect(result?.description).toBe('Expert copywriting guidelines');
    expect(result?.content).toContain('# Copywriting Guide');
  });

  it('returns null if the skill file does not exist', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const { getSkillContent } = await import('../skills/loader');
    const result = await getSkillContent('nonexistent-skill');

    expect(result).toBeNull();
  });
});
