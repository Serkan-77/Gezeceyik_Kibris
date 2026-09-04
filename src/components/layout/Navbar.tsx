'use client';
// components/layout/Navbar.tsx
// Turkish-first navigation for Gezeceyik Kıbrıs.
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

        {/* Logo — a coastline gesture, not an icon boxed in a rounded square */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Gezeceyik Kıbrıs, Ana Sayfa"
        >
          <svg width="26" height="16" viewBox="0 0 26 16" fill="none" aria-hidden="true" className="shrink-0 text-brand">
            <path
              d="M1.5 12.5C4 12.5 4.5 5 8 5c3 0 3 6.5 6 6.5 2.5 0 3-8 10-8"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="24.5" cy="3.5" r="1.75" fill="currentColor" />
          </svg>
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-[15px] font-semibold tracking-tight text-strong">
              Gezeceyik
            </span>
            <span className="hidden text-[11px] text-subtle sm:inline">Kıbrıs</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Ana navigasyon">
          <ul className="flex items-center gap-0.5">
            {primaryLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive(href) ? 'bg-brand/10 text-brand-strong' : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop right-side actions — icon always visible, label appears once
            there's room (xl:) so the bar never wraps at the lg breakpoint;
            aria-label keeps the accessible name correct at every width. */}
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/gezilerim"
            aria-label="Gezilerim"
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
              isActive('/gezilerim') ? 'text-brand' : 'text-muted'
            }`}
          >
            <CompassIcon className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Gezilerim</span>
          </Link>
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
              isActive('/favoriler') ? 'text-brand' : 'text-muted'
            }`}
          >
            <HeartIcon filled={isActive('/favoriler')} className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Favoriler</span>
          </Link>
          <Button href="/gezi-planla" size="sm" className="ml-1">Gezi Planla</Button>
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
