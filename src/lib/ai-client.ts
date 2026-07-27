import { anthropic, createAnthropic } from '@ai-sdk/anthropic';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encrypt';
import { NextResponse } from 'next/server';

/**
 * Resolves the correct Anthropic model instance for a user.
 *
 * - Tester (BYOK): decrypts the stored encryptedAnthropicApiKey and creates a custom client.
 * - Admin / subscriber (or tester without key): uses the server-side ANTHROPIC_API_KEY env var.
 *
 * Returns either the resolved model or a NextResponse error (caller must handle).
 * Centralizes key presence and decryption error handling so individual routes stay thin.
 */
export async function resolveAnthropicModel(
  userId: string
): Promise<
  | { model: ReturnType<typeof anthropic>; error: null }
  | { model: null; error: NextResponse }
> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, encryptedAnthropicApiKey: true },
  });

  const userKey = dbUser?.encryptedAnthropicApiKey;

  if (userKey) {
    try {
      const decryptedKey = decrypt(userKey);
      const customAnthropic = createAnthropic({ apiKey: decryptedKey });
      return { model: customAnthropic('claude-3-7-sonnet-latest'), error: null };
    } catch {
      console.error('[BYOK] Failed to decrypt API key for userId:', userId);
      return {
        model: null,
        error: NextResponse.json(
          {
            error: 'Failed to decrypt your API key. Please re-save it in Settings.',
            code: 'DECRYPTION_FAILED',
          },
          { status: 500 }
        ),
      };
    }
  }

  // Default path (admin/subscriber or tester without BYOK key configured)
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      model: null,
      error: NextResponse.json(
        {
          error: 'Anthropic API key is missing. Please contact administrator to set ANTHROPIC_API_KEY.',
          code: 'MISSING_API_KEY',
        },
        { status: 400 }
      ),
    };
  }

  return { model: anthropic('claude-3-7-sonnet-latest'), error: null };
}
