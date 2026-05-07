"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email to resend the link.");
      return;
    }
    
    setIsPending(true);
    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/dashboard"
      });
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] space-y-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-title-2">Verify your email</h1>
        <p className="text-label">
          We sent a verification link to your email address. Please click the link to verify your account before logging in.
        </p>
      </div>

      <div className="vercel-card-elevated p-6 space-y-4">
        <p className="text-sm text-center text-[#171717] font-medium">
          Didn&apos;t receive the email?
        </p>
        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your email to resend"
            className="w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn-vercel-outline w-full"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Resend Verification Link"}
          </button>
        </form>
      </div>

      <p className="text-center text-label">
        Verified?{" "}
        <Link href="/sign-in" className="text-[#0072f5] hover:underline font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}
