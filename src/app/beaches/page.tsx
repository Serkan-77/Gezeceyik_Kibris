// app/beaches/page.tsx — Plajlar (/beaches)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters, PlaceFiltersSkeleton } from '@/components/places/PlaceFilters';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

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
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Plajlar"
        title="Kuzey Kıbrıs Plajları"
        subtitle="Berrak turkuaz sular, ince beyaz kum ve el değmemiş koylar — Kuzey Kıbrıs'ın tüm bölgelerindeki en güzel plajlar."
      />
      <Suspense fallback={<PlaceFiltersSkeleton />}>
        <PlaceFilters
          places={beaches}
          categories={['Beach']}
          regions={regions}
          lockedCategory="Beach"
        />
      </Suspense>
    </Container>
  );
}
