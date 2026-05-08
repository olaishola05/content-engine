"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validations/auth";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Evaluate the password against the Zod schema in real-time
  const passwordResult = passwordSchema.safeParse(password);
  const passwordErrors = passwordResult.success ? [] : passwordResult.error.issues.map(i => i.message);

  const hasMinLength = password.length > 0 && !passwordErrors.includes("Password must be at least 8 characters");
  const hasLetter = password.length > 0 && !passwordErrors.includes("Password must contain at least one letter");
  const hasNumber = password.length > 0 && !passwordErrors.includes("Password must contain at least one number");
  const isPasswordValid = passwordResult.success;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please ensure your new password meets all the security requirements.");
      return;
    }

    setIsPending(true);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token: token
      });
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch {
      toast.error("Failed to reset password. The link might be expired.");
    } finally {
      setIsPending(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-md text-[#e00]">
        Invalid or missing password reset token. Please request a new one.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <input
          type="password"
          required
          placeholder="New Password"
          className="w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      </div>

      <input
        type="password"
        required
        placeholder="Confirm New Password"
        className="w-full h-10 px-3 bg-white text-[#171717] border border-[#ebebeb] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0072f5] focus:border-transparent placeholder:text-[#888]"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        className="btn-vercel-primary w-full"
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-[400px] space-y-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-title-2">Create New Password</h1>
        <p className="text-label">Enter your new password below.</p>
      </div>

      <Suspense fallback={<p className="text-center text-sm text-[#888]">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
