'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/places', label: 'Explore' },
  { href: '/museums', label: 'Museums' },
  { href: '/castles', label: 'Castles' },
  { href: '/beaches', label: 'Beaches' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e4de]/80 bg-[#fafaf8]/96 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Cyprus Discovery — Home"
        >
          {/* Logo mark */}
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a] transition-colors group-hover:bg-[#e8651a]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="#e8651a" className="group-hover:fill-white transition-colors" />
              <path d="M5.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8z" fill="#fafaf8" />
            </svg>
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-[#1a1a1a] sm:block">
            Cyprus Discovery
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex" aria-label="Main navigation">
          <ul className="flex items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? 'text-[#e8651a]'
                      : 'text-[#4b5563] hover:text-[#1a1a1a]'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-[#e8651a]" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center md:flex">
          <Link
            href="/coming-soon"
            className="rounded-sm bg-[#e8651a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c9540e]"
          >
            Plan your visit
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm text-[#1a1a1a] transition-colors hover:bg-[#f5f2ee] md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div id="mobile-nav" className="border-t border-[#e8e4de] bg-[#fafaf8] md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            <ul className="space-y-0.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(href)
                        ? 'bg-[#f5f2ee] text-[#e8651a]'
                        : 'text-[#4b5563] hover:bg-[#f5f2ee] hover:text-[#1a1a1a]'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-[#f5f2ee] pt-4">
              <Link
                href="/coming-soon"
                className="flex items-center justify-center rounded-sm bg-[#e8651a] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c9540e]"
                onClick={() => setOpen(false)}
              >
                Plan your visit
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
