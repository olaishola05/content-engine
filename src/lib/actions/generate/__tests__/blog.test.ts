/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBlogAnglesAction, getBlogGenerationAction } from '../blog';

// 1. Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      findUnique: vi.fn(),
    },
    generation: {
      create: vi.fn().mockResolvedValue({ id: 'gen_123' }),
      findUnique: vi.fn(),
    },
    generationOutput: {
      findFirst: vi.fn(),
    },
  },
}));

// 2. Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// 3. Mock Rate Limiter
vi.mock('@/lib/ratelimit', () => ({
  textGenRateLimit: {
    limit: vi.fn(),
  },
}));

// 4. Mock AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: () => unknown) => fn),
}));

describe('Blog Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateBlogAnglesAction', () => {
    const validInput = {
      inputText: 'Original content about AI development',
      inputType: 'LINKEDIN_POST' as const,
      tone: 'educational' as const,
    };

    it('returns error if user is unauthenticated', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await generateBlogAnglesAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toBe('Not authenticated');
      }
    });

    it('returns error if rate limit is exceeded', async () => {
      const { auth } = await import('@/lib/auth');
      const { textGenRateLimit } = await import('@/lib/ratelimit');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
        success: false,
      } as any);

      const result = await generateBlogAnglesAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain('Too many requests');
      }
    });

    it('returns error if brand profile is missing', async () => {
      const { auth } = await import('@/lib/auth');
      const { textGenRateLimit } = await import('@/lib/ratelimit');
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
        success: true,
      } as any);
      vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

      const result = await generateBlogAnglesAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain('Brand profile not found');
      }
    });

    it('successfully calls generateObject, saves parent Generation and returns angles', async () => {
      const { auth } = await import('@/lib/auth');
      const { textGenRateLimit } = await import('@/lib/ratelimit');
      const { prisma } = await import('@/lib/prisma');
      const { generateObject } = await import('ai');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
        success: true,
      } as any);
      vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
        id: 'bp_123',
        brandName: 'Test Brand',
      } as any);

      const mockAngles = {
        recommendedIndex: 0,
        recommendationReason: 'Best for SEO',
        angles: [
          { headline: 'H1', angle: 'A1', direction: 'Search Intent' },
          { headline: 'H2', angle: 'A2', direction: 'Thought Leadership' },
          { headline: 'H3', angle: 'A3', direction: 'Case Study' },
        ],
      };
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: mockAngles,
      } as any);

      const result = await generateBlogAnglesAction(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.generationId).toBe('gen_123');
        expect(result.data).toEqual(mockAngles);
      }

      expect(prisma.generation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user_123',
            inputText: validInput.inputText,
            inputType: validInput.inputType,
            direction: 'LONG',
            platforms: ['blog'],
            tone: validInput.tone,
          }),
        })
      );
    });
  });

  describe('getBlogGenerationAction', () => {
    it('returns error if user is unauthenticated', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await getBlogGenerationAction('gen_123');
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toBe('Not authenticated');
      }
    });

    it('returns error if generation is not found', async () => {
      const { auth } = await import('@/lib/auth');
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce(null);

      const result = await getBlogGenerationAction('gen_123');
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toBe('Generation not found');
      }
    });

    it('returns error if generation belongs to another user', async () => {
      const { auth } = await import('@/lib/auth');
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
        id: 'gen_123',
        userId: 'other_user',
      } as any);

      const result = await getBlogGenerationAction('gen_123');
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toBe('Unauthorized');
      }
    });

    it('returns the generation data and associated output', async () => {
      const { auth } = await import('@/lib/auth');
      const { prisma } = await import('@/lib/prisma');

      const mockGen = { id: 'gen_123', userId: 'user_123', inputText: 'input' };
      const mockOutput = { id: 'out_123', generationId: 'gen_123', variations: { article: 'body' } };

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce(mockGen as any);
      vi.mocked(prisma.generationOutput.findFirst).mockResolvedValueOnce(mockOutput as any);

      const result = await getBlogGenerationAction('gen_123');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.generation).toEqual(mockGen);
        expect(result.output).toEqual(mockOutput);
      }
    });
  });
});
