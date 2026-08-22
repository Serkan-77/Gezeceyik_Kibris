'use client';
// components/layout/Navbar.tsx
// Turkish-first navigation for Kuzey Kıbrıs Discovery.
// Desktop: logo + category links + harita/favoriler + Gezi Planla CTA
// Mobile: hamburger → full-screen slide-in

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

const primaryLinks: NavLink[] = [
  { href: '/places', label: 'Keşfet' },
  { href: '/museums', label: 'Müzeler' },
  { href: '/castles', label: 'Kaleler' },
  { href: '/beaches', label: 'Plajlar' },
  { href: '/historical-places', label: 'Tarihi Yerler' },
  { href: '/harita', label: 'Harita' },
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
          aria-label="Kuzey Kıbrıs Discovery — Ana Sayfa"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a] transition-colors group-hover:bg-[#e8651a]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="#e8651a" className="group-hover:fill-white transition-colors" />
              <path d="M5.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8z" fill="#fafaf8" />
            </svg>
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-[#1a1a1a] sm:block">
            Kuzey Kıbrıs
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center lg:flex" aria-label="Ana navigasyon">
          <ul className="flex items-center">
            {primaryLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? 'text-[#e8651a]'
                      : 'text-[#4b5563] hover:text-[#1a1a1a]'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-[#e8651a]" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-[#f5f2ee] ${
              isActive('/favoriler') ? 'text-[#e8651a]' : 'text-[#4b5563]'
            }`}
          >
            <svg className="h-5 w-5" fill={isActive('/favoriler') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link
            href="/gezi-planla"
            className="rounded-sm bg-[#e8651a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c9540e]"
          >
            Gezi Planla
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm text-[#1a1a1a] transition-colors hover:bg-[#f5f2ee] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          <span className="sr-only">{open ? 'Menüyü kapat' : 'Menüyü aç'}</span>
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
        <div id="mobile-nav" className="border-t border-[#e8e4de] bg-[#fafaf8] lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Mobil navigasyon">
            <ul className="space-y-0.5">
              {primaryLinks.map(({ href, label }) => (
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
              <li>
                <Link
                  href="/favoriler"
                  className={`flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/favoriler')
                      ? 'bg-[#f5f2ee] text-[#e8651a]'
                      : 'text-[#4b5563] hover:bg-[#f5f2ee] hover:text-[#1a1a1a]'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Favorilerim
                </Link>
              </li>
            </ul>
            <div className="mt-4 border-t border-[#f5f2ee] pt-4">
              <Link
                href="/gezi-planla"
                className="flex items-center justify-center rounded-sm bg-[#e8651a] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c9540e]"
                onClick={() => setOpen(false)}
              >
                Gezi Planla
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
