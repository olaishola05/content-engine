import { CheckCircle2 } from 'lucide-react';

export default function LandingBrandIngestion() {
  return (
    <section className="py-20 bg-white border-y border-[#ebebeb] px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-[#ebf5ff] text-[#0068d6] rounded-full">
            Brand Profile Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] -tracking-[1.4px] leading-tight">
            Brand Voice Ingestion — Upload Docs, Never Rewrite AI Again
          </h2>
          <p className="text-base text-[#666666] leading-relaxed">
            Upload your brand guidelines, past top-performing posts, or company documentation in PDF, DOCX, or Markdown. ContentEngine extracts your exact voice, niche, and content pillars to calibrate all future generations.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-medium text-[#171717]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#27c93f]" />
              <span>Automatic Pillar Parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#27c93f]" />
              <span>Target Audience Mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#27c93f]" />
              <span>Custom Tone Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#27c93f]" />
              <span>AES-256 Storage</span>
            </div>
          </div>
        </div>

        {/* Extracted Brand Profile Mockup Card */}
        <div className="bg-[#fafafa] p-8 rounded-2xl border border-[#ebebeb] space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#808080] border-b border-[#ebebeb] pb-3">
            <span className="font-mono">BrandProfile_Extracted.json</span>
            <span className="text-[#27c93f] font-semibold">Active Profile</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#ebebeb]">
              <span className="text-[#808080]">NICHE:</span>{' '}
              <span className="text-[#171717] font-semibold">B2B SaaS &amp; Creator Economy</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#ebebeb]">
              <span className="text-[#808080]">AUDIENCE:</span>{' '}
              <span className="text-[#171717] font-semibold">Solopreneurs, Founders &amp; Creators</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#ebebeb]">
              <span className="text-[#808080]">TONE:</span>{' '}
              <span className="text-[#0a72ef] font-semibold">Direct, Educational, Storytelling</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#ebebeb]">
              <span className="text-[#808080]">PILLARS:</span>{' '}
              <span className="text-[#171717] font-semibold">
                [&apos;AI Productivity&apos;, &apos;Content Distribution&apos;, &apos;Growth&apos;]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
