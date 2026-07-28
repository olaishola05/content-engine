import { Check, X } from 'lucide-react';
import ScrollReveal from './scroll-reveal';

export default function LandingBeforeAfter() {
  return (
    <section id="features" className="py-20 px-6 max-w-[1200px] mx-auto w-full space-y-12">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">
            Say Goodbye to the Manual Repurposing Tax
          </h2>
          <p className="text-sm text-[#666666]">
            Stop spending hours rewriting the same idea for five different platforms.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ScrollReveal delay={100}>
          <div className="bg-white rounded-2xl p-8 border border-[#ebebeb] space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#171717]">Manual Repurposing</h3>
            </div>
            <ul className="space-y-4 text-sm text-[#666666]">
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Spend 4 to 6 hours adapting one idea across platforms</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Generic ChatGPT outputs that sound robotic and off-brand</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Manual Canva design for LinkedIn and Instagram carousels</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>No hook scoring to know what will actually perform</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-[#171717] text-white rounded-2xl p-8 border border-[#262626] space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0a72ef]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#27c93f]/20 text-[#27c93f] flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">With ContentEngine</h3>
            </div>
            <ul className="space-y-4 text-sm text-[#d4d4d4]">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>Generate a complete 5-platform content pack in 60 seconds</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>100% matched to your brand tone, audience, and content pillars</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>Instant high-res 4:5 and 9:16 PDF/PNG carousels &amp; quote cards</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>AI-powered hook scoring &amp; recommendations per variation</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
