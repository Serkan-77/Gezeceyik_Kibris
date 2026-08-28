// app/museums/page.tsx — Müzeler (/museums)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters, PlaceFiltersSkeleton } from '@/components/places/PlaceFilters';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

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
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Müzeler"
        title="Kuzey Kıbrıs Müzeleri"
        subtitle="Dünya standartlarında arkeoloji, sanat ve tarih müzeleri — açılış saatleri, giriş ücretleri ve ziyaretçi bilgileriyle."
      />
      <Suspense fallback={<PlaceFiltersSkeleton />}>
        <PlaceFilters
          places={museums}
          categories={['Museum']}
          regions={regions}
          lockedCategory="Museum"
        />
      </Suspense>
    </Container>
  );
}
