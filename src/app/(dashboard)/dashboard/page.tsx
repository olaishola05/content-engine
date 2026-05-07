import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { user } = session;
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Top Nav ─────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <svg height="24" viewBox="0 0 75 65" fill="#171717">
            <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
          </svg>
          <span className="text-ui font-semibold">ContentEngine</span>
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
          <h1 className="text-title-1">Good to have you, {firstName}</h1>
          <p className="text-subtitle">
            Your content workspace is ready. Complete your brand profile to unlock generation.
          </p>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <div className="md:col-span-2 vercel-card-elevated p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-title-2">Brand Profile</h2>
                <p className="text-label text-base">
                  Upload your brand guidelines to ensure AI outputs match your unique voice.
                </p>
              </div>
              <div className="px-3 py-1 bg-[#fafafa] rounded-full text-xs font-medium text-[#4d4d4d] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                Required
              </div>
            </div>

            <div className="divider-h bg-[#ebebeb] h-px" />

            <div className="flex items-center gap-4">
              <button
                id="setup-brand-btn"
                className="btn-vercel-primary opacity-50 cursor-not-allowed"
                disabled
              >
                Set up Profile
              </button>
              <span className="text-sm text-[#4d4d4d]">Available in Phase 2</span>
            </div>
          </div>

          {/* Sidebar / Progress */}
          <div className="vercel-card p-6 space-y-6">
            <h3 className="text-ui">Onboarding Progress</h3>

            <div className="space-y-4">
              {[
                { label: "Authentication", status: "complete" },
                { label: "Brand Profile", status: "current" },
                { label: "Content Generation", status: "pending" },
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
