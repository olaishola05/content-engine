import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">ContentEngine</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Repurpose your content for X, LinkedIn, TikTok, and Instagram in one click. 
        Powered by your personal brand profile.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
        <Link href="/sign-up" className={buttonVariants({ variant: "outline" })}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
