import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ApiKeyForm } from './ApiKeyForm';

export const metadata = {
  title: 'Settings | ContentEngine',
  description: 'Manage your brand profile and account settings.',
};

export default async function SettingsPage() {
  // 1. Auth guard
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/sign-in');
    return null;
  }

  const userId = session.user.id;

  // 2. Fetch DB user (role + key status)
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, encryptedAnthropicApiKey: true },
  });

  // 3. Fetch brand profile
  const profile = await prisma.brandProfile.findUnique({
    where: { userId },
  });

  const role = dbUser?.role ?? 'subscriber';
  const hasExistingKey = !!dbUser?.encryptedAnthropicApiKey;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12 space-y-10">

        {/* Page heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#171717] -tracking-[0.96px]">Settings</h1>
          <p className="text-sm text-[#666666]">Manage your brand profile and account preferences.</p>
        </div>

        {/* ── Brand Profile Section ─────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#171717] uppercase tracking-wider">Brand Profile</h2>
            <Link
              href="/onboarding/review"
              className="text-xs font-medium text-[#0072f5] hover:text-[#0060d0] transition-colors"
            >
              Edit profile →
            </Link>
          </div>

          <div
            className="bg-white rounded-xl p-6 space-y-5"
            style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px' }}
          >
            {profile ? (
              <>
                {/* Brand name + type */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold text-[#171717] -tracking-[0.32px]">
                      {profile.brandName}
                    </p>
                    {profile.tagline && (
                      <p className="text-xs text-[#666666] mt-0.5">&quot;{profile.tagline}&quot;</p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#ebf5ff] text-[#0068d6] border border-[#0068d6]/10">
                    {profile.profileType === 'FULL' ? 'Full Profile' : 'Basic Profile'}
                  </span>
                </div>

                <div className="h-px bg-[#ebebeb]" />

                {/* Profile fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <span className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">Niche</span>
                    <p className="text-[#171717] mt-0.5">{profile.niche || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">Target Audience</span>
                    <p className="text-[#171717] mt-0.5">{profile.audience || '—'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">Content Pillars</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {profile.contentPillars?.length ? (
                        profile.contentPillars.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 text-xs text-[#4d4d4d] bg-[#fafafa] border border-[#ebebeb] rounded-full"
                          >
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#808080] text-xs">No pillars set</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-[#666666]">No brand profile found.</p>
                <Link
                  href="/onboarding"
                  className="inline-block px-4 py-2 bg-[#171717] text-white text-sm font-semibold rounded-lg hover:bg-[#171717]/90 transition-colors"
                >
                  Complete Onboarding
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── BYOK API Key Section ──────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-[#171717] uppercase tracking-wider">API Key</h2>
          <div
            className="bg-white rounded-xl p-6"
            style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px' }}
          >
            <ApiKeyForm hasExistingKey={hasExistingKey} />
          </div>
        </section>

        {/* ── Account Section ───────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-[#171717] uppercase tracking-wider">Account</h2>
          <div
            className="bg-white rounded-xl p-6 space-y-4"
            style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px' }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-[#171717]">{session.user.email}</p>
                <p className="text-xs text-[#808080] capitalize">
                  {role} account
                </p>
              </div>
              <span
                className="w-9 h-9 rounded-full bg-[#171717] text-white text-sm font-semibold flex items-center justify-center select-none"
              >
                {(session.user.name ?? session.user.email).charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
