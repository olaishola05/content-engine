import Link from 'next/link';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import ScrollReveal from './scroll-reveal';

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-20 px-6 max-w-[1200px] mx-auto w-full space-y-12">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-[#ecfdf5] text-[#047857] rounded-full">
            Transparent Access
          </span>
          <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">
            Simple &amp; Free During Private Beta
          </h2>
          <p className="text-sm text-[#666666]">
            Bring your own Anthropic API key. Zero markup, zero platform fees during testing.
          </p>
        </div>
      </ScrollReveal>

      <div className="max-w-md mx-auto">
        <ScrollReveal delay={100}>
          <div className="bg-white rounded-3xl p-8 border-2 border-[#171717] space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#171717] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Private Beta
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#171717]">BYOK Tester Pass</h3>
              <p className="text-xs text-[#666666]">For early adopters, creators &amp; founders</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#171717]">$0</span>
              <span className="text-xs text-[#808080]">/ month platform fee</span>
            </div>

            <ul className="space-y-3 text-xs text-[#333333]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span><strong>Unlimited generations</strong> using your Anthropic key</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>All 5 platform outputs (𝕏, LinkedIn, IG, TikTok, SEO)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>Brand voice ingestion &amp; document parsing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>1-Click PDF Carousel &amp; Impact Card PNG exports</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#27c93f] shrink-0 mt-0.5" />
                <span>AES-256 encrypted API key storage</span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="w-full h-12 bg-[#171717] text-white font-semibold text-sm rounded-xl hover:bg-[#171717]/90 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Get Beta Access →
            </Link>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#808080]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#27c93f]" />
              <span>Keys are encrypted &amp; never logged</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
