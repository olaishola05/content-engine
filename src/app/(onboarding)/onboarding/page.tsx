import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Step 1 of 3 — Brand Profile Setup
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Let&apos;s build your brand profile
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
          Every piece of content we generate will be informed by your unique brand voice, audience, and positioning.
        </p>
      </div>

      {/* Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Path A */}
        <Link
          id="path-a-btn"
          href="/onboarding/upload"
          className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
            📄
          </div>
          <div className="space-y-1.5">
            <h2 className="text-white font-semibold text-base">I have brand documents</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Upload up to 7 PDFs, Word docs, or Markdown files. Claude extracts a complete brand profile automatically.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
            <span>Full profile</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-medium border border-indigo-500/20">
            RECOMMENDED
          </div>
        </Link>

        {/* Path B */}
        <Link
          id="path-b-btn"
          href="/onboarding/questionnaire"
          className="group flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-lg">
            ✏️
          </div>
          <div className="space-y-1.5">
            <h2 className="text-white font-semibold text-base">I&apos;m starting from scratch</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Answer 7 quick questions. Claude generates a starter brand profile you can refine later.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-1.5 text-xs text-violet-400 font-medium">
            <span>Basic profile · 2 min</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
        </Link>
      </div>

      <p className="text-center text-white/30 text-xs">
        You can update your brand profile at any time from Settings.
      </p>
    </div>
  );
}
