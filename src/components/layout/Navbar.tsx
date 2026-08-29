'use client';
// components/layout/Navbar.tsx
// Turkish-first navigation for Kuzey Kıbrıs Discovery.
// Desktop: logo + category links + harita/favoriler + Gezi Planla CTA
// Mobile: hamburger → full-screen slide-in

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { HeartIcon, CompassIcon, MenuIcon, CloseIcon } from '@/components/ui/icons';

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
    <header className="sticky top-0 z-50 w-full border-b border-line/80 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Kuzey Kıbrıs Discovery — Ana Sayfa"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink transition-colors group-hover:bg-brand">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="#e8651a" className="transition-colors group-hover:fill-white" />
              <path d="M5.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8z" fill="#fafaf8" />
            </svg>
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-strong sm:block">
            Kuzey Kıbrıs Discovery
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
                    isActive(href) ? 'text-brand' : 'text-muted hover:text-strong'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-brand" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/gezilerim"
            aria-label="Gezilerim"
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-surface-muted ${
              isActive('/gezilerim') ? 'text-brand' : 'text-muted'
            }`}
          >
            <CompassIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-surface-muted ${
              isActive('/favoriler') ? 'text-brand' : 'text-muted'
            }`}
          >
            <HeartIcon filled={isActive('/favoriler')} className="h-5 w-5" />
          </Link>
          <Button href="/gezi-planla" size="sm">Gezi Planla</Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm text-strong transition-colors hover:bg-surface-muted lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Mobil navigasyon">
            <ul className="space-y-0.5">
              {primaryLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(href)
                        ? 'bg-surface-muted text-brand'
                        : 'text-muted hover:bg-surface-muted hover:text-strong'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/gezilerim"
                  className={`flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/gezilerim')
                      ? 'bg-surface-muted text-brand'
                      : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Gezilerim
                </Link>
              </li>
              <li>
                <Link
                  href="/favoriler"
                  className={`flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive('/favoriler')
                      ? 'bg-surface-muted text-brand'
                      : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Favorilerim
                </Link>
              </li>
            </ul>
            <div className="mt-4 border-t border-surface-muted pt-4">
              <Button href="/gezi-planla" className="w-full" onClick={() => setOpen(false)}>
                Gezi Planla
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
