"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [oauthPending, setOauthPending] = useState<"github" | "google" | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result?.error) {
        setError(typeof result.error === "string" ? result.error : "Failed to create account");
      }
    });
  }

  async function handleOAuth(provider: "github" | "google") {
    setError(null);
    setOauthPending(provider);
    await signIn.social({ provider, callbackURL: "/dashboard" });
    setOauthPending(null);
  }

  return (
    <div className="w-full max-w-[360px] px-4">
      {/* Wordmark */}
      <div className="mb-8 text-center">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          ContentEngine
        </span>
      </div>

      {/* Card */}
      <div className="surface-1 p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Create account</h1>
          <p className="text-label-2">Start building with ContentEngine</p>
        </div>

        {/* OAuth */}
        <div className="space-y-2">
          <Button
            id="sign-up-github"
            type="button"
            variant="outline"
            className="w-full h-9 text-sm"
            onClick={() => handleOAuth("github")}
            disabled={oauthPending !== null}
          >
            {oauthPending === "github" ? "Redirecting…" : "Continue with GitHub"}
          </Button>
          <Button
            id="sign-up-google"
            type="button"
            variant="outline"
            className="w-full h-9 text-sm"
            onClick={() => handleOAuth("google")}
            disabled={oauthPending !== null}
          >
            {oauthPending === "google" ? "Redirecting…" : "Continue with Google"}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="divider-h flex-1" />
          <span className="text-label-3 shrink-0">or</span>
          <div className="divider-h flex-1" />
        </div>

        {/* Form */}
        <form id="sign-up-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-label-2">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              autoComplete="name"
              className="h-9 text-sm bg-input border-border placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-label-2">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="h-9 text-sm bg-input border-border placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-label-2">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              className="h-9 text-sm bg-input border-border placeholder:text-muted-foreground/50"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <Button
            id="sign-up-submit"
            type="submit"
            className="w-full h-9 text-sm font-medium"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-label-3 text-center mt-4">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
