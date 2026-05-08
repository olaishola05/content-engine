"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { GithubIcon, GoogleIcon } from "@/components/icons";



function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888] ${className}`}
      {...props}
    />
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const [oauthPending, setOauthPending] = useState<"github" | "google" | null>(null);

  function handleEmailContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!showPassword) {
      setShowPassword(true);
      return;
    }
    setError(null);
    setFieldErrors({});
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (result?.error) {
        if (typeof result.error === "object") {
          setFieldErrors(result.error);
          toast.error("Please fill in all required fields.");
        } else {
          setError(result.error);
          toast.error(result.error);
        }
      } else {
        toast.success("Successfully signed in!");
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
    <div className="w-full max-w-[400px] space-y-8 px-4">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-title-2">Log in to ContentEngine</h1>
      </div>

      {/* Form area (no visible card container for Vercel's login form, just inputs) */}
      <div className="space-y-4">
        {/* Email form */}
        <form onSubmit={handleEmailContinue} className="space-y-4">
          <div className="space-y-1">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: [] }));
              }}
            />
            {fieldErrors.email?.length > 0 && <p className="text-xs text-[#e00]">{fieldErrors.email[0]}</p>}
          </div>

          {showPassword && (
            <div className="space-y-1">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors(prev => ({ ...prev, password: [] }));
                }}
              />
              {fieldErrors.password?.length > 0 && <p className="text-xs text-[#e00]">{fieldErrors.password[0]}</p>}
              <div className="flex justify-end pt-1">
                <Link href="/forgot-password" className="text-xs text-[#0072f5] hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-[#e00]">{error}</p>}

          <button
            id="sign-in-email"
            type="submit"
            className="btn-vercel-primary w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in…" : "Continue with Email"}
          </button>
        </form>

        {/* OAuth */}
        <div className="space-y-3 pt-2">
          <button
            id="sign-in-github"
            type="button"
            className="btn-vercel-outline w-full flex items-center justify-center gap-3"
            onClick={() => handleOAuth("github")}
            disabled={oauthPending !== null}
          >
            <GithubIcon />
            {oauthPending === "github" ? "Redirecting…" : "Continue with GitHub"}
          </button>
          
          <button
            id="sign-in-google"
            type="button"
            className="btn-vercel-outline w-full flex items-center justify-center gap-3"
            onClick={() => handleOAuth("google")}
            disabled={oauthPending !== null}
          >
            <GoogleIcon />
            {oauthPending === "google" ? "Redirecting…" : "Continue with Google"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-label">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[#0072f5] hover:text-[#005cce] font-medium transition-colors">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
