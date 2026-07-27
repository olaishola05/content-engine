import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { generateObject } from 'ai';
import { z } from 'zod';
import { resolveAnthropicModel } from '@/lib/ai-client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { visualExportRateLimit } from '@/lib/ratelimit';
import { buildImpactStatementSystemPrompt } from '../../../../lib/prompts/impact-statement';

const impactCardRequestSchema = z.object({
  inputText: z.string().min(1, 'inputText is required'),
});

const impactCardOutputSchema = z.object({
  statements: z.array(z.string()),
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
    const validation = impactCardRequestSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { inputText } = validation.data;

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
    const systemPrompt = buildImpactStatementSystemPrompt(inputText, brandProfile);
    const { object } = await generateObject({
      model: resolvedModel,
      schema: impactCardOutputSchema,
      system: systemPrompt,
      prompt: `Extract 3 impactful statement options for this source content:\n\n${inputText}`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('[API/GENERATE/IMPACT-CARD] Execution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
