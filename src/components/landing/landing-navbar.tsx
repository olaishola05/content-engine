import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#ebebeb]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-base">
            C
          </div>
          <span className="font-semibold text-base tracking-tight text-[#171717]">ContentEngine</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#666666]">
          <a href="#how-it-works" className="hover:text-[#171717] transition-colors">How It Works</a>
          <a href="#features" className="hover:text-[#171717] transition-colors">Features</a>
          <a href="#outputs" className="hover:text-[#171717] transition-colors">Outputs</a>
          <a href="#pricing" className="hover:text-[#171717] transition-colors">Pricing</a>
          <a href="#byok-security" className="hover:text-[#171717] transition-colors">Security</a>
          <a href="#faq" className="hover:text-[#171717] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-xs font-semibold px-4 py-2 text-[#4d4d4d] hover:text-[#171717] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-xs font-semibold px-4 py-2 bg-[#171717] text-white rounded-lg hover:bg-[#171717]/90 transition-colors shadow-sm"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
}
