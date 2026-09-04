// components/layout/Footer.tsx
// Gezeceyik Kıbrıs — the site's one closing dark note, in Deep
// Mediterranean blue (not plain ink) per the Blue Coastal Kinetic Atlas
// design system (Phase 8 §10) — an echo of the homepage's immersive map
// scene, not a generic dark footer.

import Link from 'next/link';

const exploreLinks = [
  { href: '/places', label: 'Tüm Yerler' },
  { href: '/museums', label: 'Müzeler' },
  { href: '/castles', label: 'Kaleler' },
  { href: '/beaches', label: 'Plajlar' },
  { href: '/historical-places', label: 'Tarihi Yerler' },
  { href: '/harita', label: 'Harita' },
];

const planLinks = [
  { href: '/gezi-planla', label: 'Gezi Planla' },
  { href: '/favoriler', label: 'Favorilerim' },
  { href: '/places?category=Natural+Attraction', label: 'Doğa' },
  { href: '/places?category=Archaeological+Site', label: 'Arkeolojik Alanlar' },
];

export function Footer() {
  return (
    <footer className="on-ink bg-deep" role="contentinfo">
      <div className="h-1" style={{ background: 'var(--gradient-sunset)' }} aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-2.5"
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
              <span className="font-display text-base font-semibold text-white">
                Gezeceyik Kıbrıs
              </span>
            </Link>
            <p className="max-w-sm text-body-sm leading-relaxed text-on-ink-muted">
              Kuzey Kıbrıs&apos;taki en iyi müzeleri, kaleleri, arkeolojik alanları,
              plajları ve tarihi yerleri keşfedin. Tüm bölgeler, tek platform.
            </p>
            {/* Data disclaimer */}
            <p className="mt-5 max-w-sm text-caption leading-relaxed text-amber-500/75">
              Açılış saatleri, fiyatlar ve iletişim bilgileri{' '}
              <strong className="font-medium text-amber-400/90">örnek veridir</strong>
              {', '}bağımsız olarak doğrulanmamıştır. Ziyaret öncesi resmi kaynaklara başvurun.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-on-ink-subtle">
              35°10′N 33°22′E, Akdeniz&apos;in doğusu
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-ink-subtle">
              Keşfet
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-body-sm text-on-ink-muted transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan links */}
          <div>
            <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-ink-subtle">
              Gezi Planla
            </h3>
            <ul className="space-y-2.5">
              {planLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-body-sm text-on-ink-muted transition-colors hover:text-brand"
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
          <p className="text-caption text-on-ink-subtle">
            © {new Date().getFullYear()} Gezeceyik Kıbrıs. Tarihi, kültürü ve güzel yerleri seven gezginler için.
          </p>
          <p className="text-caption text-on-ink-subtle">
            Resmi bir turizm kurumu veya devlet kuruluşuyla bağlantılı değildir.
          </p>
          <Link href="/gizlilik" className="text-caption text-on-ink-subtle transition-colors hover:text-brand">
            Gizlilik Politikası
          </Link>
        </div>
      </div>
    </footer>
  );
}
