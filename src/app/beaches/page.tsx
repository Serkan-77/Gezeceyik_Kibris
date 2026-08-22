// app/beaches/page.tsx — Plajlar (/beaches)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Plajları — En İyi Sahil Rehberi',
  description:
    'Kuzey Kıbrıs\'ın en güzel plajlarını keşfedin — berrak turkuaz sular, ince beyaz kum ve el değmemiş koylar. Altın Sahil, Alagadi, Karpaz Plajları ve daha fazlası.',
  openGraph: {
    title: 'Kuzey Kıbrıs Plajları | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs\'ın Altın Sahili\'nden Karpaz yarımadasının bakir koylarına en iyi plajlar.',
  },
};

export default function BeachesPage() {
  const beaches = getPlacesByCategory('Beach');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Plajlar
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kuzey Kıbrıs Plajları
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Berrak turkuaz sular, ince beyaz kum ve el değmemiş koylar —
          Kuzey Kıbrıs&apos;ın tüm bölgelerindeki en güzel plajlar.
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
