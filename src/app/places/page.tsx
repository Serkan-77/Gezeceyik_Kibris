// app/places/page.tsx — Tüm Yerler (/places)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPlaces, getAllCategories, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs\'ta Tüm Yerler — Müzeler, Kaleler, Plajlar ve Daha Fazlası',
  description:
    'Kuzey Kıbrıs\'taki tüm gezilecek yerleri keşfedin — müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar, seyir noktaları ve doğa güzellikleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs\'ı Keşfet | Kuzey Kıbrıs Discovery',
    description: 'Tüm bölgelerdeki müze, kale, plaj, manastır ve arkeolojik alanları bulun.',
  },
};

export default function PlacesPage() {
  const places = getAllPlaces();
  const categories = getAllCategories();
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Tüm Yerler
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kuzey Kıbrıs&apos;ı Keşfet
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası —
          tüm altı bölgede arayın ve filtreleyin.
        </p>
      </header>

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
