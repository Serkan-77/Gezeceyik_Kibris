// components/layout/Footer.tsx
// Ground-up rebuild. The site's one closing dark note — Deep Sea, not
// plain ink — echoing the map scene's immersive blue rather than a
// generic dark footer.

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

const trustLinks = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/sss', label: 'Sıkça Sorulan Sorular' },
  { href: '/veri-kaynaklari', label: 'Veri Kaynaklarımız' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
];

export function Footer() {
  return (
    <footer className="on-ink bg-deep" role="contentinfo">
      <div className="mx-auto max-w-[1320px] px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 inline-flex items-baseline gap-1.5" aria-label="Gezeceyik Kıbrıs, Ana Sayfa">
              <span className="font-sans text-base font-bold tracking-tight text-white">Gezeceyik</span>
              <span className="font-display text-lg italic text-brand-bright">Kıbrıs</span>
            </Link>
            <p className="max-w-sm text-body-sm leading-relaxed text-on-ink-muted">
              Kuzey Kıbrıs&apos;taki en iyi müzeleri, kaleleri, arkeolojik alanları, plajları ve tarihi
              yerleri keşfedin. Tüm bölgeler, tek platform.
            </p>
            <p className="mt-5 max-w-sm text-caption leading-relaxed text-amber-400/80">
              Açılış saatleri, fiyatlar ve iletişim bilgileri{' '}
              <strong className="font-medium text-amber-300/90">örnek veridir</strong>, bağımsız olarak
              doğrulanmamıştır. Ziyaret öncesi resmi kaynaklara başvurun.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-on-ink-subtle">
              35°10′N 33°22′E — Akdeniz&apos;in doğusu
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-ink-subtle">
              Keşfet
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-body-sm text-on-ink-muted transition-colors hover:text-brand-bright">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-ink-subtle">
              Gezi Planla
            </h3>
            <ul className="space-y-2.5">
              {planLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-body-sm text-on-ink-muted transition-colors hover:text-brand-bright">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-ink-subtle">
              Kurumsal
            </h3>
            <ul className="space-y-2.5">
              {trustLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-body-sm text-on-ink-muted transition-colors hover:text-brand-bright">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-on-ink-subtle">
            © {new Date().getFullYear()} Gezeceyik Kıbrıs. Tarihi, kültürü ve güzel yerleri seven gezginler için.
          </p>
          <p className="text-caption text-on-ink-subtle">Resmi bir turizm kurumu veya devlet kuruluşuyla bağlantılı değildir.</p>
        </div>
      </div>
    </footer>
  );
}
