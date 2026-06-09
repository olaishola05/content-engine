"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { takeScreenshot } from '@/lib/export/playwright';
import { uploadVisualToR2 } from '@/lib/export/r2-upload';


export type VisualExportResult =
  | { success: true; generationId: string; url: string; outputId?: string }
  | { success: false; error: string };

/**
 * Shared trigger for visual exports (carousels, impact cards).
 * Takes rendered HTML (from RSC templates), screenshots with Playwright at given dimensions,
 * uploads to R2, returns public URL. Enforces visual rate limit.
 * Associates with existing Generation (updates or creates Output).
 */
export async function triggerVisualExportAction(input: {
  generationId: string;
  htmlContent: string;
  exportType: 'instagram' | 'tiktok' | 'impact';
  dimensions: { width: number; height: number };
}): Promise<VisualExportResult> {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting
    const rateLimitResult = await visualExportRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return { success: false, error: 'Too many requests. Limit is 5 exports per hour.' };
    }

    // 3. Verify generation ownership
    const generation = await prisma.generation.findUnique({
      where: { id: input.generationId },
    });
    if (!generation) {
      return { success: false, error: 'Generation not found' };
    }
    if (generation.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 4. Take screenshot using Playwright helper
    const buffer = await takeScreenshot(input.htmlContent, input.dimensions);

    // 5. Upload to R2
    const fileName = `${input.exportType}-export-${Date.now()}.png`;
    const url = await uploadVisualToR2(buffer, fileName, 'image/png', userId);

    // 6. Record the export (create GenerationOutput entry)
    const output = await prisma.generationOutput.create({
      data: {
        generationId: input.generationId,
        platform: input.exportType === 'impact' ? 'IMPACT' : input.exportType.toUpperCase(),
        recommendedIndex: 0,
        recommendationReason: 'Visual export',
        variations: { url, type: input.exportType, dimensions: input.dimensions },
      },
    });

    return {
      success: true,
      generationId: input.generationId,
      url,
      outputId: output.id,
    };
  } catch (error) {
    console.error('[ACTIONS/GENERATE/EXPORT] triggerVisualExportAction error:', error);
    return { success: false, error: 'Failed to export visual. Please try again.' };
  }
}
