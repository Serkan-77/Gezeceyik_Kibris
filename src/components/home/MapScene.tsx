// components/home/MapScene.tsx
// Scene 3 — The Island, Live. The one deliberate immersive-blue moment on
// the homepage: real coastline, real markers at real coordinates — no
// photography here on purpose, so geography gets to lead in contrast with
// the photo-heavy scenes around it. Blue is allowed to dominate only here.

import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { IslandLineArt } from '@/components/graphics/IslandLineArt';
import { ArrowRightIcon } from '@/components/ui/icons';

interface MapSceneProps {
  places: Place[];
}

export function MapScene({ places }: MapSceneProps) {
  const markers = places
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map((p) => ({ lon: p.longitude, lat: p.latitude, emphasis: p.featured }));

  return (
    <section className="on-ink bg-deep py-16 sm:py-24" aria-labelledby="map-scene-heading">
      <Container>
        <Reveal className="max-w-sm">
          <h2
            id="map-scene-heading"
            className="font-display text-section-title font-semibold leading-[1.05] text-white text-balance"
          >
            {places.length} yer.
            <br />
            Tek ada.
          </h2>
          <p className="mt-5 max-w-sm text-body-sm leading-relaxed text-on-ink-muted text-pretty">
            Kuzey Kıbrıs&apos;taki her nokta gerçek koordinatlarıyla haritada. Bölgeyi gezin,
            yakınındakileri görün, rotanızı oradan başlatın.
          </p>
          <Link
            href="/harita"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand-bright"
          >
            Haritada keşfet
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delayMs={100} className="mt-12">
          <Link href="/harita" aria-label={`Haritayı aç, ${places.length} yer`} className="group relative block">
            <IslandLineArt
              className="mx-auto h-auto w-full max-w-3xl text-white/80 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-editorial)] group-hover:scale-[1.02]"
              strokeWidth={1.75}
              markers={markers}
              markerColor="var(--color-brand-bright)"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
