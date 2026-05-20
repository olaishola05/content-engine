"use server";

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { brandExtractionSystemPrompt } from '../../prompts/brand-extraction';
import { brandProfileSchema, type ExtractedBrandProfile } from './validation';

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
