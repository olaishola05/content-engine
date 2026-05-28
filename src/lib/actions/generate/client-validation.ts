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

export type Direction = 'SHORT' | 'LONG' | 'BOTH';

export interface GenerationInput {
  inputText: string;
  inputType: InputType;
  platforms: readonly string[];
  tone: Tone;
  direction: Direction;
}

export interface ValidationResult {
  success: boolean;
  error?: { message: string };
}

/**
 * Validates the user's content generation input on the client side before
 * sending to the API. Catches empty content, missing platforms, and disabled
 * direction values (LONG is gated until Phase 4).
 *
 * @param input The generation form state to validate
 * @returns A ValidationResult indicating success or the first failing rule
 */
export function validateGenerationInput(input: GenerationInput): ValidationResult {
  if (!input.inputText || input.inputText.trim().length === 0) {
    return { success: false, error: { message: 'Input content is required' } };
  }

  if (!input.platforms || input.platforms.length === 0) {
    return { success: false, error: { message: 'Select at least one platform' } };
  }

  // LONG direction is disabled until Phase 4 (blog post expansion feature)
  if (input.direction === 'LONG') {
    return { success: false, error: { message: 'Long direction is disabled until Phase 4' } };
  }

  return { success: true };
}
