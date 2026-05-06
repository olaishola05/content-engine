"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

function GithubIcon() {
  return (
    <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg height="18" width="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

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
    <div className="w-full max-w-[400px] space-y-6 px-4">
      {/* Card */}
      <div className="surface-1 p-8 space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight leading-snug">
            Let&apos;s create<br />your account
          </h1>
        </div>

        {/* OAuth — primary options */}
        <div className="space-y-2">
          <Button
            id="sign-up-github"
            type="button"
            className="w-full h-10 text-sm font-medium gap-3"
            onClick={() => handleOAuth("github")}
            disabled={oauthPending !== null}
          >
            <GithubIcon />
            {oauthPending === "github" ? "Redirecting…" : "Continue with GitHub"}
          </Button>
          <Button
            id="sign-up-google"
            type="button"
            variant="outline"
            className="w-full h-10 text-sm font-medium gap-3"
            onClick={() => handleOAuth("google")}
            disabled={oauthPending !== null}
          >
            <GoogleIcon />
            {oauthPending === "google" ? "Redirecting…" : "Continue with Google"}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="divider-h flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="divider-h flex-1" />
        </div>

        {/* Email/password form */}
        <form id="sign-up-form" onSubmit={handleSubmit} className="space-y-3">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            required
            autoComplete="name"
            className="h-10 text-sm"
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            className="h-10 text-sm"
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password (min. 8 characters)"
            required
            autoComplete="new-password"
            className="h-10 text-sm"
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            id="sign-up-submit"
            type="submit"
            variant="outline"
            className="w-full h-10 text-sm font-medium"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Continue with Email →"}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-foreground font-medium hover:underline underline-offset-4">
          Log In
        </Link>
      </p>
    </div>
  );
}
