import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { user } = session;
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ── Top Nav ─────────────────────────── */}
      <header className="h-12 border-b border-border flex items-center justify-between px-6">
        <span className="text-sm font-semibold tracking-tight">ContentEngine</span>

        <div className="flex items-center gap-4">
          <span className="text-label-2 hidden sm:block">{user.email}</span>
          <form action={signOutAction}>
            <Button
              id="sign-out-btn"
              type="submit"
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Sign out
            </Button>
          </form>
        </div>
      </header>

      {/* ── Main ────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">

        {/* Greeting */}
        <div className="space-y-2 max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Good to have you, {firstName}
          </h1>
          <p className="text-label-2">
            Your content workspace is ready. Complete your brand profile to unlock generation.
          </p>
        </div>

        {/* Next step card */}
        <div className="surface-1 w-full max-w-sm p-5 text-left space-y-4">
          <div className="space-y-0.5">
            <p className="text-label-3 uppercase tracking-widest">Next step</p>
            <p className="text-sm font-medium text-foreground">Set up your brand profile</p>
          </div>

          <p className="text-label-2">
            Upload your brand guide so every output sounds like you — not generic AI.
          </p>

          <div className="divider-h" />

          <Button
            id="setup-brand-btn"
            size="sm"
            className="h-8 px-4 text-xs font-medium"
            disabled
          >
            Available in Phase 2
          </Button>
        </div>

        {/* Phase progress pills */}
        <div className="flex items-center gap-2">
          {["Auth", "Brand", "Generate", "Visuals", "History"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${
                i === 0
                  ? "border-foreground/30 text-foreground bg-secondary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {i === 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
              )}
              {label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
