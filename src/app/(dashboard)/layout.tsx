import { redirect } from "next/navigation";
import { resolveOnboardingGate } from "../(onboarding)/gate";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce onboarding gate
  const gate = await resolveOnboardingGate();

  if (gate.status === "UNAUTHENTICATED") redirect("/sign-in");
  // if (gate.status === "NEEDS_ONBOARDING") redirect("/onboarding");

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {children}
    </div>
  );
}
