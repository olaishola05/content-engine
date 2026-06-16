import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { user } = session;
  const firstName = user.name?.split(" ")[0] ?? "there";

  // Fetch the brand profile to display the active voice details
  const profile = await prisma.brandProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Top Nav ─────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <svg height="24" viewBox="0 0 75 65" fill="#171717">
              <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
            </svg>
            <span className="text-ui font-semibold">ContentEngine</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="text-[#171717] hover:text-[#171717]/80"
            >
              Dashboard
            </Link>
            <Link
              href="/generate"
              className="text-[#666666] hover:text-[#171717] transition-colors"
            >
              Generate
            </Link>
            <Link
              href="/dashboard/library"
              className="text-[#666666] hover:text-[#171717] transition-colors"
            >
              Library
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-label hidden sm:block">{user.email}</span>
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
      <main className="flex-1 flex flex-col px-6 py-12 max-w-[1200px] w-full mx-auto gap-8">
        {/* Greeting */}
        <div className="space-y-3">
          <h1 className="text-title-1 -tracking-[1.28px]">Good to have you, {firstName}</h1>
          <p className="text-subtitle">
            Your content workspace is ready. Your brand profile is actively styling content.
          </p>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <div className="md:col-span-2 vercel-card-elevated p-8 space-y-6 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-title-2 text-[#171717] font-semibold text-lg">{profile?.brandName ?? "Active Brand Voice"}</h2>
                <p className="text-sm text-[#4d4d4d]">
                  {profile?.tagline ? `"${profile.tagline}"` : "Brand voice active"}
                </p>
              </div>
              <div className="px-3 py-1 bg-[#ebf5ff] rounded-full text-xs font-semibold text-[#0068d6] border border-[#0068d6]/10">
                {profile?.profileType === "FULL" ? "Full Profile" : "Basic Profile"}
              </div>
            </div>

            <div className="divider-h bg-[#ebebeb] h-px" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Niche</span>
                <p className="text-[#171717] mt-0.5">{profile?.niche ?? "Not specified"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Target Audience</span>
                <p className="text-[#171717] mt-0.5">{profile?.audience ?? "Not specified"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Content Pillars</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile?.contentPillars?.map((pillar) => (
                    <span key={pillar} className="px-2 py-0.5 bg-[#fafafa] text-[#4d4d4d] text-xs rounded border border-[#ebebeb]">
                      {pillar}
                    </span>
                  )) ?? <p className="text-[#808080]">None</p>}
                </div>
              </div>
            </div>

            <div className="divider-h bg-[#ebebeb] h-px" />

            <div className="flex items-center gap-3">
              <Link
                id="generate-content-btn"
                href="/generate"
                className="px-4 py-2 bg-[#171717] hover:bg-[#171717]/90 text-white rounded-lg text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all"
              >
                Generate Content
              </Link>
              <Link
                id="manage-brand-btn"
                href="/onboarding/review"
                className="px-4 py-2 bg-white hover:bg-[#fafafa] text-[#171717] border border-[#ebebeb] rounded-lg text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all"
              >
                Manage Profile
              </Link>
              <Link
                id="view-library-btn"
                href="/dashboard/library"
                className="px-4 py-2 bg-white hover:bg-[#fafafa] text-[#171717] border border-[#ebebeb] rounded-lg text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all"
              >
                View Library
              </Link>
            </div>
          </div>

          {/* Sidebar / Progress */}
          <div className="vercel-card p-6 space-y-6 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-2xl">
            <h3 className="text-ui font-semibold text-[#171717]">Onboarding Progress</h3>

            <div className="space-y-4">
              {[
                { label: "Authentication", status: "complete" },
                { label: "Brand Profile", status: "complete" },
                { label: "Content Generation", status: "current" },
                { label: "Visual Assets", status: "pending" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step.status === "complete" ? "bg-[#171717] text-white" :
                    step.status === "current" ? "bg-white text-[#171717] shadow-[0_0_0_2px_#171717]" :
                      "bg-[#fafafa] text-[#888888] shadow-[0_0_0_1px_#ebebeb]"
                    }`}>
                    {step.status === "complete" ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm ${step.status === "complete" ? "text-[#171717] line-through opacity-50" :
                    step.status === "current" ? "text-[#171717] font-medium" :
                      "text-[#888888]"
                    }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
