"use server";

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { brandProfileSchema, type ExtractedBrandProfile } from './validation';
import { questionnaireSystemPrompt } from '../../prompts/questionnaire';

/**
 * Processes the 7 onboarding questionnaire answers using Claude to generate a Basic Brand Profile.
 * @param answers A record mapping question keys to user answers
 * @returns The structured ExtractedBrandProfile
 */
export async function processQuestionnaire(answers: Record<string, string>): Promise<ExtractedBrandProfile> {
  // Format the answers into a clear, readable text block for Claude
  const formattedAnswers = Object.entries(answers)
    .map(([key, value]) => `Question: ${key}\nAnswer: ${value}`)
    .join('\n\n');

  const { object } = await generateObject({
    model: anthropic('claude-3-7-sonnet-latest'),
    schema: brandProfileSchema,
    system: questionnaireSystemPrompt,
    prompt: `Generate a brand profile based on the following questionnaire answers:\n\n${formattedAnswers}`,
  });

  return object;
}
