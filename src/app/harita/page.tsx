// app/harita/page.tsx — Harita (/harita)
// Server Component — renders SSR-safe Leaflet map wrapper, plus an
// accessible list of every place beneath it (Leaflet markers have no
// built-in keyboard path, so this is the real alternative, not a footnote).

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPlaces } from '@/lib/places';
import { PlacesMapWrapper } from '@/components/map/PlacesMapWrapper';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';
import { PinIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Haritası — Tüm Yerleri Haritada Keşfet',
  description:
    'Kuzey Kıbrıs\'taki müze, kale, plaj ve tarihi yerleri interaktif haritada görün. Konumunuza göre sıralayın.',
  openGraph: {
    title: 'Kuzey Kıbrıs Haritası | Kuzey Kıbrıs Discovery',
    description: 'KKTC\'deki tüm gezilecek yerleri interaktif haritada keşfedin.',
  },
};

export default function HaritaPage() {
  const places = getAllPlaces();
  const sortedPlaces = [...places].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <div className="flex flex-col">
      <Container className="pb-4 pt-8">
        <PlaceListingHeader
          eyebrow="Harita"
          title="Kuzey Kıbrıs Keşif Haritası"
          subtitle={`${places.length} yer — pin'e tıklayarak detayları görün. Aşağıda tam liste de mevcut.`}
        />
      </Container>

      {/* Map — viewport-stable height (svh, not a raw 100vh calc) */}
      <div className="h-[60svh] min-h-[420px] w-full sm:h-[70svh] lg:h-[75svh]">
        <PlacesMapWrapper places={places} />
      </div>

      {/* Accessible alternative: every place as a plain, keyboard-reachable list */}
      <Container as="section" className="py-12 sm:py-16" aria-labelledby="map-list-heading">
        <h2 id="map-list-heading" className="mb-1 font-display text-block-title font-semibold text-strong">
          Haritadaki Tüm Yerler
        </h2>
        <p className="mb-6 text-body-sm text-subtle">
          Harita ile etkileşime giremiyorsanız, tüm yerlere buradan ulaşabilirsiniz.
        </p>
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {sortedPlaces.map((place) => (
            <li key={place.id}>
              <Link
                href={`/places/${place.slug}`}
                className="flex items-center gap-2 rounded-sm px-2 py-2 text-body-sm text-muted transition-colors hover:bg-surface-muted hover:text-brand"
              >
                <PinIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
                <span className="truncate">{place.name}</span>
                <span className="ml-auto shrink-0 text-meta text-subtle">{tr.categories[place.category]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
