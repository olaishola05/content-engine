import CountUp from './count-up';
import ScrollReveal from './scroll-reveal';

const STATS = [
  { value: 5,   suffix: ' Formats',    sub: 'Text, Blogs, Carousels, Quotes & Scripts' },
  { value: 3,   suffix: ' Variations', sub: 'Per Platform with AI Hook Scoring' },
  { value: 100, suffix: '% On-Brand',  sub: 'Calibrated to Your Voice & Pillars' },
  { value: 1,   suffix: '-Click PDF',  sub: 'LinkedIn & Instagram Carousel Exports' },
];

export default function LandingMetrics() {
  return (
    <section className="border-y border-[#ebebeb] bg-white py-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, suffix, sub }, i) => (
          <ScrollReveal key={suffix} delay={i * 100}>
            <p className="text-3xl font-bold text-[#171717] tracking-tight">
              <CountUp to={value} suffix={suffix} duration={1000} />
            </p>
            <p className="text-xs text-[#666666] font-medium mt-1">{sub}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
