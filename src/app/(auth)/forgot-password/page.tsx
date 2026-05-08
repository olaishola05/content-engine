"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.issues[0].message);
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsPending(true);

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      setIsSubmitted(true);
      toast.success("Password reset email sent (if account exists).");
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] space-y-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-title-2">Reset Password</h1>
        <p className="text-label">Enter your email address and we will send you a link to reset your password.</p>
      </div>

      {isSubmitted ? (
        <div className="vercel-card-elevated p-6 text-center space-y-4">
          <p className="text-sm text-[#171717]">
            Check your inbox for a reset link. You can close this window.
          </p>
          <Link href="/sign-in" className="btn-vercel-outline w-full inline-block">
            Return to Log In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              id="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888]"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
            />
            {emailError && <p className="text-xs text-[#e00]">{emailError}</p>}
          </div>

          <button
            type="submit"
            className="btn-vercel-primary w-full"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      {!isSubmitted && (
        <p className="text-center text-label">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-[#0072f5] hover:underline font-medium">
            Log In
          </Link>
        </p>
      )}
    </div>
  );
}
