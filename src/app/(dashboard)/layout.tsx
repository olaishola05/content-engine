import { redirect } from "next/navigation";
import { resolveOnboardingGate } from "../(onboarding)/gate";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce onboarding gate (library routes inherit this via (dashboard) layout)
  const gate = await resolveOnboardingGate();

  if (gate.status === "UNAUTHENTICATED") redirect("/sign-in");
  // if (gate.status === "NEEDS_ONBOARDING") redirect("/onboarding");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  // Fetch the user's role from the DB to be accurate
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const headerUser = {
    name: session.user.name,
    email: session.user.email,
    role: dbUser?.role || "subscriber",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <DashboardHeader user={headerUser} />
      {children}
    </div>
  );
}
