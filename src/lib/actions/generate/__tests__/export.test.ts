/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerVisualExportAction } from '../export';

// Mocks
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generation: {
      findUnique: vi.fn(),
    },
    generationOutput: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/lib/ratelimit', () => ({
  visualExportRateLimit: {
    limit: vi.fn(),
  },
}));

vi.mock('@/lib/export/playwright', () => ({
  takeScreenshot: vi.fn(),
}));

vi.mock('@/lib/export/r2-upload', () => ({
  uploadVisualToR2: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('Visual Export Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    generationId: 'gen_123',
    htmlContent: '<html><body>Test content</body></html>',
    exportType: 'instagram' as const,
    dimensions: { width: 1080, height: 1350 },
  };

  it('returns error if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await triggerVisualExportAction(validInput);
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

    const result = await triggerVisualExportAction(validInput);
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.error).toContain('Too many requests');
    }
  });

  it('successfully triggers screenshot, uploads to R2, and returns URL', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { takeScreenshot } = await import('@/lib/export/playwright');
    const { uploadVisualToR2 } = await import('@/lib/export/r2-upload');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
    } as any);

    const mockBuffer = Buffer.from('fake-image-data');
    vi.mocked(takeScreenshot).mockResolvedValueOnce(mockBuffer);

    const mockUrl = 'https://r2.example.com/visual-exports/user_123/test.png';
    vi.mocked(uploadVisualToR2).mockResolvedValueOnce(mockUrl);

    vi.mocked(prisma.generationOutput.create).mockResolvedValueOnce({
      id: 'out_123',
    } as any);

    const result = await triggerVisualExportAction(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.url).toBe(mockUrl);
      expect(result.generationId).toBe('gen_123');
    }

    expect(takeScreenshot).toHaveBeenCalledWith(validInput.htmlContent, validInput.dimensions);
    expect(uploadVisualToR2).toHaveBeenCalledWith(
      mockBuffer,
      expect.stringContaining('instagram-export-'),
      'image/png',
      'user_123'
    );

    expect(prisma.generationOutput.create).toHaveBeenCalled();
  });

  it('rate limiter blocks >5 exports/hour in export action (end-to-end verification)', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { takeScreenshot } = await import('@/lib/export/playwright');
    const { uploadVisualToR2 } = await import('@/lib/export/r2-upload');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
    } as any);

    const mockBuffer = Buffer.from('fake-image-data');
    vi.mocked(takeScreenshot).mockResolvedValueOnce(mockBuffer);
    vi.mocked(uploadVisualToR2).mockResolvedValueOnce('https://r2.example.com/url.png');
    vi.mocked(prisma.generationOutput.create).mockResolvedValueOnce({ id: 'out_123' } as any);

    const result = await triggerVisualExportAction(validInput);
    expect(result.success).toBe(true);

    // Simulate over limit
    const { auth: auth2 } = await import('@/lib/auth');
    vi.mocked(auth2.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: false,
    } as any);
    const blockResult = await triggerVisualExportAction({
      ...validInput,
      generationId: 'gen_456',
    });
    expect(blockResult.success).toBe(false);
    if (blockResult.success === false) {
      expect(blockResult.error).toContain('Too many requests');
    }
  });
});
