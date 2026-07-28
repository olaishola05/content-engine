import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LandingSecurityBanner() {
  return (
    <section id="byok-security" className="py-20 px-6 max-w-[1200px] mx-auto w-full">
      <div className="bg-[#171717] text-white rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0a72ef]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#27c93f]" />
          <span>BYOK Access &amp; Privacy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold -tracking-[1.4px]">
          Your API Keys Are AES-256 Encrypted &amp; Stored Securely
        </h2>
        <p className="text-base text-[#a1a1a1] max-w-2xl leading-relaxed">
          ContentEngine operates on a Bring-Your-Own-Key (BYOK) model for beta testers. Enter your Anthropic API key once in your Settings — it is encrypted with AES-256-GCM and never shared or logged.
        </p>
        <div className="pt-2">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#171717] font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors"
          >
            Get Started with BYOK →
          </Link>
        </div>
      </div>
    </section>
  );
}
