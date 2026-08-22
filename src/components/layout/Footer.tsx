// components/layout/Footer.tsx
// Simplified dark footer — matches Navbar logo mark, clean typography hierarchy.

import Link from 'next/link';

const exploreLinks = [
  { href: '/places', label: 'All places' },
  { href: '/museums', label: 'Museums' },
  { href: '/castles', label: 'Castles' },
  { href: '/beaches', label: 'Beaches' },
  { href: '/historical-places', label: 'Historical places' },
];

const planLinks = [
  { href: '/coming-soon', label: 'Plan your visit' },
  { href: '/coming-soon', label: 'Travel tips' },
  { href: '/coming-soon', label: 'Getting around' },
];

export function Footer() {
  return (
    <footer className="bg-[#111111]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-3"
              aria-label="Cyprus Discovery — Home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a] ring-1 ring-white/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="#e8651a" />
                  <path d="M5.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8z" fill="#111111" />
                </svg>
              </span>
              <span className="font-display text-base font-semibold text-white">
                Cyprus Discovery
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#6b7280]">
              Discover the best places to visit in Cyprus — museums, castles,
              archaeological sites, beaches, monasteries, and cultural
              destinations across all six regions.
            </p>
            {/* Data disclaimer */}
            <p className="mt-5 rounded-sm border border-amber-900/30 bg-amber-950/30 px-3 py-2.5 text-xs leading-relaxed text-amber-600/80">
              Opening hours, prices, and contact details shown are{' '}
              <strong className="font-medium text-amber-500/80">sample data only</strong>
              {' '}— not independently verified. Always check official sources before visiting.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4b5563]">
              Explore Cyprus
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#6b7280] transition-colors hover:text-[#e8651a]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4b5563]">
              Plan your trip
            </h3>
            <ul className="space-y-2.5">
              {planLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#6b7280] transition-colors hover:text-[#e8651a]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#4b5563]">
            © {new Date().getFullYear()} Cyprus Discovery. Built for travellers who love history, culture, and beautiful places.
          </p>
          <p className="text-xs text-[#4b5563]">
            Not affiliated with any government body or tourism authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
