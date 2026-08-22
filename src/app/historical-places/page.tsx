// app/historical-places/page.tsx — Historical Places category landing

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Historical Places in Cyprus — Visitor Guide',
  description:
    'Discover the historical places of Cyprus — Gothic abbeys, Byzantine ruins, and sites spanning 10,000 years of history across all regions.',
  openGraph: {
    title: 'Historical Places in Cyprus | Cyprus Discovery',
    description: 'Abbeys, ancient sites, and places where centuries of Cypriot history are written into stone.',
  },
};

export default function HistoricalPlacesPage() {
  const places = getPlacesByCategory('Historical Place');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Historical places
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Historical places in Cyprus
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Gothic abbeys, medieval old towns, and places where centuries of
          Cypriot history are written into stone.
        </p>
      </header>
      <Suspense>
        <PlaceFilters
          places={places}
          categories={['Historical Place']}
          regions={regions}
          lockedCategory="Historical Place"
        />
      </Suspense>
    </div>
  );
}
