// app/museums/page.tsx — Museums category landing (/museums)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Museums in Cyprus — Opening Hours, Prices & Visitor Guide',
  description:
    'Find the best museums in Cyprus — archaeological collections, Byzantine art, medieval history, and more. Opening hours, ticket prices, and directions for museums across all regions.',
  openGraph: {
    title: 'Museums in Cyprus | Cyprus Discovery',
    description: 'Archaeological, art, and history museums across all six regions of Cyprus.',
  },
};

export default function MuseumsPage() {
  const museums = getPlacesByCategory('Museum');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Museums
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Museums in Cyprus
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          World-class archaeological, art, and history museums across all six
          regions — with opening hours, entrance fees, and visitor information.
        </p>
      </header>
      <Suspense>
        <PlaceFilters
          places={museums}
          categories={['Museum']}
          regions={regions}
          lockedCategory="Museum"
        />
      </Suspense>
    </div>
  );
}
