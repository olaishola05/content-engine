/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveUserApiKeyAction } from '../save-api-key';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

// Mock auth session
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'user_123' },
      }),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('Save User API Key Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ENCRYPTION_KEY = 'a'.repeat(64); // 64 hex characters = 32 bytes
  });

  it('fails if user is not authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await saveUserApiKeyAction('sk-ant-valid-key-goes-here-1234567890');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('authenticated');
    }
  });

  it('fails if key format is invalid', async () => {
    const result = await saveUserApiKeyAction('invalid-key-format');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('sk-ant-');
    }
  });

  it('successfully encrypts and updates the user API key in database', async () => {
    const { prisma } = await import('@/lib/prisma');
    const updateMock = vi.mocked(prisma.user.update);
    updateMock.mockResolvedValue({ id: 'user_123' } as any);

    const validKey = 'sk-ant-valid-key-goes-here-1234567890';
    const result = await saveUserApiKeyAction(validKey);

    expect(result.success).toBe(true);
    expect(updateMock).toHaveBeenCalledTimes(1);
    const updateArg = updateMock.mock.calls[0][0];
    expect(updateArg.where.id).toBe('user_123');
    expect(updateArg.data.encryptedAnthropicApiKey).toBeDefined();
    expect(updateArg.data.encryptedAnthropicApiKey).not.toBe(validKey); // Must be encrypted
  });
});
