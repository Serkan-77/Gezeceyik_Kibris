'use client';
// components/layout/Navbar.tsx
// Ground-up rebuild. Wordmark carries the brand's personality (a warm
// Fraunces italic on "Kıbrıs", set against a plain-weight "Gezeceyik") so
// the surrounding UI can stay quiet. Desktop: wordmark + category links +
// harita/favoriler + Gezi Planla CTA. Mobile: hamburger → full-screen
// slide-in.

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navListRef = useRef<HTMLUListElement>(null);
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

  // Shrinks the bar and gives it a shadow once the page scrolls under it —
  // it now visibly reacts instead of sitting static at the same size
  // whether the page is at the top or three screens down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A single pill slides between nav links (hover, falling back to the
  // active route) instead of each link owning its own static background.
  const updateIndicator = useCallback((href: string | null) => {
    const container = navListRef.current;
    const target = href ? linkRefs.current[href] : null;
    if (!container || !target) {
      setIndicator(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicator({ left: targetRect.left - containerRect.left, width: targetRect.width });
  }, []);

  useEffect(() => {
    const activeHref = primaryLinks.find((link) => isActive(link.href))?.href ?? null;
    const target = hoveredHref ?? activeHref;
    const recalc = () => updateIndicator(target);
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isActive reads pathname, already a dep
  }, [hoveredHref, pathname, updateIndicator]);

  return (
    <header
      className={`sticky top-0 z-nav w-full border-b bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'border-line shadow-[0_2px_16px_-6px_rgb(13_46_66_/_0.18)]' : 'border-line/80 shadow-none'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between px-4 transition-[height] duration-300 ease-[var(--ease-out)] sm:px-6 lg:px-8 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-baseline gap-1.5" aria-label="Gezeceyik Kıbrıs, Ana Sayfa">
          <span className="font-sans text-[15px] font-bold tracking-tight text-strong">Gezeceyik</span>
          <span className="font-display text-[17px] italic text-brand">Kıbrıs</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Ana navigasyon">
          <ul ref={navListRef} className="relative flex items-center gap-0.5">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 z-0 rounded-full bg-brand/10 transition-all duration-300 ease-[var(--ease-out)]"
              style={indicator ? { left: indicator.left, width: indicator.width, opacity: 1 } : { width: 0, opacity: 0 }}
            />
            {primaryLinks.map(({ href, label }) => (
              <li key={href} className="relative z-10">
                <Link
                  ref={(el) => {
                    linkRefs.current[href] = el;
                  }}
                  href={href}
                  onMouseEnter={() => setHoveredHref(href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className={`block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive(href) ? 'text-brand' : 'text-muted hover:text-strong'
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
