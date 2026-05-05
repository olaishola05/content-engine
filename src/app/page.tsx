import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">ContentEngine</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Repurpose your content for X, LinkedIn, TikTok, and Instagram in one click. 
        Powered by your personal brand profile.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
