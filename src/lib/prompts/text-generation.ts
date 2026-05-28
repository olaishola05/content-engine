import type { BrandProfile } from '@prisma/client';

export type InputType =
  | 'LINKEDIN_POST'
  | 'YOUTUBE_TRANSCRIPT'
  | 'BLOG_ARTICLE'
  | 'TOPIC_IDEA'
  | 'DOCUMENT_UPLOAD';

export type Platform = 'X' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN';

export type Tone =
  | 'educational'
  | 'storytelling'
  | 'promotional'
  | 'vulnerable'
  | 'direct';

// Platform-specific constraints
const PLATFORM_CONSTRAINTS: Record<Platform, string> = {
  X: 'Max 280 characters per tweet. Hook must be the very first sentence. Use line breaks for readability. No hashtag spam — 1-2 max.',
  INSTAGRAM: 'Max 2,200 characters. Hook in the first 1-2 lines before "more" cutoff. Use emojis sparingly. 3-5 relevant hashtags at end.',
  TIKTOK: 'Max 2,200 characters but keep it punchy — under 300 characters is optimal. Hook must be extremely fast. Gen-Z friendly tone if appropriate.',
  YOUTUBE: 'This is a community post or video description. Max 500 characters for community posts. Use a clear call to action. No hashtag spam.',
  LINKEDIN: 'Max 3,000 characters. Hook in the first 2 lines before "see more" cutoff. Professional but human tone. Line breaks for skimmability. No more than 3 hashtags.',
};

/**
 * Builds the system prompt for text generation by combining the brand profile details,
 * target platforms constraints, selected tone, and type of input content.
 * 
 * @param brand The selected brand profile attributes
 * @param platforms Array of target social platforms
 * @param tone Selected content tone (e.g. educational, storytelling)
 * @param inputType The format of the source content (e.g. LinkedIn post, transcript)
 * @returns The complete system prompt string for Claude
 */
export function buildTextGenerationSystemPrompt(
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
  platforms: Platform[],
  tone: Tone,
  inputType: InputType
): string {
  const platformRules = platforms
    .map((p) => `### ${p}\n${PLATFORM_CONSTRAINTS[p]}`)
    .join('\n\n');

  return `You are an expert social media content strategist and copywriter for the brand "${brand.brandName ?? 'this brand'}".

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
The user is providing ${formatInputType(inputType)} content and wants it repurposed into social media posts.
The requested tone for this generation is: **${tone}**.

For EACH platform listed below, generate EXACTLY 3 distinct variations of a social media post.
Each variation must have a different creative angle.

## Platform Rules
${platformRules}

## Hook Strength Analysis
For each variation, analyse the hook and classify its strength as:
- **High**: Creates immediate curiosity, tension, or surprise. Reader cannot stop.
- **Medium**: Relevant and clear, but won't stop the scroll by itself.
- **Low**: Informational but does not create urgency or curiosity.

Also provide 2 alternative hook rewrites for each variation.

## Recommendation
After generating all 3 variations for a platform, identify the recommended one (index 0, 1, or 2) with a 2–3 sentence explanation of why it best fits the brand and platform context.

## Output Format
Return ONLY valid JSON. No markdown fences, no commentary outside the JSON structure.`;
}

/**
 * Formats the raw input type enum into a user-friendly English noun phrase.
 * 
 * @param inputType Raw enum value representing source content type
 * @returns A friendly string description
 */
function formatInputType(inputType: InputType): string {
  const labels: Record<InputType, string> = {
    LINKEDIN_POST: 'a LinkedIn post',
    YOUTUBE_TRANSCRIPT: 'a YouTube video transcript',
    BLOG_ARTICLE: 'a blog article',
    TOPIC_IDEA: 'a topic idea',
    DOCUMENT_UPLOAD: 'an uploaded document',
  };
  return labels[inputType];
}
