'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '../lib/actions/auth';

interface UserProps {
  name?: string | null;
  email: string;
  role: string;
}

export function DashboardHeader({ user }: { user: UserProps }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Generate', href: '/generate' },
    { label: 'Library', href: '/library' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

  if (user.role === 'admin') {
    navLinks.push({ label: 'Admin', href: '/dashboard/admin' });
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 select-none">
            <svg height="20" viewBox="0 0 75 65" fill="#171717">
              <path d="M37.59.25l36.95 64H.64l36.95-64z" />
            </svg>
            <span className="text-[#171717] font-semibold text-sm tracking-tight -tracking-[0.32px]">ContentEngine</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive(link.href)
                    ? 'text-[#171717] font-semibold'
                    : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop user profile & sign out */}
        <div className="hidden md:flex items-center gap-6">
          <span className="text-xs text-[#666666] font-medium">{user.email}</span>
          <form action={signOutAction}>
            <button
              id="sign-out-btn"
              type="submit"
              className="text-sm font-medium text-[#4d4d4d] hover:text-[#171717] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#fafafa] transition-colors border border-transparent active:border-[#ebebeb]"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.782 3.218a.5.5 0 0 0-.707 0L7.5 6.793 3.925 3.218a.5.5 0 1 0-.707.707L6.793 7.5l-3.575 3.575a.5.5 0 1 0 .707.707L7.5 8.207l3.575 3.575a.5.5 0 0 0 .707-.707L8.207 7.5l3.575-3.575a.5.5 0 0 0 0-.707z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.5 3h12M1.5 7.5h12M1.5 12h12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-10 bg-white/95 backdrop-blur-md md:hidden flex flex-col p-6 animate-fade-in">
          <nav className="flex flex-col gap-4 text-base font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors py-2 border-b border-[#ebebeb] ${
                  isActive(link.href)
                    ? 'text-[#171717] border-[#171717]'
                    : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-[#ebebeb]">
            <div className="flex flex-col">
              <span className="text-xs text-[#808080]">Signed in as</span>
              <span className="text-sm font-medium text-[#171717] truncate">{user.email}</span>
            </div>
            <form action={signOutAction} onSubmit={() => setIsOpen(false)}>
              <button
                id="mobile-sign-out-btn"
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#171717] hover:bg-[#171717]/90 text-white text-sm font-semibold transition-colors text-center"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
