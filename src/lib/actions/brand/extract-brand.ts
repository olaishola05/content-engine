"use server";

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { brandExtractionSystemPrompt } from '../../prompts/brand-extraction';

export const brandProfileSchema = z.object({
  brandName: z.string().nullable(),
  tagline: z.string().nullable(),
  niche: z.string().nullable(),
  audience: z.string().nullable(),
  toneOfVoice: z.string().nullable(),
  contentPillars: z.array(z.string()),
  keyPhrases: z.array(z.string()),
  avoidPhrases: z.array(z.string()),
  platformHandles: z.object({
    linkedin: z.string().nullable(),
    instagram: z.string().nullable(),
    x: z.string().nullable(),
    tiktok: z.string().nullable(),
    youtube: z.string().nullable(),
  }).nullable(),
  ctaStyle: z.string().nullable(),
  brandValues: z.array(z.string()),
  uniquePositioning: z.string().nullable(),
  primaryColor: z.string().nullable(),
  font: z.string().nullable(),
});

export type ExtractedBrandProfile = z.infer<typeof brandProfileSchema>;

export async function extractBrandFromText(text: string): Promise<ExtractedBrandProfile> {
  // If the user has a BYOK key, it would be passed to the anthropic provider here.
  // For now, it will use the ANTHROPIC_API_KEY from process.env implicitly.
  const { object } = await generateObject({
    model: anthropic('claude-3-7-sonnet-latest'),
    schema: brandProfileSchema,
    system: brandExtractionSystemPrompt,
    prompt: `Extract the brand profile from the following document text:\n\n${text}`,
  });

  return object;
}
