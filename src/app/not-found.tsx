// app/not-found.tsx — Özel 404 sayfası.
// The one moment worth a little personality even on an error page: the
// same real coastline used everywhere else (Hero, GeographyBand) with a
// marker plotted just off its edge — "you've wandered off the map",
// literally, using the product's own geography rather than a generic
// centered "404" numeral.

import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { CYPRUS_PATH, CYPRUS_VIEWBOX } from '@/lib/geo/cyprusOutline';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
  // The route itself already responds with a real HTTP 404 (Next.js's
  // not-found convention), which already excludes it from indexing — this
  // is defense in depth for a URL a crawler discovers via a stale link.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[70vh] flex-col items-center justify-center gap-8 py-24 text-center sm:flex-row sm:gap-14 sm:text-left">
      <svg viewBox={CYPRUS_VIEWBOX} className="h-40 w-64 shrink-0 opacity-80" fill="none" aria-hidden="true">
        <path d={CYPRUS_PATH} stroke="var(--color-line)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <g>
          <circle cx="1060" cy="120" r="16" fill="var(--color-danger)" opacity={0.16} />
          <circle cx="1060" cy="120" r="6" fill="var(--color-danger)" />
        </g>
        <line x1="971" y1="17" x2="1060" y2="120" stroke="var(--color-danger)" strokeWidth={1.5} strokeDasharray="4 4" />
      </svg>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-danger">Hata 404</p>
        <h1 className="mt-2 font-display text-hero leading-[0.88] text-strong text-balance">Haritanın dışına çıktın.</h1>
        <p className="mt-4 max-w-sm font-serif text-body leading-relaxed text-muted text-pretty">
          Bu sayfa yok, taşınmış ya da hiç var olmamış olabilir. Ama ada hâlâ orada — 122 gerçek yer seni bekliyor.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button href="/places" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Tüm yerleri keşfet
          </Button>
          <Button href="/" variant="secondary">
            Ana sayfaya dön
          </Button>
        </div>
      </div>
    </Container>
  );
}
