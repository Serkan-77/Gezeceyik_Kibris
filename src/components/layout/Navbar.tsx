'use client';
// components/layout/Navbar.tsx
// Ground-up rebuild. Wordmark carries the brand's personality (a warm
// Fraunces italic on "Kıbrıs", set against a plain-weight "Gezeceyik") so
// the surrounding UI can stay quiet. Desktop: wordmark + category links +
// harita/favoriler + Gezi Planla CTA. Mobile: hamburger → full-screen
// slide-in.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { HeartIcon, CompassIcon, RouteIcon, MenuIcon, CloseIcon } from '@/components/ui/icons';
import { useDraftRoute } from '@/context/DraftRouteContext';

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
  const { count, hydrated } = useDraftRoute();
  const showBadge = hydrated && count > 0;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Close the mobile sheet on route change so a back-navigation never
  // leaves it stuck open. Deferred to a microtask (matches the pattern in
  // hooks/useFavorites etc.) to avoid a synchronous setState-in-effect.
  useEffect(() => {
    Promise.resolve().then(() => setOpen(false));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-nav w-full border-b border-line/80 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-baseline gap-1.5" aria-label="Gezeceyik Kıbrıs, Ana Sayfa">
          <span className="font-sans text-[15px] font-bold tracking-tight text-strong">Gezeceyik</span>
          <span className="font-display text-[17px] italic text-brand">Kıbrıs</span>
        </Link>

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

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/rotam"
            aria-label={showBadge ? `Rotam, ${count} durak` : 'Rotam'}
            className={`relative flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
              isActive('/rotam') ? 'text-brand' : 'text-muted'
            }`}
          >
            <RouteIcon className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Rotam</span>
            {showBadge && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-white">
                {count}
              </span>
            )}
          </Link>
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
          <Button href="/gezi-planla" size="sm" className="ml-1">
            Gezi Planla
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-sm text-strong transition-colors hover:bg-surface-muted lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto max-w-[1320px] px-4 py-4 sm:px-6" aria-label="Mobil navigasyon">
            <ul className="space-y-0.5">
              {primaryLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex min-h-11 items-center rounded-sm px-3 py-2.5 text-base font-medium transition-colors ${
                      isActive(href) ? 'bg-surface-muted text-brand' : 'text-muted hover:bg-surface-muted hover:text-strong'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/rotam"
                  className={`flex min-h-11 items-center justify-between rounded-sm px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive('/rotam') ? 'bg-surface-muted text-brand' : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                >
                  Rotam
                  {showBadge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold tabular-nums text-white">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/gezilerim"
                  className={`flex min-h-11 items-center rounded-sm px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive('/gezilerim') ? 'bg-surface-muted text-brand' : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                >
                  Gezilerim
                </Link>
              </li>
              <li>
                <Link
                  href="/favoriler"
                  className={`flex min-h-11 items-center rounded-sm px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive('/favoriler') ? 'bg-surface-muted text-brand' : 'text-muted hover:bg-surface-muted hover:text-strong'
                  }`}
                >
                  Favorilerim
                </Link>
              </li>
            </ul>
            <div className="mt-4 border-t border-surface-muted pt-4">
              <Button href="/gezi-planla" className="w-full">
                Gezi Planla
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
