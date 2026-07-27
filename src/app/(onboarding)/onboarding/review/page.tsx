import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReviewForm from './ReviewForm';

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect('/sign-in');

  const [profile, dbUser] = await Promise.all([
    prisma.brandProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
  ]);

  if (!profile) redirect('/onboarding');

  const isTester = dbUser?.role === 'tester';
  const { path } = await searchParams;

  const formProfile = {
    brandName: profile.brandName,
    tagline: profile.tagline,
    niche: profile.niche,
    audience: profile.audience,
    toneOfVoice: profile.toneOfVoice,
    contentPillars: profile.contentPillars,
    keyPhrases: profile.keyPhrases,
    avoidPhrases: profile.avoidPhrases,
    platformHandles: profile.platformHandles
      ? (profile.platformHandles as { linkedin: string | null; instagram: string | null; x: string | null; tiktok: string | null; youtube: string | null })
      : null,
    ctaStyle: profile.ctaStyle,
    brandValues: profile.brandValues,
    uniquePositioning: profile.uniquePositioning,
    primaryColor: profile.primaryColor,
    font: profile.font,
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in py-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs text-[#4d4d4d] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Step 3 — Review & Save
        </div>
        <h1 className="text-2xl font-semibold text-[#171717] tracking-tight -tracking-[0.96px]">Review your brand profile</h1>
        <p className="text-[#4d4d4d] text-sm">
          {path === 'A' ? 'Claude extracted this from your documents.' : 'Claude generated this from your answers.'}
          {' '}Edit any field before saving.
        </p>
      </div>

      <ReviewForm profile={formProfile} path={path ?? null} isTester={isTester} />
    </div>
  );
}
