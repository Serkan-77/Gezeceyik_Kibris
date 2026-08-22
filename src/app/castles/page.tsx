// app/castles/page.tsx — Castles category landing (/castles)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Castles in Cyprus — History, Opening Hours & Visitor Guide',
  description:
    'Visit the castles of Cyprus — Kyrenia Castle, Limassol Medieval Castle, Kolossi, and more. Opening hours, entrance fees, and visitor information.',
  openGraph: {
    title: 'Castles in Cyprus | Cyprus Discovery',
    description: 'Medieval fortresses and Crusader strongholds across Cyprus.',
  },
};

export default function CastlesPage() {
  const castles = getPlacesByCategory('Castle');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Castles
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Castles in Cyprus
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Medieval fortresses, Crusader strongholds, and Byzantine castles —
          from Kyrenia&apos;s harbour fortress to Kolossi in the Limassol vineyards.
        </p>
      </header>
      <Suspense>
        <PlaceFilters
          places={castles}
          categories={['Castle']}
          regions={regions}
          lockedCategory="Castle"
        />
      </Suspense>
    </div>
  );
}
