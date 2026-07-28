import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import LandingDemoPreview from './landing-demo-preview';

export default function LandingHero() {
  return (
    <section className="pt-16 pb-20 px-6 max-w-[1200px] mx-auto w-full text-center space-y-10">

      {/* Badge — fades in first */}
      <div className="animate-fade-in delay-100 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717]/5 border border-[#171717]/10 text-xs font-medium text-[#171717] shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#0a72ef]" />
        <span>✨ Private Beta — Bring Your Own Key (BYOK) Access</span>
      </div>

      {/* Headline — each phrase staggered */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#171717] -tracking-[2px]">
          <span className="block animate-fade-in-up delay-200 mb-3">One Input.</span>
          <span className="block animate-fade-in-up delay-400 mb-3">Full Content Pack.</span>
          <span className="block animate-fade-in-up delay-600 mb-3">Your Voice.</span>
          <span className="block animate-fade-in-up delay-800">Every Platform.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-900 text-base sm:text-xl text-[#666666] max-w-2xl mx-auto leading-relaxed font-normal">
          Transform transcripts, blogs, or quick thoughts into platform-native posts, long-form SEO articles, visual carousels, and impact cards — matched to your unique brand voice.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="animate-fade-in-up delay-1000 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/sign-up"
          className="w-full sm:w-auto h-12 px-8 bg-[#171717] text-white font-semibold text-sm rounded-xl hover:bg-[#171717]/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Start Repurposing Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="#how-it-works"
          className="w-full sm:w-auto h-12 px-8 bg-white border border-[#ebebeb] text-[#171717] font-semibold text-sm rounded-xl hover:bg-[#fafafa] transition-colors flex items-center justify-center gap-2"
        >
          How It Works
        </a>
      </div>

      {/* Trust micro-signals */}
      <p className="animate-fade-in-up delay-1100 text-xs font-medium text-[#666666] flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>✓ No credit card required</span>
        <span className="hidden sm:inline text-[#ccc]">·</span>
        <span>✓ BYOK — your key, your data</span>
        <span className="hidden sm:inline text-[#ccc]">·</span>
        <span>✓ Private beta access</span>
      </p>

      {/* Demo Preview — fades up then floats on loop */}
      <div className="animate-fade-in-up delay-1200 pt-8">
        <div className="animate-float">
          <LandingDemoPreview />
        </div>
      </div>
    </section>
  );
}
