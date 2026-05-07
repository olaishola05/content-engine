"use server";

import { auth } from "@/lib/auth";
import { authRateLimit } from "@/lib/ratelimit";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Rate limiting
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await authRateLimit.limit(ip);
  if (!success) {
    return { error: "Too many requests. Please try again later." };
  }

  // 2. Validation
  const validatedFields = signUpSchema.safeParse({ name, email, password });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  // 3. BetterAuth Call
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });
  } catch (error) {
    return { error: (error as Error).message || "Failed to create account" };
  }
  return redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Rate limiting
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await authRateLimit.limit(ip);
  if (!success) {
    return { error: "Too many requests. Please try again later." };
  }

  // 2. Validation
  const validatedFields = signInSchema.safeParse({ email, password });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  // 3. BetterAuth Call
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  } catch (error) {
    return { error: (error as Error).message || "Invalid email or password" };
  }
  return redirect("/dashboard");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  return redirect("/sign-in");
}
