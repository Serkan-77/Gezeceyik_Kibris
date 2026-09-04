// components/home/GeographyBand.tsx
// The one deliberate immersive-blue moment on the homepage: the real
// coastline with every real place plotted at its real coordinate fills
// the section behind the copy — geography leading, not illustrated.

import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { IslandPinMap } from './IslandPinMap';
import { ArrowRightIcon } from '@/components/ui/icons';

interface GeographyBandProps {
  places: Place[];
  regionCount: number;
}

export function GeographyBand({ places, regionCount }: GeographyBandProps) {
  return (
    <section className="on-ink relative overflow-hidden bg-deep py-20 sm:py-28" aria-labelledby="geo-band-heading">
      <div className="absolute inset-0">
        <IslandPinMap places={places} className="h-full w-full" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(100deg, rgb(13 46 66 / 0.92) 0%, rgb(13 46 66 / 0.6) 42%, rgb(13 46 66 / 0.15) 72%, rgb(13 46 66 / 0) 100%)' }}
          aria-hidden="true"
        />
      </div>

      <Container className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-lg">
          <h2 id="geo-band-heading" className="font-display text-section-title font-semibold leading-[1.05] text-white text-balance">
            {places.length} yer. {regionCount} bölge. Tek ada.
          </h2>
          <p className="mt-5 max-w-sm text-body-sm leading-relaxed text-on-ink-muted text-pretty">
            Kuzey Kıbrıs&apos;taki her nokta gerçek koordinatlarıyla haritada. Bölgeyi gezin, yakınındakileri
            görün, rotanızı oradan başlatın.
          </p>
        </div>
        <Link
          href="/harita"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-deep/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50"
        >
          Haritayı aç
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Container>
    </section>
  );
}
