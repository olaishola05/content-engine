import LandingNavbar from '../components/landing/landing-navbar';
import LandingHero from '../components/landing/landing-hero';
import LandingMetrics from '../components/landing/landing-metrics';
import LandingHowItWorks from '../components/landing/landing-how-it-works';
import LandingBrandIngestion from '../components/landing/landing-brand-ingestion';
import LandingBeforeAfter from '../components/landing/landing-before-after';
import LandingPlatformMatrix from '../components/landing/landing-platform-matrix';
import LandingTestimonials from '../components/landing/landing-testimonials';
import LandingPricing from '../components/landing/landing-pricing';
import LandingSecurityBanner from '../components/landing/landing-security-banner';
import LandingFAQ from '../components/landing/landing-faq';
import LandingFinalCTA from '../components/landing/landing-final-cta';
import LandingFooter from '../components/landing/landing-footer';

export const metadata = {
  title: 'ContentEngine — One Input. Full Content Pack. Your Voice.',
  description:
    'Repurpose transcripts, blogs, and ideas into platform-native posts, long-form SEO articles, visual carousels, and impact cards in 60 seconds.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans flex flex-col selection:bg-[#171717] selection:text-white">
      <LandingNavbar />
      <LandingHero />
      <LandingMetrics />
      <LandingHowItWorks />
      <LandingBrandIngestion />
      <LandingBeforeAfter />
      <LandingPlatformMatrix />
      <LandingTestimonials />
      <LandingPricing />
      <LandingSecurityBanner />
      <section id="faq" className="py-20 px-6 max-w-[1200px] mx-auto w-full space-y-12 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-[#171717] -tracking-[1.2px]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#666666]">Everything you need to know about ContentEngine V1.</p>
        </div>
        <LandingFAQ />
      </section>
      <LandingFinalCTA />
      <LandingFooter />
    </div>
  );
}
