import type { BrandProfile } from '@prisma/client';
import type { Tone } from './text-generation';

/**
 * Builds the system prompt for generating the full blog post based on the selected angle.
 * Incorporates both traditional and AI search engine (AI Overviews, Perplexity) optimization.
 *
 * @param brand The user's brand profile details
 * @param selectedHeadline The headline chosen by the user from the angle selection step
 * @param selectedAngle Description of the angle chosen by the user
 * @param tone Selected content tone (e.g. educational, storytelling)
 * @returns The complete system prompt string for Claude
 */
export function buildBlogArticleSystemPrompt(
  brand: Pick<
    BrandProfile,
    | 'brandName'
    | 'niche'
    | 'audience'
    | 'toneOfVoice'
    | 'contentPillars'
    | 'keyPhrases'
    | 'avoidPhrases'
    | 'brandValues'
    | 'uniquePositioning'
    | 'ctaStyle'
  >,
  selectedHeadline: string,
  selectedAngle: string,
  tone: Tone
): string {
  return `You are an elite SEO copywriter and content strategist for "${brand.brandName ?? 'this brand'}".
Write a complete, high-quality, long-form blog article based on the selected headline and angle.

## Brand Context
- **Niche:** ${brand.niche ?? 'Not specified'}
- **Target Audience:** ${brand.audience ?? 'Not specified'}
- **Tone of Voice:** ${brand.toneOfVoice ?? tone}
- **Key Phrases to Use:** ${brand.keyPhrases?.join(', ') || 'None'}
- **Phrases to Avoid:** ${brand.avoidPhrases?.join(', ') || 'None'}
- **CTA Style:** ${brand.ctaStyle ?? 'Not specified'}

## Article Focus
- **Target Headline:** "${selectedHeadline}"
- **Target Angle/Direction:** "${selectedAngle}"
- **Tone:** **${tone}**

## Strict Writing Rules

1. **Dual SEO Optimization**: Optimize for both traditional search engines (Google, Bing) AND AI search engines (ChatGPT, Claude, Google AI Overviews, Perplexity).
2. **Definition Block (AI Search Snippet)**: In the very first paragraph, write a self-contained authoritative answer to the primary topic in exactly **40 to 60 words**, optimized for AI snippet extraction.
3. **Structured H2/H3 Headings**: Headings MUST mirror how humans phrase natural search queries (e.g., "How do you build X?" not just "Building X").
4. **Structured Content**: Include at least one comparison table, numbered list, or step-by-step block.
5. **Statistics & Citations**: Weave at least one cited statistic into the body text.
6. **Internal Linking Placeholders**: Insert 2-3 placeholders in brackets e.g. [Link to related article on X].
7. **Brand-Aligned CTA**: Close with a CTA matching the brand profile CTA style.
8. **FAQ Section**: Add 3-4 natural-language questions with concise direct answers.

## Output Format
Return ONLY valid JSON. No markdown fences.
{
  "seoTitle": "string (front-loaded primary keyword, under 60 chars)",
  "metaDescription": "string (primary keyword present, under 160 chars, clear value prop)",
  "primaryKeyword": "string",
  "secondaryKeywords": ["string", "string", "string"],
  "estimatedReadTime": "string (e.g. '5 min read')",
  "contentMarkdown": "string (full article in Markdown, starting with definition block, structured H2/H3, table/list, stats, link placeholders, CTA)",
  "faqs": [
    { "question": "string", "answer": "string" }
  ]
}`;
}
