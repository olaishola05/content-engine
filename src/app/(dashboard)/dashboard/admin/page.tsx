import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getAdminStatsAction } from '@/lib/actions/admin/get-stats';

export const metadata = {
  title: 'Admin Dashboard | ContentEngine',
  description: 'Platform statistics and admin controls.',
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="bg-white rounded-xl p-6 space-y-2"
      style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px' }}
    >
      <p className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-semibold text-[#171717] -tracking-[1.6px]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

// ── Platform Bar Chart ────────────────────────────────────────────────────────

function PlatformChart({
  data,
}: {
  data: { platform: string; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.count), 1);

  const PLATFORM_COLORS: Record<string, string> = {
    X: '#171717',
    LINKEDIN: '#0a72ef',
    INSTAGRAM: '#de1d8d',
    TIKTOK: '#ff5b4f',
    YOUTUBE: '#ff5b4f',
  };

  return (
    <div className="space-y-3">
      {data.map(({ platform, count }) => {
        const pct = Math.round((count / max) * 100);
        const color = PLATFORM_COLORS[platform] ?? '#808080';
        return (
          <div key={platform} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#171717] text-xs">{platform}</span>
              <span className="text-[#666666] text-xs font-mono">{count}</span>
            </div>
            <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  // 1. Auth guard
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/sign-in');
    return null;
  }

  // 2. Fetch stats (action handles role check internally)
  const result = await getAdminStatsAction();

  // 3. Access denied for non-admins
  if (!result.success) {
    if (result.code === 'FORBIDDEN') {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <p className="text-6xl font-semibold text-[#171717] -tracking-[2.4px]">403</p>
            <p className="text-sm text-[#666666]">You don&apos;t have permission to view this page.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#dc2626]">Failed to load admin stats. Please try again.</p>
      </div>
    );
  }

  const { totalUsers, totalGenerations, totalOutputs, platformBreakdown } = result.data;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12 space-y-10">

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#171717] -tracking-[0.96px]">Admin Dashboard</h1>
          <p className="text-sm text-[#666666]">Platform-wide statistics and usage overview.</p>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={totalUsers} />
            <StatCard label="Total Generations" value={totalGenerations} />
            <StatCard label="Total Outputs" value={totalOutputs} />
          </div>
        </section>

        {/* ── Platform Breakdown ─────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-semibold text-[#808080] uppercase tracking-widest">
            Output by Platform
          </h2>
          <div
            className="bg-white rounded-xl p-6"
            style={{ boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px' }}
          >
            {platformBreakdown.length > 0 ? (
              <PlatformChart data={platformBreakdown} />
            ) : (
              <p className="text-sm text-[#808080] text-center py-4">No outputs generated yet.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
