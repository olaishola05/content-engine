import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from './scroll-reveal';

export default function LandingFinalCTA() {
  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto w-full">
      <ScrollReveal>
        <div className="bg-[#171717] text-white rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-[#0a72ef]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#0a72ef]" />
            <span>Ready to scale your content engine?</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white -tracking-[1.5px] leading-tight">
              Start Generating 5-Platform Packs in 60 Seconds
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1a1] max-w-xl mx-auto leading-relaxed">
              Stop spending hours on manual repurposing. Join the private beta and turn your ideas into high-performing content today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto h-12 px-8 bg-white text-[#171717] font-semibold text-sm rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Get Started Free Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-[#808080]">
            No credit card required &nbsp;·&nbsp; Bring your own Anthropic key &nbsp;·&nbsp; Setup in 1 minute
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
