/**
 * Validates that the SEO title is under 60 characters and non-empty.
 */
export function validateSeoTitle(title: string): boolean {
  return typeof title === 'string' && title.trim().length > 0 && title.length <= 60;
}

/**
 * Validates that the meta description is under 160 characters and non-empty.
 */
export function validateMetaDescription(description: string): boolean {
  return (
    typeof description === 'string' &&
    description.trim().length > 0 &&
    description.length <= 160
  );
}

/**
 * Extracts the first non-heading paragraph of markdown and validates that its
 * word count falls strictly within the 40 to 60 words range.
 */
export function validateDefinitionBlock(markdown: string): boolean {
  if (typeof markdown !== 'string') return false;

  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 0 &&
        !p.startsWith('#') &&
        !p.startsWith('|') &&
        !p.startsWith('<!--') &&
        !p.startsWith('-') &&
        !p.startsWith('*') &&
        !/^\d+\./.test(p)
    );

  if (paragraphs.length === 0) return false;

  const firstParagraph = paragraphs[0];
  const words = firstParagraph.split(/\s+/).filter(Boolean);
  return words.length >= 40 && words.length <= 60;
}

/**
 * Validates that the markdown contains at least one H2 or H3 heading.
 */
export function validateHeadingStructure(markdown: string): boolean {
  if (typeof markdown !== 'string') return false;
  return /^(##|###) /m.test(markdown);
}

/**
 * Validates that the markdown contains a list (- / * / 1.) or a table (|).
 */
export function validateHasTableOrList(markdown: string): boolean {
  if (typeof markdown !== 'string') return false;
  return /^[*-] /m.test(markdown) || /^\d+\. /m.test(markdown) || /^\|/m.test(markdown);
}

/**
 * Validates that the markdown text contains at least one statistic (e.g. 45% or 10x).
 */
export function validateHasStats(markdown: string): boolean {
  if (typeof markdown !== 'string') return false;
  return /\d+%/m.test(markdown) || /\d+x/i.test(markdown);
}

/**
 * Validates that the markdown contains a CTA trigger or bracketed placeholder link.
 */
export function validateHasCta(markdown: string): boolean {
  if (typeof markdown !== 'string') return false;
  const lowercase = markdown.toLowerCase();
  return (
    /sign up|subscribe|get started|join|try/i.test(lowercase) ||
    /\[.*\]/.test(markdown)
  );
}

/**
 * Validates that all 4 social content atoms are present and under 280 characters.
 */
export function validateAtoms(atoms: unknown): boolean {
  if (!atoms || typeof atoms !== 'object') return false;

  const obj = atoms as Record<string, unknown>;
  const keys = ['quotable', 'statistic', 'take', 'howto'] as const;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val !== 'string' || val.trim().length === 0 || val.length > 280) {
      return false;
    }
  }

  return true;
}

/**
 * Validates that YouTube SEO metadata contains exactly 3 title options,
 * 10 tag phrases, and a non-empty description.
 */
export function validateYoutubeSeo(youtubeSeo: unknown): boolean {
  if (!youtubeSeo || typeof youtubeSeo !== 'object') return false;

  const obj = youtubeSeo as Record<string, unknown>;
  const { titles, description, tags } = obj;

  if (!Array.isArray(titles) || titles.length !== 3) return false;
  for (const title of titles) {
    if (typeof title !== 'string' || title.trim().length === 0) return false;
  }

  if (typeof description !== 'string' || description.trim().length === 0) return false;

  if (!Array.isArray(tags) || tags.length !== 10) return false;
  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.trim().length === 0) return false;
  }

  return true;
}
