// components/layout/Footer.tsx
// Kuzey Kıbrıs Discovery — Turkish dark footer.

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
    <footer className="bg-[#111111]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-3"
              aria-label="Kuzey Kıbrıs Discovery — Ana Sayfa"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a] ring-1 ring-white/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="#e8651a" />
                  <path d="M5.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8z" fill="#111111" />
                </svg>
              </span>
              <span className="font-display text-base font-semibold text-white">
                Kuzey Kıbrıs Discovery
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#6b7280]">
              Kuzey Kıbrıs&apos;taki en iyi müzeleri, kaleleri, arkeolojik alanları,
              plajları ve tarihi yerleri keşfedin. Tüm bölgeler, tek platform.
            </p>
            {/* Data disclaimer */}
            <p className="mt-5 rounded-sm border border-amber-900/30 bg-amber-950/30 px-3 py-2.5 text-xs leading-relaxed text-amber-600/80">
              Açılış saatleri, fiyatlar ve iletişim bilgileri{' '}
              <strong className="font-medium text-amber-500/80">örnek veridir</strong>
              {' '}— bağımsız olarak doğrulanmamıştır. Ziyaret öncesi resmi kaynaklara başvurun.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4b5563]">
              Keşfet
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
              Gezi Planla
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
            © {new Date().getFullYear()} Kuzey Kıbrıs Discovery. Tarihi, kültürü ve güzel yerleri seven gezginler için.
          </p>
          <p className="text-xs text-[#4b5563]">
            Resmi bir turizm kurumu veya devlet kuruluşuyla bağlantılı değildir.
          </p>
        </div>
      </div>
    </footer>
  );
}
