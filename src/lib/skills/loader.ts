import { readFile } from 'fs/promises';
import path from 'path';

export interface Skill {
  name: string;
  description: string;
  content: string;
}

/**
 * Loads and parses a marketing skill from the local filesystem (.agents/skills/<skillName>/SKILL.md).
 * Extracts metadata from the YAML frontmatter.
 */
export async function getSkillContent(skillName: string): Promise<Skill | null> {
  try {
    const filePath = path.join(process.cwd(), '.agents/skills', skillName, 'SKILL.md');
    const fileContent = await readFile(filePath, 'utf-8');

    // Parse YAML frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);

    if (!match) {
      return {
        name: skillName,
        description: '',
        content: fileContent.trim(),
      };
    }

    const yamlBlock = match[1];
    const markdownContent = match[2];

    const metadata: Record<string, string> = {};
    const lines = yamlBlock.split('\n');
    for (const line of lines) {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex !== -1) {
        const key = line.slice(0, separatorIndex).trim();
        // Remove surrounding quotes from the value
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
        metadata[key] = value;
      }
    }

    return {
      name: metadata.name || skillName,
      description: metadata.description || '',
      content: markdownContent.trim(),
    };
  } catch {
    return null;
  }
}
