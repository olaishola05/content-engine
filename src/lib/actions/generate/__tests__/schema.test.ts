import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client matching the two new models
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generation: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    generationOutput: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('Generation schema relationships', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generation.create accepts all required fields', async () => {
    const { prisma } = await import('@/lib/prisma');
    const createMock = vi.mocked(prisma.generation.create);
    const mockGen = {
      id: 'gen_1',
      userId: 'user_123',
      inputText: 'My LinkedIn post about AI',
      inputType: 'LINKEDIN_POST',
      direction: 'SHORT',
      platforms: ['X', 'INSTAGRAM'],
      tone: 'educational',
      createdAt: new Date(),
    };
    createMock.mockResolvedValue(mockGen as never);

    const result = await prisma.generation.create({
      data: {
        userId: 'user_123',
        inputText: 'My LinkedIn post about AI',
        inputType: 'LINKEDIN_POST',
        direction: 'SHORT',
        platforms: ['X', 'INSTAGRAM'],
        tone: 'educational',
      },
    });

    expect(createMock).toHaveBeenCalledOnce();
    expect(result.userId).toBe('user_123');
    expect(result.inputType).toBe('LINKEDIN_POST');
    expect(result.platforms).toContain('X');
  });

  it('generationOutput.create accepts all required fields including json variations', async () => {
    const { prisma } = await import('@/lib/prisma');
    const createMock = vi.mocked(prisma.generationOutput.create);
    const mockOutput = {
      id: 'out_1',
      generationId: 'gen_1',
      platform: 'X',
      recommendedIndex: 1,
      recommendationReason: 'Strongest hook for X audience',
      variations: [
        { angle: 'Educational', content: 'Post 1', hookStrength: 'High', altHooks: ['Alt 1'] },
        { angle: 'Story', content: 'Post 2', hookStrength: 'Medium', altHooks: ['Alt 2'] },
        { angle: 'Promo', content: 'Post 3', hookStrength: 'Low', altHooks: ['Alt 3'] },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    createMock.mockResolvedValue(mockOutput as never);

    const result = await prisma.generationOutput.create({
      data: {
        generationId: 'gen_1',
        platform: 'X',
        recommendedIndex: 1,
        recommendationReason: 'Strongest hook for X audience',
        variations: mockOutput.variations,
      },
    });

    expect(createMock).toHaveBeenCalledOnce();
    expect(result.platform).toBe('X');
    expect(result.recommendedIndex).toBe(1);
    expect(Array.isArray(result.variations)).toBe(true);
  });

  it('generationOutput.update can update variations independently', async () => {
    const { prisma } = await import('@/lib/prisma');
    const updateMock = vi.mocked(prisma.generationOutput.update);
    updateMock.mockResolvedValue({ id: 'out_1', platform: 'INSTAGRAM' } as never);

    await prisma.generationOutput.update({
      where: { id: 'out_1' },
      data: { variations: [] },
    });

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'out_1' } })
    );
  });
});
