// app/places/page.tsx — All places listing (/places)
// Server Component — passes data to Client Component PlaceFilters.
// Suspense required because PlaceFilters uses useSearchParams.

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPlaces, getAllCategories, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'All Places in Cyprus — Museums, Castles, Beaches & More',
  description:
    'Browse and filter all places to visit in Cyprus — museums, castles, archaeological sites, beaches, monasteries, viewpoints, and natural attractions across all six regions.',
  openGraph: {
    title: 'Explore All Places in Cyprus | Cyprus Discovery',
    description:
      'Find museums, castles, beaches, monasteries, archaeological sites and more across Cyprus.',
  },
};

export default function PlacesPage() {
  const places = getAllPlaces();
  const categories = getAllCategories();
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Page header */}
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          All places
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Explore Cyprus
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Museums, castles, beaches, monasteries, archaeological sites, and
          more — search and filter across all six regions.
        </p>
      </header>

      {/* Filters + grid — wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<FiltersSkeleton />}>
        <PlaceFilters places={places} categories={categories} regions={regions} />
      </Suspense>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex gap-3">
        <div className="h-10 flex-1 rounded-sm bg-[#f5f2ee]" />
        <div className="h-10 w-36 rounded-sm bg-[#f5f2ee]" />
        <div className="h-10 w-36 rounded-sm bg-[#f5f2ee]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-md bg-[#f5f2ee]" />
        ))}
      </div>
    </div>
  );
}
