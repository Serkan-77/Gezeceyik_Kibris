'use client';
// components/layout/Navbar.tsx
// "Kıbrıs Atlas" rebuild. Wordmark is a plotted instrument-panel lockup
// (mono label + condensed display word), not a script/italic logotype.
// Desktop nav is an underline strip, not a sliding pill. Mobile: hamburger
// → full-screen numbered takeover (see below), its own experience rather
// than the desktop list narrowed into a dropdown.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { HeartIcon, CompassIcon, RouteIcon, MenuIcon, CloseIcon, ArrowRightIcon } from '@/components/ui/icons';
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

  // The mobile sheet is a full-screen takeover, not a dropdown — lock body
  // scroll behind it so the page underneath doesn't scroll with it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Shrinks the bar once the page scrolls under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A single underline bar slides between nav links (hover, falling back
  // to the active route) instead of each link owning a static background.
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
      className={`sticky top-0 z-nav w-full border-b border-line bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_0_0_var(--color-line)]' : 'shadow-none'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between px-4 transition-[height] duration-300 ease-[var(--ease-out)] sm:px-6 lg:px-8 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-baseline gap-2" aria-label="Gezeceyik Kıbrıs, Ana Sayfa">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Gezeceyik</span>
          <span className="font-display text-xl leading-none text-brand">Kıbrıs</span>
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Ana navigasyon">
          <ul ref={navListRef} className="relative flex items-center gap-1">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 z-0 h-[2px] bg-brand transition-all duration-300 ease-[var(--ease-out)]"
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
                  className={`block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors ${
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
            className={`relative flex items-center gap-1.5 px-2.5 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors hover:bg-surface-muted ${
              isActive('/rotam') ? 'text-brand' : 'text-muted'
            }`}
          >
            <RouteIcon className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Rotam</span>
            {showBadge && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brand px-1 font-mono text-[10px] font-semibold tabular-nums text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/gezilerim"
            aria-label="Gezilerim"
            className={`flex items-center gap-1.5 px-2.5 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors hover:bg-surface-muted ${
              isActive('/gezilerim') ? 'text-brand' : 'text-muted'
            }`}
          >
            <CompassIcon className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Gezilerim</span>
          </Link>
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            className={`flex items-center gap-1.5 px-2.5 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors hover:bg-surface-muted ${
              isActive('/favoriler') ? 'text-brand' : 'text-muted'
            }`}
          >
            <HeartIcon filled={isActive('/favoriler')} className="h-[18px] w-[18px]" />
            <span className="hidden xl:inline">Favoriler</span>
          </Link>
          <Button href="/gezi-planla" size="sm" className="ml-2">
            Gezi Planla
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-strong transition-colors hover:bg-surface-muted lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 z-overlay overflow-y-auto border-t border-line bg-paper lg:hidden"
          style={{ top: scrolled ? '3.5rem' : '4rem' }}
        >
          <div className="flex min-h-full flex-col px-5 pb-8 pt-7 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Kuzey Kıbrıs&apos;ı keşfet</p>

            <nav aria-label="Mobil navigasyon" className="mt-4">
              <ul className="border-y border-line">
                {primaryLinks.map(({ href, label }, i) => (
                  <li key={href} className={i > 0 ? 'border-t border-line' : ''}>
                    <Link
                      href={href}
                      className="group flex min-h-14 items-center justify-between gap-4 py-3.5 active:opacity-60"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] tabular-nums text-faint">{String(i + 1).padStart(2, '0')}</span>
                        <span className={`font-display text-2xl leading-none ${isActive(href) ? 'text-brand' : 'text-strong'}`}>
                          {label}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-4 w-4 shrink-0 text-faint transition-transform group-active:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <Link
                href="/rotam"
                className={`relative flex flex-col items-center gap-2 border py-4 text-center transition-colors active:opacity-70 ${
                  isActive('/rotam') ? 'border-brand bg-brand/5' : 'border-line'
                }`}
              >
                <RouteIcon className={`h-5 w-5 ${isActive('/rotam') ? 'text-brand' : 'text-muted'}`} />
                <span className={`font-mono text-[11px] uppercase tracking-[0.04em] ${isActive('/rotam') ? 'text-brand' : 'text-strong'}`}>Rotam</span>
                {showBadge && (
                  <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-mono text-[10px] font-semibold tabular-nums text-white">
                    {count}
                  </span>
                )}
              </Link>
              <Link
                href="/gezilerim"
                className={`flex flex-col items-center gap-2 border py-4 text-center transition-colors active:opacity-70 ${
                  isActive('/gezilerim') ? 'border-brand bg-brand/5' : 'border-line'
                }`}
              >
                <CompassIcon className={`h-5 w-5 ${isActive('/gezilerim') ? 'text-brand' : 'text-muted'}`} />
                <span className={`font-mono text-[11px] uppercase tracking-[0.04em] ${isActive('/gezilerim') ? 'text-brand' : 'text-strong'}`}>Gezilerim</span>
              </Link>
              <Link
                href="/favoriler"
                className={`flex flex-col items-center gap-2 border py-4 text-center transition-colors active:opacity-70 ${
                  isActive('/favoriler') ? 'border-brand bg-brand/5' : 'border-line'
                }`}
              >
                <HeartIcon filled={isActive('/favoriler')} className={`h-5 w-5 ${isActive('/favoriler') ? 'text-brand' : 'text-muted'}`} />
                <span className={`font-mono text-[11px] uppercase tracking-[0.04em] ${isActive('/favoriler') ? 'text-brand' : 'text-strong'}`}>Favoriler</span>
              </Link>
            </div>

            <div className="mt-auto pt-8">
              <Button href="/gezi-planla" size="lg" className="w-full">
                Gezi Planla
              </Button>
              <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                35°10′N 33°22′E — Akdeniz&apos;in doğusu
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
