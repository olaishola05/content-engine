import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/lib/actions/auth';
import { getHistoryAction } from '@/lib/actions/history';
import GenerationDetail from '@/components/library/generation-detail';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const { user } = session;
  const { id } = await params;

  const result = await getHistoryAction(id);
  if (!result.success) {
    redirect('/library');
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Top Nav ─────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <svg height="24" viewBox="0 0 75 65" fill="#171717">
              <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
            </svg>
            <span className="text-sm font-semibold text-[#171717]">ContentEngine</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-[#666666] hover:text-[#171717] transition-colors">
              Dashboard
            </Link>
            <Link href="/generate" className="text-[#666666] hover:text-[#171717] transition-colors">
              Generate
            </Link>
            <Link href="/library" className="text-[#171717] font-semibold">
              Library
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#666666] hidden sm:block">{user.email}</span>
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

      {/* ── Main ────────────────────────────── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <Link href="/library" className="hover:text-[#171717] transition-colors">
            ← Back to Library
          </Link>
        </div>
        <GenerationDetail generation={result.generation} outputs={result.outputs} />
      </main>
    </div>
  );
}
