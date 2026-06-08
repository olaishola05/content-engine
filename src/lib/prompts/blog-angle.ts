import type { BrandProfile } from '@prisma/client';
import type { InputType, Tone } from './text-generation';

/**
 * Builds the system prompt for generating 3 blog headlines and angles with AI recommendation.
 *
 * @param brand The user's brand profile details
 * @param tone Selected content tone (e.g. educational, storytelling)
 * @param inputType The format of the source content
 * @returns The complete system prompt string for Claude
 */
export function buildBlogAngleSystemPrompt(
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
  tone: Tone,
  inputType: InputType
): string {
  return `You are a world-class SEO strategist and blog editor for "${brand.brandName ?? 'this brand'}".
Your goal is to analyze the user's input content and propose exactly 3 distinct blog post angles/headlines.

## Brand Context
- **Niche:** ${brand.niche ?? 'Not specified'}
- **Target Audience:** ${brand.audience ?? 'Not specified'}
- **Tone of Voice:** ${brand.toneOfVoice ?? tone}
- **Content Pillars:** ${brand.contentPillars?.join(', ') || 'Not specified'}
- **Key Phrases to Use:** ${brand.keyPhrases?.join(', ') || 'None'}
- **Phrases to Avoid:** ${brand.avoidPhrases?.join(', ') || 'None'}
- **Brand Values:** ${brand.brandValues?.join(', ') || 'Not specified'}
- **Unique Positioning:** ${brand.uniquePositioning ?? 'Not specified'}
- **CTA Style:** ${brand.ctaStyle ?? 'Not specified'}

## Task
The user is providing content of type "${formatInputType(inputType)}" and wants to expand it into a long-form SEO blog post.
The selected tone is: **${tone}**.

Generate EXACTLY 3 distinct headline and angle options. Each must represent a different editorial direction:
1. **Direction 1: Search Intent / How-To (SEO-First)**: Directly targets high-volume search queries.
2. **Direction 2: Thought Leadership / Contrarian**: Offers a unique, opinionated take.
3. **Direction 3: Case Study / Story-Driven**: Centers on a real-world example or story.

## AI Recommendation
Recommend the single best option (index 0, 1, or 2) with a 2-3 sentence explanation.

## Output Format
Return ONLY valid JSON. No markdown fences, no commentary outside the JSON.
{
  "recommendedIndex": number,
  "recommendationReason": "string",
  "angles": [
    {
      "headline": "string (optimized SEO title, under 60 chars)",
      "angle": "string (1-2 sentences describing the direction)",
      "direction": "Search Intent" | "Thought Leadership" | "Case Study"
    }
  ]
}`;
}

/**
 * Formats the raw InputType enum into a human-readable English noun phrase.
 *
 * @param inputType Raw enum value representing source content type
 * @returns A friendly string description
 */
function formatInputType(inputType: InputType): string {
  const labels: Record<InputType, string> = {
    LINKEDIN_POST: 'LinkedIn Post',
    YOUTUBE_TRANSCRIPT: 'YouTube Transcript',
    BLOG_ARTICLE: 'Blog Article',
    TOPIC_IDEA: 'Topic / Idea',
    DOCUMENT_UPLOAD: 'Uploaded Document',
  };
  return labels[inputType] ?? inputType;
}
