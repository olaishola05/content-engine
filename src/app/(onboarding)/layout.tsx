import { redirect } from 'next/navigation';
import { resolveOnboardingGate } from './gate';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { signOutAction } from '@/lib/actions/auth';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await resolveOnboardingGate();

  if (gate.status === 'UNAUTHENTICATED') redirect('/sign-in');
  if (gate.status === 'PROFILE_EXISTS') redirect('/dashboard');

  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? '';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* ── Minimal Top Header with Sign Out ─────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <svg height="24" viewBox="0 0 75 65" fill="#171717">
            <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
          </svg>
          <span className="text-ui font-semibold text-[#171717]">ContentEngine</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-[#4d4d4d] hidden sm:block">{email}</span>
          <form action={signOutAction}>
            <button
              id="sign-out-btn"
              type="submit"
              className="text-sm font-medium text-[#4d4d4d] hover:text-[#171717] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main content centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
