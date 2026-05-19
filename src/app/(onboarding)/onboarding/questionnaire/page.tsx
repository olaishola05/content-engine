import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import QuestionnaireWizard from './QuestionnaireWizard';

export default async function QuestionnairePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  // Load existing draft from DB if any
  const profile = await prisma.brandProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Re-map db columns to questionnaire answers shape
  const initialAnswers: Record<string, string> = {
    brandName: profile?.brandName ?? '',
    niche: profile?.niche ?? '',
    audience: profile?.audience ?? '',
    tone: profile?.toneOfVoice ?? '',
    pillars: profile?.contentPillars?.join(', ') ?? '',
    values: profile?.brandValues?.join(', ') ?? '',
    positioning: profile?.uniquePositioning ?? '',
  };

  return <QuestionnaireWizard initialAnswers={initialAnswers} />;
}
