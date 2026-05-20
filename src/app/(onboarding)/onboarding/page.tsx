import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs text-[#4d4d4d] font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Step 1 of 3 — Brand Profile Setup
        </div>
        <h1 className="text-3xl font-semibold text-[#171717] tracking-tight -tracking-[1.28px]">
          Let&apos;s build your brand profile
        </h1>
        <p className="text-[#4d4d4d] text-base max-w-md mx-auto leading-relaxed">
          Every piece of content we generate will be informed by your unique brand voice, audience, and positioning.
        </p>
      </div>

      {/* Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Path A - Document Upload */}
        <Link
          id="path-a-btn"
          href="/onboarding/upload"
          className="group relative flex flex-col gap-5 p-6 rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(10,114,239,0.15),0_8px_16px_-6px_rgba(0,0,0,0.05),_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#fafafa]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5 text-[#0a72ef]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M12 18v-6" />
                <path d="m9 15 3-3 3 3" />
              </svg>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#ebf5ff] text-[#0068d6] text-[10px] font-bold border border-[#0068d6]/10 tracking-wide font-mono uppercase">
              Recommended
            </div>
          </div>

          {/* Micro-Visual Preview */}
          <div className="w-full h-28 rounded-xl bg-[#fafafa] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-[#ebebeb] flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-[#fafafa]/80 transition-colors">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <span className="text-[10px] text-[#808080] font-medium tracking-wide uppercase font-mono">PDF, DOCX, MD upload</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-[#171717] font-semibold text-base">I have brand documents</h2>
            <p className="text-[#4d4d4d] text-sm leading-relaxed">
              Upload up to 7 PDFs, Word docs, or Markdown files. Claude extracts a complete brand profile automatically.
            </p>
          </div>

          <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#0a72ef] font-semibold">
            <span>Extract Full Profile</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Path B - Questionnaire */}
        <Link
          id="path-b-btn"
          href="/onboarding/questionnaire"
          className="group relative flex flex-col gap-5 p-6 rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(222,29,141,0.15),0_8px_16px_-6px_rgba(0,0,0,0.05),_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#fafafa]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
              <svg className="w-5 h-5 text-[#de1d8d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8h.01" />
                <path d="M12 12h.01" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#de1d8d] text-[10px] font-bold border border-[#de1d8d]/10 tracking-wide font-mono uppercase">
              Interactive
            </div>
          </div>

          {/* Micro-Visual Preview */}
          <div className="w-full h-28 rounded-xl bg-[#fafafa] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-[#ebebeb] flex flex-col justify-between p-3.5 group-hover:bg-[#fafafa]/80 transition-colors">
            <div className="flex items-center justify-between text-[9px] text-[#808080] font-semibold tracking-wider font-mono">
              <span>WIZARD FLOW</span>
              <span className="text-emerald-600 font-bold uppercase">Answer progress</span>
            </div>
            <div className="h-7 rounded bg-white border border-[#ebebeb] flex items-center px-2 text-[10px] text-[#171717] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.01)] truncate">
              What industry or niche does your brand operate in?
            </div>
            <div className="w-full h-1 bg-[#ebebeb] rounded-full overflow-hidden">
              <div className="w-[43%] h-full bg-[#171717] rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-[#171717] font-semibold text-base">I&apos;m starting from scratch</h2>
            <p className="text-[#4d4d4d] text-sm leading-relaxed">
              Answer 7 quick questions. Claude generates a starter brand profile you can review and refine later.
            </p>
          </div>

          <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#de1d8d] font-semibold">
            <span>Start 7-Step Questionnaire</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      </div>

      <p className="text-center text-[#808080] text-xs">
        You can update your brand profile at any time from Settings.
      </p>
    </div>
  );
}
