'use client';

import { useState } from 'react';
import { FileText, Sparkles, Layers, Quote, ChevronLeft, ChevronRight, ArrowRight, Check, Copy, Heart, Repeat, MessageSquare, Download } from 'lucide-react';

const TABS = [
  { key: 'linkedin', label: 'LinkedIn Post',  icon: FileText },
  { key: 'x',        label: '𝕏 Thread',       icon: Sparkles },
  { key: 'carousel', label: 'PDF Carousel',    icon: Layers   },
  { key: 'quote',    label: 'Impact Card',     icon: Quote    },
] as const;

type Tab = typeof TABS[number]['key'];

interface CarouselSlide {
  num: string;
  tag: string;
  tagBg: string;
  title: string;
  subtitle: string;
  accentColor: string;
  list?: string[];
  metric?: { label: string; val: string; pct: number; color: string }[];
}

const CAROUSEL_PAIRS: [CarouselSlide, CarouselSlide][] = [
  [
    {
      num: 'SLIDE 01 / 07',
      tag: 'COVER STORY',
      tagBg: 'bg-[#0a72ef]/20 text-[#4da3ff] border-[#0a72ef]/40',
      title: 'How to Repurpose Content in 60 Seconds',
      subtitle: 'A step-by-step framework for founders & creators to publish across 5 channels without manual work.',
      accentColor: '#0a72ef',
      list: [
        'One-Time Voice Calibration',
        '3 Variations per Platform',
        '1-Click PDF & PNG Export',
      ],
    },
    {
      num: 'SLIDE 02 / 07',
      tag: 'THE PROBLEM',
      tagBg: 'bg-[#dc2626]/20 text-[#f87171] border-[#dc2626]/40',
      title: 'Creating content for 5 platforms takes 6+ hours every week.',
      subtitle: 'Generic AI sounds robotic. Manual Canva formatting is tedious.',
      accentColor: '#dc2626',
      metric: [
        { label: 'Writing × 5 platforms', val: '6h', pct: 88, color: '#f87171' },
        { label: 'Canva carousels', val: '3h', pct: 55, color: '#fb923c' },
        { label: 'YouTube SEO copy', val: '2h', pct: 33, color: '#facc15' },
        { label: 'ContentEngine ✓', val: '1m', pct: 4, color: '#4ade80' },
      ],
    },
  ],
  [
    {
      num: 'SLIDE 03 / 07',
      tag: 'THE SOLUTION',
      tagBg: 'bg-[#eab308]/20 text-[#fde047] border-[#eab308]/40',
      title: 'Upload Brand Voice Docs Once.',
      subtitle: 'ContentEngine extracts your tone, audience, and pillars to calibrate all future generations.',
      accentColor: '#eab308',
      list: [
        'Automatic Pillar Parsing',
        'Target Audience Mapping',
        'Custom Tone Profiles',
      ],
    },
    {
      num: 'SLIDE 07 / 07',
      tag: '1-CLICK EXPORT',
      tagBg: 'bg-[#27c93f]/20 text-[#4ade80] border-[#27c93f]/40',
      title: 'Export 4:5 PDFs & 9:16 PNGs Instantly.',
      subtitle: 'Ready to post directly to LinkedIn, Instagram & TikTok with zero design tool overhead.',
      accentColor: '#27c93f',
      list: [
        'LinkedIn Document PDF',
        'Instagram 4:5 Portrait PNG',
        'TikTok Vertical Photo Mode',
      ],
    },
  ],
];

export default function LandingDemoPreview() {
  const [active, setActive] = useState<Tab>('linkedin');
  const [pairIdx, setPairIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextPair = () => {
    setPairIdx((prev) => (prev + 1) % CAROUSEL_PAIRS.length);
  };

  const prevPair = () => {
    setPairIdx((prev) => (prev - 1 + CAROUSEL_PAIRS.length) % CAROUSEL_PAIRS.length);
  };

  const [slideA, slideB] = CAROUSEL_PAIRS[pairIdx];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden text-left border border-[#262626]"
      style={{ background: '#111', boxShadow: '0 24px 60px -10px rgba(0,0,0,0.6)' }}
    >
      {/* ── Chrome bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d0d0d] border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-[11px] font-mono text-[#555]">content-pack-generator · v1</span>
        </div>
        <div className="text-[11px] font-mono text-[#555] hidden sm:block">
          BYOK Security Enabled
        </div>
      </div>

      {/* ── Tab bar — high contrast, clearly readable ── */}
      <div className="flex items-center gap-0 border-b border-[#1f1f1f] bg-[#161616] px-4 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              active === key
                ? 'border-white text-white'
                : 'border-transparent text-[#888] hover:text-[#ccc] hover:border-[#444]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      <div className="p-6 sm:p-8">

        {/* ── Bolder LinkedIn Post Preview ── */}
        {active === 'linkedin' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#0a72ef]/20 text-[#60aaff] border border-[#0a72ef]/40 rounded-full">
                Variation 1 of 3 · AI Score: 94/100
              </span>
              <span className="text-xs text-[#a1a1aa] font-mono font-medium">Hook: Counter-Intuitive Story</span>
            </div>

            {/* Authentic LinkedIn Post Card */}
            <div className="bg-[#141416] rounded-2xl border-2 border-[#2a2a2e] p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0a72ef]/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Creator Profile Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a72ef] to-[#1e40af] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    AR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white">Alex Rivera</p>
                      <span className="text-[10px] bg-[#0a72ef]/20 text-[#60aaff] px-1.5 py-0.2 rounded font-semibold">1st</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa]">Founder @ ContentEngine · 1h · 🌐</p>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/15"
                >
                  <Copy className="w-3.5 h-3.5 text-[#27c93f]" />
                  <span>{copied ? 'Copied!' : 'Copy Post'}</span>
                </button>
              </div>

              {/* High-Impact Post Body */}
              <div className="space-y-4 pt-1">
                <h4 className="text-xl sm:text-2xl font-black text-white leading-snug -tracking-[0.5px]">
                  Most founders spend 10 hours a week rewriting the same content for 5 platforms.
                </h4>
                <p className="text-sm sm:text-base font-medium text-[#d4d4d8] leading-relaxed">
                  Here is how I cut that down to 60 seconds — without losing my unique brand voice:
                </p>

                <div className="space-y-2.5 text-sm font-semibold text-white bg-white/5 p-4 rounded-xl border border-white/10 leading-relaxed">
                  <p className="flex items-center gap-2"><span className="text-[#0a72ef]">→</span> <span>Upload your brand positioning doc once.</span></p>
                  <p className="flex items-center gap-2"><span className="text-[#0a72ef]">→</span> <span>Input any transcript, article, or raw idea.</span></p>
                  <p className="flex items-center gap-2"><span className="text-[#0a72ef]">→</span> <span>Receive a 5-platform hook-scored pack instantly.</span></p>
                </div>
              </div>

              {/* Hashtags & Engagement Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#a1a1aa] font-medium flex-wrap gap-2">
                <p className="text-[#60aaff]">#ContentStrategy #AITools #Founders #PersonalBranding</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-white">👍 142 Likes</span>
                  <span>·</span>
                  <span>28 Comments</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Connected 𝕏 Thread Preview ── */}
        {active === 'x' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/25 rounded-full">
                5-Tweet Thread · Variation 2 (Recommended)
              </span>
              <span className="text-xs text-[#a1a1aa] font-mono font-medium">Hook: Surprising Insight</span>
            </div>

            {/* Connected Thread Container */}
            <div className="bg-[#141416] rounded-2xl border-2 border-[#2a2a2e] p-6 sm:p-8 space-y-6 shadow-2xl relative">
              {[
                {
                  num: '1/5',
                  text: "You don't need a 5-person content team to show up everywhere.",
                  note: 'What you actually need is one brand profile that turns any input into a platform-native pack. 🧵',
                  likes: '219',
                  reposts: '42',
                },
                {
                  num: '2/5',
                  text: "The problem isn't that AI can't write. It's that AI doesn't know YOUR voice.",
                  note: 'ContentEngine pulls from your uploaded brand docs to calibrate every single generation.',
                  likes: '184',
                  reposts: '31',
                },
                {
                  num: '3/5',
                  text: 'Set it once. Repurpose forever.',
                  note: 'Upload a PDF or DOCX — define your niche, tone, pillars. Every generation after sounds like you.',
                  likes: '256',
                  reposts: '58',
                },
              ].map(({ num, text, note, likes, reposts }, idx, arr) => (
                <div key={num} className="relative flex gap-4">
                  {/* Avatar & Vertical Thread Connector Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#171717] border border-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      AR
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="w-0.5 flex-1 bg-white/20 my-1" />
                    )}
                  </div>

                  {/* Tweet Content */}
                  <div className="space-y-2 pb-2 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">Alex Rivera</span>
                        <span className="text-[#a1a1aa]">@alexrivera</span>
                      </div>
                      <span className="font-mono font-bold text-[#60aaff] bg-[#0a72ef]/10 px-2 py-0.5 rounded text-[10px]">{num}</span>
                    </div>

                    <p className="text-base font-bold text-white leading-snug">{text}</p>
                    <p className="text-xs font-medium text-[#a1a1aa] leading-relaxed">{note}</p>

                    {/* Metric Actions */}
                    <div className="flex items-center gap-6 pt-1 text-xs text-[#a1a1aa]">
                      <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" /> 14
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-[#4ade80] transition-colors">
                        <Repeat className="w-3.5 h-3.5" /> {reposts}
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-[#f87171] transition-colors">
                        <Heart className="w-3.5 h-3.5" /> {likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Option A: Panoramic 2-Slide Ribbon (Bolder Editorial 4:5 Ratios) ── */}
        {active === 'carousel' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#de1d8d]/15 text-[#f472b6] border border-[#de1d8d]/25 rounded-full">
                  4:5 Carousel · Pair {pairIdx + 1} of {CAROUSEL_PAIRS.length}
                </span>
                <span className="text-xs text-[#27c93f] font-semibold hidden sm:inline">
                  ✓ High-Res PDF Export
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPair}
                  className="p-1.5 rounded-lg bg-[#222] border border-[#333] text-white hover:bg-[#333] transition-colors"
                  aria-label="Previous Pair"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextPair}
                  className="p-1.5 rounded-lg bg-[#222] border border-[#333] text-white hover:bg-[#333] transition-colors"
                  aria-label="Next Pair"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Side-by-Side 4:5 Bolder Portrait Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1 in Pair */}
              <div className="aspect-[4/5] rounded-2xl border-2 border-[#333338] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-300 bg-[#121214] hover:border-white/30"
              >
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: slideA.accentColor }} />

                {/* Top Header */}
                <div className="relative flex items-center justify-between pb-3 border-b border-white/15 z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-white text-[#171717] flex items-center justify-center font-black text-[10px]">C</div>
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider">ContentEngine</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full border tracking-wide ${slideA.tagBg}`}>{slideA.tag}</span>
                </div>

                {/* Center Content — Bolder Typography */}
                <div className="relative py-4 space-y-4 z-10 my-auto">
                  <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight -tracking-[0.8px]">
                    {slideA.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-[#a1a1aa] leading-relaxed">
                    {slideA.subtitle}
                  </p>

                  {slideA.list && (
                    <div className="space-y-2 pt-2">
                      {slideA.list.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-white">
                          <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer */}
                <div className="relative pt-3 border-t border-white/15 flex items-center justify-between z-10 text-[10px] text-[#a1a1aa] font-medium">
                  <span>1080×1350 · 4:5 PORTRAIT</span>
                  <span className="font-mono font-bold text-white">{slideA.num}</span>
                </div>
              </div>

              {/* Card 2 in Pair */}
              <div className="aspect-[4/5] rounded-2xl border-2 border-[#333338] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-300 bg-[#121214] hover:border-white/30 hidden md:flex"
              >
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: slideB.accentColor }} />

                {/* Top Header */}
                <div className="relative flex items-center justify-between pb-3 border-b border-white/15 z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-white text-[#171717] flex items-center justify-center font-black text-[10px]">C</div>
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider">ContentEngine</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full border tracking-wide ${slideB.tagBg}`}>{slideB.tag}</span>
                </div>

                {/* Center Content — Bolder Typography */}
                <div className="relative py-4 space-y-4 z-10 my-auto">
                  <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight -tracking-[0.8px]">
                    {slideB.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-[#a1a1aa] leading-relaxed">
                    {slideB.subtitle}
                  </p>

                  {slideB.metric && (
                    <div className="space-y-2.5 pt-2">
                      {slideB.metric.map(({ label, val, pct, color }) => (
                        <div key={label} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium" style={{ color: color === '#4ade80' ? color : '#a1a1aa' }}>
                            <span>{label}</span>
                            <span style={{ color }} className="font-bold">{val}</span>
                          </div>
                          <div className="h-2 bg-[#222226] rounded-full overflow-hidden border border-white/5">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {slideB.list && (
                    <div className="space-y-2 pt-2">
                      {slideB.list.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-white">
                          <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer */}
                <div className="relative pt-3 border-t border-white/15 flex items-center justify-between z-10 text-[10px] text-[#a1a1aa] font-medium">
                  <span>1080×1350 · 4:5 PORTRAIT</span>
                  <span className="font-mono font-bold text-white">{slideB.num}</span>
                </div>
              </div>

            </div>

            {/* Bottom Controls / Indicator Dots */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {CAROUSEL_PAIRS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPairIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      pairIdx === idx ? 'w-8 bg-white' : 'w-2 bg-[#333] hover:bg-[#555]'
                    }`}
                    aria-label={`Go to pair ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextPair}
                className="flex items-center gap-1.5 text-xs text-white font-semibold hover:text-[#27c93f] transition-colors"
              >
                Next Pair <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Balanced Full-Width 1200×630 Impact Card ── */}
        {active === 'quote' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#27c93f]/20 text-[#4ade80] border border-[#27c93f]/40 rounded-full">
                Branded Impact Card · 1200×630 (1.91:1) PNG
              </span>
              <span className="text-xs text-[#a1a1aa] font-mono font-medium">1-Click High-Res Download</span>
            </div>

            {/* Authentic 1200x630 Social Share Aspect Ratio Card */}
            <div
              className="w-full aspect-[1.91/1] min-h-[340px] rounded-2xl border-2 border-[#333338] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl bg-[#121214] hover:border-white/30 transition-all duration-300"
            >
              {/* Grid texture & glow accents */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#0a72ef]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#7c3aed]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Framing Header */}
              <div className="relative flex items-center justify-between pb-4 border-b border-white/15 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white text-[#171717] flex items-center justify-center font-black text-xs">C</div>
                  <span className="font-bold text-xs text-white uppercase tracking-wider">ContentEngine · Impact Card</span>
                </div>
                <span className="text-[11px] font-mono text-[#a1a1aa] bg-white/10 px-2.5 py-0.5 rounded font-bold">1200×630 PNG</span>
              </div>

              {/* Main Quote Content — Grid Layout to Fill Right Side Perfectly */}
              <div className="relative py-4 z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Quote Text Column */}
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-6xl sm:text-7xl font-serif text-[#0a72ef] leading-none select-none block -mb-4 opacity-80">&ldquo;</span>
                  <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight -tracking-[1px]">
                    Repurposing isn&apos;t about working harder — it&apos;s about making your strongest ideas reach every audience.
                  </p>
                </div>

                {/* Right Side Visual Accent Pill Stack */}
                <div className="lg:col-span-4 hidden lg:flex flex-col gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">CARD STATS</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium">Brand Voice Match</span>
                    <span className="text-[#4ade80] font-bold">100%</span>
                  </div>
                  <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4ade80] h-full rounded-full w-full" />
                  </div>
                  <div className="pt-2 flex justify-between items-center text-xs border-t border-white/10">
                    <span className="text-white font-medium">Export Format</span>
                    <span className="text-[#60aaff] font-bold">1200×630 PNG</span>
                  </div>
                </div>
              </div>

              {/* Author & Download Footer */}
              <div className="relative pt-4 border-t border-white/15 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a72ef] to-[#1e40af] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    CE
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ContentEngine</p>
                    <p className="text-[11px] text-[#a1a1aa]">@contentengine · Content Strategy</p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/15"
                >
                  <Download className="w-3.5 h-3.5 text-[#27c93f]" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#a1a1aa] text-center font-medium">
              Auto-generated from your top quotes and exported as a 1200×630 PNG — ready for 𝕏, LinkedIn, and Facebook link previews.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
