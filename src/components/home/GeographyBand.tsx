// components/home/GeographyBand.tsx
// The one deliberate immersive-blue moment on the homepage: geography
// leads, no photography competing for attention. Real coordinates, real
// count — no invented precision.

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon } from '@/components/ui/icons';

interface GeographyBandProps {
  placeCount: number;
  regionCount: number;
}

export function GeographyBand({ placeCount, regionCount }: GeographyBandProps) {
  return (
    <section className="on-ink bg-deep py-20 sm:py-28" aria-labelledby="geo-band-heading">
      <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-lg">
          <h2 id="geo-band-heading" className="font-display text-section-title font-semibold leading-[1.05] text-white text-balance">
            {placeCount} yer. {regionCount} bölge. Tek ada.
          </h2>
          <p className="mt-5 max-w-sm text-body-sm leading-relaxed text-on-ink-muted text-pretty">
            Kuzey Kıbrıs&apos;taki her nokta gerçek koordinatlarıyla haritada. Bölgeyi gezin, yakınındakileri
            görün, rotanızı oradan başlatın.
          </p>
        </div>
        <Link
          href="/harita"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50"
        >
          Haritayı aç
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Container>
    </section>
  );
}
