import ScrollReveal from './scroll-reveal';

const PLATFORMS = [
  { icon: '𝕏',  title: '𝕏 Threads & Posts',       desc: '5-tweet structured threads with punchy hooks and engagement CTAs.' },
  { icon: '💼', title: 'LinkedIn Posts & PDFs',     desc: 'Long-form storytelling posts plus 1-click PDF document exports.' },
  { icon: '📸', title: 'Instagram 4:5 Carousels',   desc: '7-slide narrative arc visual carousels exported as high-res PNGs.' },
  { icon: '🎵', title: 'TikTok Photo Mode',          desc: '9:16 vertical 3-to-5 slide visual slides and video scripts.' },
  { icon: '▶️', title: 'YouTube SEO Layer',          desc: 'High-search titles, optimized descriptions, and relevant tags.' },
  { icon: '📝', title: 'Long-Form SEO Blogs',        desc: 'Traditional search & AI search engine (AEO/GEO) optimized articles.' },
];

export default function LandingPlatformMatrix() {
  return (
    <section id="outputs" className="py-20 bg-white border-y border-[#ebebeb] px-6">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">
              Outputs Optimised for Every Major Platform
            </h2>
            <p className="text-sm text-[#666666]">
              Native formats tailored to the exact character limits, hook styles, and visual ratios of each channel.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map(({ icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 80}>
              <div className="p-6 bg-[#fafafa] rounded-xl border border-[#ebebeb] space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-base font-semibold text-[#171717]">{title}</h3>
                <p className="text-xs text-[#666666]">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
