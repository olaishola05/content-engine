/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCarouselCopyAction } from '../carousel';

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

// 3. Mock Rate Limiter (use visual for exports/copy gen)
vi.mock('@/lib/ratelimit', () => ({
  visualExportRateLimit: {
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

describe('Carousel Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateCarouselCopyAction', () => {
    const validInput = {
      inputText: 'Our new AI tool helps developers ship features 10x faster.',
      carouselType: 'instagram' as const,
    };

    it('returns error if user is unauthenticated', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await generateCarouselCopyAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toBe('Not authenticated');
      }
    });

    it('returns error if rate limit is exceeded', async () => {
      const { auth } = await import('@/lib/auth');
      const { visualExportRateLimit } = await import('@/lib/ratelimit');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
        success: false,
      } as any);

      const result = await generateCarouselCopyAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain('Too many requests');
      }
    });

    it('returns error if brand profile is missing', async () => {
      const { auth } = await import('@/lib/auth');
      const { visualExportRateLimit } = await import('@/lib/ratelimit');
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
        success: true,
      } as any);
      vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

      const result = await generateCarouselCopyAction(validInput);
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain('Brand profile not found');
      }
    });

    it('successfully generates carousel slide copy and creates Generation record', async () => {
      const { auth } = await import('@/lib/auth');
      const { visualExportRateLimit } = await import('@/lib/ratelimit');
      const { prisma } = await import('@/lib/prisma');
      const { generateObject } = await import('ai');

      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user_123' },
      } as any);
      vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
        success: true,
      } as any);
      vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
        brandName: 'TestBrand',
        niche: 'AI tools',
      } as any);

      const mockSlides = ['Slide 1 content', 'Slide 2 content'];
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: { slides: mockSlides },
      } as any);

      const result = await generateCarouselCopyAction(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slides).toEqual(mockSlides);
        expect(result.generationId).toBe('gen_123');
      }

      expect(prisma.generation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user_123',
            inputText: validInput.inputText,
            direction: 'VISUAL',
          }),
        })
      );
    });
  });
});
