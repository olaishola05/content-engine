"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { passwordSchema } from "@/lib/validations/auth";



function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888] ${className}`}
      {...props}
    />
  );
}

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [oauthPending, setOauthPending] = useState<"github" | "google" | null>(null);

  // Evaluate the password against the Zod schema in real-time
  const passwordResult = passwordSchema.safeParse(password);
  const passwordErrors = passwordResult.success ? [] : passwordResult.error.issues.map(i => i.message);

  const hasMinLength = password.length > 0 && !passwordErrors.includes("Password must be at least 8 characters");
  const hasLetter = password.length > 0 && !passwordErrors.includes("Password must contain at least one letter");
  const hasNumber = password.length > 0 && !passwordErrors.includes("Password must contain at least one number");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result?.error) {
        if (typeof result.error === "object") {
          setFieldErrors(result.error);
          toast.error("Please fix the errors in the form.");
        } else {
          setError(result.error);
          toast.error(result.error);
        }
      } else {
        toast.success("Account created! Please check your email to verify.");
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
    <div className="w-full max-w-[480px] px-4">
      <div className="vercel-card-elevated p-10 space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-title-2">Let&apos;s create your account</h1>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button
            id="sign-up-github"
            type="button"
            className="btn-vercel-primary w-full flex items-center justify-center gap-3"
            onClick={() => handleOAuth("github")}
            disabled={oauthPending !== null}
          >
            <GithubIcon />
            {oauthPending === "github" ? "Redirecting…" : "Continue with GitHub"}
          </button>

          <button
            id="sign-up-google"
            type="button"
            className="btn-vercel-outline w-full flex items-center justify-center gap-3"
            onClick={() => handleOAuth("google")}
            disabled={oauthPending !== null}
          >
            <GoogleIcon />
            {oauthPending === "google" ? "Redirecting…" : "Continue with Google"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="divider-h flex-1 bg-[#ebebeb] h-px" />
          <span className="text-xs text-[#888]">or</span>
          <div className="divider-h flex-1 bg-[#ebebeb] h-px" />
        </div>

        {/* Form */}
        <form id="sign-up-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              required
              autoComplete="name"
              onChange={() => setFieldErrors(prev => ({ ...prev, name: [] }))}
            />
            {fieldErrors.name?.length > 0 && <p className="text-xs text-[#e00]">{fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-1">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              autoComplete="email"
              onChange={() => setFieldErrors(prev => ({ ...prev, email: [] }))}
            />
            {fieldErrors.email?.length > 0 && <p className="text-xs text-[#e00]">{fieldErrors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors(prev => ({ ...prev, password: [] }));
              }}
            />
            
            {/* Password Strength UI */}
            <div className="space-y-1 pt-1">
              <p className={`text-[11px] font-medium flex items-center gap-1.5 ${hasMinLength ? 'text-[#0070f3]' : 'text-[#888]'}`}>
                <span>{hasMinLength ? '✓' : '○'}</span> At least 8 characters
              </p>
              <p className={`text-[11px] font-medium flex items-center gap-1.5 ${hasLetter ? 'text-[#0070f3]' : 'text-[#888]'}`}>
                <span>{hasLetter ? '✓' : '○'}</span> At least one letter
              </p>
              <p className={`text-[11px] font-medium flex items-center gap-1.5 ${hasNumber ? 'text-[#0070f3]' : 'text-[#888]'}`}>
                <span>{hasNumber ? '✓' : '○'}</span> At least one number
              </p>
            </div>
            
            {fieldErrors.password?.length > 0 && <p className="text-xs text-[#e00]">{fieldErrors.password[0]}</p>}
          </div>

          {error && <p className="text-xs text-[#e00]">{error}</p>}

          <button
            id="sign-up-submit"
            type="submit"
            className="btn-vercel-outline w-full"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Continue with Email"}
          </button>
        </form>
      </div>

      <p className="text-center text-label mt-8">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#0072f5] hover:text-[#005cce] font-medium transition-colors">
          Log In
        </Link>
      </p>
    </div>
  );
}
