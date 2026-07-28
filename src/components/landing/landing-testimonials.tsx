import ScrollReveal from './scroll-reveal';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "ContentEngine completely replaced my manual Canva and ChatGPT workflow. I turn my weekly podcast transcript into 5 platform packs in 2 minutes.",
    author: "Alex Rivera",
    role: "Founder & Creator, TechUnfiltered",
    avatar: "AR",
    rating: 5,
  },
  {
    quote: "The hook scoring is ridiculously accurate. The variation with the highest score on ContentEngine got 4x our usual engagement on LinkedIn.",
    author: "Sarah Chen",
    role: "Head of Growth, ScaleStack",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "Uploading our brand guideline PDF was a game-changer. The output actually sounds like our team wrote it — zero generic AI buzzwords.",
    author: "Marcus Vance",
    role: "B2B SaaS Solopreneur",
    avatar: "MV",
    rating: 5,
  },
];

export default function LandingTestimonials() {
  return (
    <section className="py-20 bg-white border-y border-[#ebebeb] px-6">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-[#f3f4f6] text-[#374151] rounded-full">
              Beta Tester Feedback
            </span>
            <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">
              Loved by Founders, Creators &amp; Growth Teams
            </h2>
            <p className="text-sm text-[#666666]">
              Here is what early private beta testers are saying about ContentEngine.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(({ quote, author, role, avatar, rating }, i) => (
            <ScrollReveal key={author} delay={i * 100}>
              <div className="bg-[#fafafa] p-8 rounded-2xl border border-[#ebebeb] space-y-6 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#f59e0b]">
                    {Array.from({ length: rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#333333] leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#ebebeb]">
                  <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">{author}</p>
                    <p className="text-xs text-[#808080]">{role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
