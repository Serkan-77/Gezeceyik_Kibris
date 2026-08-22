// app/beaches/page.tsx — Beaches category landing (/beaches)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Beaches in Cyprus — Guide to the Best Coastal Spots',
  description:
    'Explore the best beaches in Cyprus — crystal-clear turquoise water, fine white sand, and sheltered coves across the island.',
  openGraph: {
    title: 'Beaches in Cyprus | Cyprus Discovery',
    description: 'Find the best beaches in Cyprus — from Fig Tree Bay in Protaras to hidden coves along the Akamas coast.',
  },
};

export default function BeachesPage() {
  const beaches = getPlacesByCategory('Beach');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Beaches
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Beaches in Cyprus
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Crystal-clear turquoise water, fine white sand, and sheltered coves —
          the best beaches across all regions of Cyprus.
        </p>
      </header>
      <Suspense>
        <PlaceFilters
          places={beaches}
          categories={['Beach']}
          regions={regions}
          lockedCategory="Beach"
        />
      </Suspense>
    </div>
  );
}
