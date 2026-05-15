import { redirect } from 'next/navigation';
import { resolveOnboardingGate } from './gate';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await resolveOnboardingGate();

  if (gate.status === 'UNAUTHENTICATED') redirect('/sign-in');
  if (gate.status === 'PROFILE_EXISTS') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
