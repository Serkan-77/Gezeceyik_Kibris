// app/castles/page.tsx — Kaleler (/castles)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters } from '@/components/places/PlaceFilters';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Kaleleri — Tarih, Açılış Saatleri ve Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'ın kalelerini ziyaret edin — Girne Kalesi, Othello Kalesi, St. Hilarion, Kantara ve daha fazlası. Açılış saatleri ve giriş ücretleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs Kaleleri | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs\'ın ortaçağ kaleleri ve Haçlı döneminden kalma surlar.',
  },
};

export default function CastlesPage() {
  const castles = getPlacesByCategory('Castle');
  const regions = getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Kaleler
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kuzey Kıbrıs Kaleleri
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Ortaçağ kaleleri, Haçlı döneminden kalma surlar ve Bizans kaleleri —
          Girne&apos;nin liman kalesinden Gazimağusa&apos;nın Venedik surlarına.
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
