import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveOnboardingGate } from '@/app/(onboarding)/gate';

import ImpactCardClient from './impact-card-client';

export default async function ImpactCardGeneratePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const gate = await resolveOnboardingGate();
  if (gate.status === 'NEEDS_ONBOARDING') redirect('/onboarding');

  return <ImpactCardClient userEmail={session.user.email} />;
}
