// app/museums/page.tsx — Müzeler (/museums)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Müzeleri — Açılış Saatleri, Fiyatlar ve Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'taki en iyi müzeleri keşfedin — arkeoloji koleksiyonları, Bizans sanatı, Osmanlı tarihi ve daha fazlası. Tüm bölgeler için açılış saatleri ve giriş ücretleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs Müzeleri | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs\'ın altı bölgesindeki arkeoloji, sanat ve tarih müzeleri.',
  },
};

export default function MuseumsPage() {
  const museums = getPlacesByCategory('Museum');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Müzeler
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kuzey Kıbrıs Müzeleri
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Dünya standartlarında arkeoloji, sanat ve tarih müzeleri — açılış saatleri,
          giriş ücretleri ve ziyaretçi bilgileriyle.
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
