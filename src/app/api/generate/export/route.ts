import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { triggerVisualExportAction } from '@/lib/actions/generate/export';

const exportRequestSchema = z.object({
  generationId: z.string().min(1, 'generationId is required'),
  htmlContent: z.string().min(1, 'htmlContent is required'),
  exportType: z.enum(['instagram', 'tiktok', 'impact']),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting
    const rateLimitResult = await visualExportRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Limit is 5 exports per hour.' },
        { status: 429 }
      );
    }

    // 3. Validate parameters
    const json = await req.json();
    const validation = exportRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { generationId, htmlContent, exportType, dimensions } = validation.data;

    // 4. Verify generation ownership (optional, action does it too)
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
    });
    if (!generation || generation.userId !== userId) {
      return NextResponse.json({ error: 'Generation not found or unauthorized' }, { status: 404 });
    }

    // 5. Trigger the export action
    const result = await triggerVisualExportAction({
      generationId,
      htmlContent,
      exportType,
      dimensions,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API/GENERATE/EXPORT] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
