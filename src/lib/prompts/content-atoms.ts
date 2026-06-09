/**
 * Builds the prompt for extracting 4 distinct social content atoms from a blog post.
 * Each atom is a self-contained micro-content snippet suited for social media.
 *
 * @param blogContent Markdown content of the generated blog post
 * @returns The complete system prompt string for Claude
 */
export function buildContentAtomsSystemPrompt(blogContent: string): string {
  return `You are a social media micro-content specialist.
Read the blog post below and extract exactly 4 high-performing "content atoms" — self-contained snippets for standalone social posts.

## The 4 Required Atoms

1. **quotable**: A bold claim, punchy insight, or memorable line for X or LinkedIn. Max 280 chars.
2. **statistic**: A specific data point or numerical proof point, formatted as a social proof post. Max 280 chars.
3. **take**: A counter-intuitive opinion or contrarian statement from the article that drives debate. Max 280 chars.
4. **howto**: A single highly actionable step or tip suitable for Instagram carousel, thread, or TikTok. Max 280 chars.

## Blog Post Content
---
${blogContent}
---

## Output Format
Return ONLY valid JSON. No markdown fences, no commentary.
{
  "quotable": "string (max 280 chars)",
  "statistic": "string (max 280 chars)",
  "take": "string (max 280 chars)",
  "howto": "string (max 280 chars)"
}`;
}
