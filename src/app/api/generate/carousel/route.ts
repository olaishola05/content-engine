import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { generateObject } from 'ai';
import { z } from 'zod';
import { resolveAnthropicModel } from '@/lib/ai-client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { buildCarouselCopySystemPrompt } from '../../../../lib/prompts/carousel-copy';

const carouselRequestSchema = z.object({
  inputText: z.string().min(1, 'inputText is required'),
  carouselType: z.enum(['instagram', 'tiktok']),
});

const carouselOutputSchema = z.object({
  slides: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Enforce rate limiting (visual)
    const rateLimitResult = await visualExportRateLimit.limit(userId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Limit is 5 exports per hour.' },
        { status: 429 }
      );
    }

    // 3. Validate parameters
    const json = await req.json();
    const validation = carouselRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { inputText, carouselType } = validation.data;

    // 4. Retrieve brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });
    if (!brandProfile) {
      return NextResponse.json(
        { error: 'Brand profile not found. Please complete your onboarding first.' },
        { status: 400 }
      );
    }

    // 5. Resolve AI model (BYOK for testers)
    const { model: resolvedModel, error: modelError } = await resolveAnthropicModel(userId);
    if (modelError) return modelError;

    // 6. Trigger generateObject
    const systemPrompt = buildCarouselCopySystemPrompt(inputText, carouselType, brandProfile);
    const { object } = await generateObject({
      model: resolvedModel,
      schema: carouselOutputSchema,
      system: systemPrompt,
      prompt: `Generate the ${carouselType} carousel slide copy for this source content:\n\n${inputText}`,
    });

    // 7. Optionally create generation record (simplified for now)
    // In full flow, this might be tied to existing generationId like blog

    return NextResponse.json(object);
  } catch (error) {
    console.error('[API/GENERATE/CAROUSEL] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
