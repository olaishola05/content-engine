import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import { after } from "next/server";
import {
  getWelcomeEmailTemplate,
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
} from "./emails/templates";

// Fallback to "re_123" only to prevent crashes if env var is missing during build, 
// but it will fail to send if actually executed without a real key.
const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }: { user: { name: string; email: string }; url: string }) {
      // Use Next.js 15+ after() to execute email sending in the background
      after(async () => {
        try {
          await resend.emails.send({
            from: "ContentEngine <onboarding@resend.dev>",
            to: user.email,
            subject: "Reset your ContentEngine password",
            html: getPasswordResetEmailTemplate(user.name, url),
          });
        } catch (error) {
          console.error("Failed to send password reset email:", error);
        }
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }: { user: { name: string; email: string }; url: string }) {
      after(async () => {
        try {
          await resend.emails.send({
            from: "ContentEngine <onboarding@resend.dev>",
            to: user.email,
            subject: "Verify your ContentEngine email address",
            html: getVerificationEmailTemplate(user.name, url),
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
      });
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user: { name: string; email: string }) => {
          // Send Welcome Email in background using next/server after()
          after(async () => {
            try {
              await resend.emails.send({
                from: "ContentEngine <onboarding@resend.dev>",
                to: user.email,
                subject: "Welcome to ContentEngine!",
                html: getWelcomeEmailTemplate(user.name),
              });
            } catch (error) {
              console.error("Failed to send welcome email:", error);
            }
          });
        },
      },
    },
  },
});
