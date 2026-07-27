"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { encrypt } from '../../encrypt';

type SaveApiKeyResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Validates, encrypts, and saves the user's Anthropic API key.
 * Only users in BYOK (tester) mode should need to run this.
 */
export async function saveUserApiKeyAction(
  key: string
): Promise<SaveApiKeyResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Validate API key format (Anthropic API keys start with sk-ant-)
    const trimmedKey = key.trim();
    if (!trimmedKey.startsWith('sk-ant-') || trimmedKey.length < 20) {
      return {
        success: false,
        error: 'Invalid Anthropic API key format. Must start with sk-ant-',
      };
    }

    // 3. Encrypt the key using AES-256
    const encryptedKey = encrypt(trimmedKey);

    // 4. Save to user model in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        encryptedAnthropicApiKey: encryptedKey,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[ACTIONS/BRAND/SAVE_API_KEY] saveUserApiKeyAction error:', error);
    return { success: false, error: 'Failed to save API key' };
  }
}
