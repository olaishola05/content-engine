import ScrollReveal from './scroll-reveal';
import { ArrowRight } from 'lucide-react';

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 max-w-[1200px] mx-auto w-full space-y-12">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">
            How ContentEngine Works
          </h2>
          <p className="text-sm text-[#666666]">
            Three simple steps from raw idea or transcript to a complete multi-platform content pack.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <ScrollReveal delay={100}>
          <div className="bg-white p-8 rounded-2xl border border-[#ebebeb] space-y-4 shadow-sm relative h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <span className="hidden md:block text-[#d4d4d4] font-bold text-xl">→</span>
              </div>
              <h3 className="text-lg font-semibold text-[#171717]">Set Your Brand Profile</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Upload a brand PDF/DOCX document or answer a quick questionnaire to define your voice, audience, and pillars.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f3f4f6] text-xs font-medium text-[#0a72ef]">
              Step 1: One-time setup
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-white p-8 rounded-2xl border border-[#ebebeb] space-y-4 shadow-sm relative h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <span className="hidden md:block text-[#d4d4d4] font-bold text-xl">→</span>
              </div>
              <h3 className="text-lg font-semibold text-[#171717]">Input Any Content</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Paste a YouTube transcript, LinkedIn post, blog article, document, or simply a raw topic or idea.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f3f4f6] text-xs font-medium text-[#0a72ef]">
              Step 2: Flexible inputs
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="bg-white p-8 rounded-2xl border border-[#ebebeb] space-y-4 shadow-sm relative h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <span className="text-[#27c93f] font-bold text-sm bg-[#ecfdf5] px-2 py-0.5 rounded">60s</span>
              </div>
              <h3 className="text-lg font-semibold text-[#171717]">Export Full Pack</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Review 3 hook-scored variations per platform and export PDF carousels, impact cards, and long-form articles.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f3f4f6] text-xs font-medium text-[#27c93f]">
              Step 3: Instant export
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
