'use client';
// components/layout/Navbar.tsx
// "Kıbrıs Atlas" rebuild. Wordmark is a plotted instrument-panel lockup
// (mono label + condensed display word), not a script/italic logotype.
// Desktop nav is an underline strip, not a sliding pill. Mobile: hamburger
// → full-screen numbered takeover (see below), its own experience rather
// than the desktop list narrowed into a dropdown.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { HeartIcon, CompassIcon, RouteIcon, MenuIcon, CloseIcon, ArrowRightIcon, ChevronDownIcon } from '@/components/ui/icons';
import { useDraftRoute } from '@/context/DraftRouteContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

// Every category, not just the four with a dedicated SEO page — Manastır,
// Kilise etc. previously had no way into the header at all and were only
// reachable by picking them from the /places filter. The four with their
// own route/metadata keep linking there; the rest fall back to the shared
// /places explorer pre-filtered by category (see DiscoveryExplorer's URL
// sync). "Aile Aktivitesi" is omitted — zero places carry that category
// today, so it would only ever be a dead end.
const exploreLinks: NavLink[] = [
  { href: '/places', label: 'Tüm Yerler' },
  { href: '/museums', label: 'Müzeler' },
  { href: '/castles', label: 'Kaleler' },
  { href: '/beaches', label: 'Plajlar' },
  { href: '/historical-places', label: 'Tarihi Yerler' },
  { href: '/places?category=Monastery', label: 'Manastırlar' },
  { href: '/places?category=Archaeological+Site', label: 'Arkeolojik Alanlar' },
  { href: '/places?category=Church', label: 'Kiliseler' },
  { href: '/places?category=Natural+Attraction', label: 'Doğa Güzellikleri' },
  { href: '/places?category=Viewpoint', label: 'Seyir Noktaları' },
  { href: '/places?category=Cultural+Site', label: 'Kültürel Alanlar' },
];
const EXPLORE_PATHS = ['/places', '/museums', '/castles', '/beaches', '/historical-places'];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});
  const navListRef = useRef<HTMLUListElement>(null);
  const exploreRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const { count, hydrated } = useDraftRoute();
  const showBadge = hydrated && count > 0;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isExploreActive = EXPLORE_PATHS.some((href) => isActive(href));

  // Close the mobile sheet on route change so a back-navigation never
  // leaves it stuck open. Deferred to a microtask (matches the pattern in
  // hooks/useFavorites etc.) to avoid a synchronous setState-in-effect.
  useEffect(() => {
    Promise.resolve().then(() => {
      setOpen(false);
      setExploreOpen(false);
      setMobileExploreOpen(false);
    });
  }, [pathname]);

  // Desktop Keşfet dropdown: closes on outside click or Escape, same as
  // any disclosure that isn't a native <select>.
  useEffect(() => {
    if (!exploreOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExploreOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [exploreOpen]);

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
  const updateIndicator = useCallback((key: string | null) => {
    const container = navListRef.current;
    const target = key ? linkRefs.current[key] : null;
    if (!container || !target) {
      setIndicator(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicator({ left: targetRect.left - containerRect.left, width: targetRect.width });
  }, []);

  useEffect(() => {
    const activeKey = isExploreActive
      ? 'explore'
      : isActive('/harita')
        ? 'harita'
        : isActive('/rotam')
          ? 'rotam'
          : isActive('/gezilerim')
            ? 'gezilerim'
            : null;
    const target = hoveredKey ?? activeKey;
    const recalc = () => updateIndicator(target);
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isActive/isExploreActive read pathname, already a dep
  }, [hoveredKey, pathname, updateIndicator]);

  return (
    <header
      className={`sticky top-0 z-nav w-full border-b border-line bg-header/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_0_0_var(--color-line)]' : 'shadow-none'
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-[1320px] items-center justify-between px-4 transition-[height] duration-300 ease-[var(--ease-out)] sm:px-6 lg:px-8 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-baseline gap-2" aria-label="Gezeceyik Kıbrıs, Ana Sayfa">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Gezeceyik</span>
          <span className="font-display text-xl leading-none text-brand">Kıbrıs</span>
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center lg:flex"
          aria-label="Ana navigasyon"
        >
          <ul ref={navListRef} className="relative flex items-center gap-1">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 z-0 h-[2px] bg-brand transition-all duration-300 ease-[var(--ease-out)]"
              style={indicator ? { left: indicator.left, width: indicator.width, opacity: 1 } : { width: 0, opacity: 0 }}
            />
            <li
              ref={exploreRef}
              className="relative z-10"
              onMouseEnter={() => {
                setHoveredKey('explore');
                setExploreOpen(true);
              }}
              onMouseLeave={() => {
                setHoveredKey(null);
                setExploreOpen(false);
              }}
            >
              <Link
                ref={(el) => {
                  linkRefs.current.explore = el;
                }}
                href="/places"
                onFocus={() => {
                  setHoveredKey('explore');
                  setExploreOpen(true);
                }}
                aria-expanded={exploreOpen}
                className={`flex items-center gap-1 px-3 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors ${
                  isExploreActive ? 'text-brand' : 'text-muted hover:text-strong'
                }`}
              >
                Keşfet
                <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
              </Link>

              {exploreOpen && (
                <div className="absolute left-0 top-full z-disclosure w-60 border border-line bg-paper py-1.5 shadow-lift">
                  {exploreLinks.map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setExploreOpen(false)}
                      className="block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.05em] text-muted transition-colors hover:bg-surface-muted hover:text-strong"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li className="relative z-10">
              <Link
                ref={(el) => {
                  linkRefs.current.harita = el;
                }}
                href="/harita"
                onMouseEnter={() => setHoveredKey('harita')}
                onMouseLeave={() => setHoveredKey(null)}
                className={`block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors ${
                  isActive('/harita') ? 'text-brand' : 'text-muted hover:text-strong'
                }`}
              >
                Harita
              </Link>
            </li>
            <li className="relative z-10">
              <Link
                ref={(el) => {
                  linkRefs.current.rotam = el;
                }}
                href="/rotam"
                onMouseEnter={() => setHoveredKey('rotam')}
                onMouseLeave={() => setHoveredKey(null)}
                aria-label={showBadge ? `Rotam, ${count} durak` : 'Rotam'}
                className={`relative block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors ${
                  isActive('/rotam') ? 'text-brand' : 'text-muted hover:text-strong'
                }`}
              >
                Rotam
                {showBadge && (
                  <span className="absolute -right-1.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-brand-fill px-1 font-mono text-[9px] font-semibold tabular-nums text-white">
                    {count}
                  </span>
                )}
              </Link>
            </li>
            <li className="relative z-10">
              <Link
                ref={(el) => {
                  linkRefs.current.gezilerim = el;
                }}
                href="/gezilerim"
                onMouseEnter={() => setHoveredKey('gezilerim')}
                onMouseLeave={() => setHoveredKey(null)}
                className={`block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors ${
                  isActive('/gezilerim') ? 'text-brand' : 'text-muted hover:text-strong'
                }`}
              >
                Gezilerim
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/gezi-planla" size="sm">
            Gezi Planla
          </Button>
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
          <ThemeToggle />
        </div>

        <div className="flex items-center lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-strong transition-colors hover:bg-surface-muted"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Portaled to document.body — safe unguarded since `open` only ever
          becomes true from a client click handler, never during SSR, so
          `document` is guaranteed to exist by the time this branch runs. */}
      {open && createPortal(
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 z-overlay overflow-y-auto border-t border-line bg-header lg:hidden"
          style={{ top: scrolled ? '3.5rem' : '4rem' }}
        >
          <div className="flex min-h-full flex-col px-5 pb-8 pt-7 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Kuzey Kıbrıs&apos;ı keşfet</p>

            <nav aria-label="Mobil navigasyon" className="mt-4">
              <ul className="border-y border-line">
                <li>
                  <button
                    type="button"
                    onClick={() => setMobileExploreOpen((v) => !v)}
                    aria-expanded={mobileExploreOpen}
                    aria-controls="mobile-explore-panel"
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-3.5 active:opacity-60"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-faint">01</span>
                      <span className={`font-display text-2xl leading-none ${isExploreActive ? 'text-brand' : 'text-strong'}`}>Keşfet</span>
                    </span>
                    <ChevronDownIcon className={`h-4 w-4 shrink-0 text-faint transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExploreOpen && (
                    <ul id="mobile-explore-panel" className="border-t border-line pb-2">
                      {exploreLinks.map(({ href, label }) => (
                        <li key={label}>
                          <Link href={href} className="flex min-h-11 items-center gap-3 py-2.5 pl-9 font-serif text-[17px] text-strong active:opacity-60">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li className="border-t border-line">
                  <Link href="/harita" className="group flex min-h-14 items-center justify-between gap-4 py-3.5 active:opacity-60">
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-faint">02</span>
                      <span className={`font-display text-2xl leading-none ${isActive('/harita') ? 'text-brand' : 'text-strong'}`}>Harita</span>
                    </span>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-faint transition-transform group-active:translate-x-1" />
                  </Link>
                </li>
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
                  <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-fill px-1 font-mono text-[10px] font-semibold tabular-nums text-white">
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
        </div>,
        document.body
      )}
    </header>
  );
}
