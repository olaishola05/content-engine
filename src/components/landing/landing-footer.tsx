import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#ebebeb] bg-white pt-16 pb-12 px-6 mt-auto">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Top 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          
          {/* Column 1: Brand & Status */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-base">
                C
              </div>
              <span className="font-semibold text-base tracking-tight text-[#171717]">
                ContentEngine
              </span>
            </Link>
            <p className="text-xs text-[#666666] leading-relaxed">
              Turn one idea or transcript into a full, on-brand content pack for 5 platforms in 60 seconds.
            </p>
            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3f4f6] text-[11px] font-medium text-[#374151]">
              <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Product</p>
            <ul className="space-y-2.5 text-xs text-[#666666]">
              <li><a href="#how-it-works" className="hover:text-[#171717] transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-[#171717] transition-colors">Features &amp; Voice Engine</a></li>
              <li><a href="#outputs" className="hover:text-[#171717] transition-colors">Platform Outputs</a></li>
              <li><a href="#pricing" className="hover:text-[#171717] transition-colors">Pricing &amp; BYOK</a></li>
              <li><a href="#byok-security" className="hover:text-[#171717] transition-colors">Security &amp; Encryption</a></li>
              <li><a href="#faq" className="hover:text-[#171717] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Output Formats */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Output Formats</p>
            <ul className="space-y-2.5 text-xs text-[#666666]">
              <li><span className="text-[#171717] font-medium">𝕏 Threads &amp; Posts</span></li>
              <li><span className="text-[#171717] font-medium">LinkedIn Storytelling &amp; PDFs</span></li>
              <li><span className="text-[#171717] font-medium">Instagram 4:5 Carousels</span></li>
              <li><span className="text-[#171717] font-medium">TikTok Photo Mode Slides</span></li>
              <li><span className="text-[#171717] font-medium">Long-Form SEO &amp; AEO Blogs</span></li>
            </ul>
          </div>

          {/* Column 4: Account & Access */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Get Started</p>
            <p className="text-xs text-[#666666]">
              Private Beta is live. Bring your Anthropic API key and start generating free.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/sign-up"
                className="w-full h-9 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#171717]/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Get Beta Access →
              </Link>
              <Link
                href="/sign-in"
                className="w-full h-9 bg-white border border-[#ebebeb] text-[#171717] text-xs font-semibold rounded-lg hover:bg-[#fafafa] transition-colors flex items-center justify-center"
              >
                Sign In to Account
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-[#ebebeb] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} ContentEngine. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#byok-security" className="hover:text-[#171717] transition-colors">Privacy &amp; Encryption</a>
            <a href="#byok-security" className="hover:text-[#171717] transition-colors">Terms of Service</a>
            <a href="#byok-security" className="hover:text-[#171717] transition-colors">BYOK Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
