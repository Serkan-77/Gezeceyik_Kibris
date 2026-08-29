// app/historical-places/page.tsx — Tarihi Yerler (/historical-places)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters, PlaceFiltersSkeleton } from '@/components/places/PlaceFilters';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Tarihi Yerler — Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'ın tarihi yerlerini keşfedin — Osmanlı hanları, Gotik kiliseler, Venedik surları ve 10.000 yıllık tarihe ev sahipliği yapan alanlar.',
  openGraph: {
    title: 'Kuzey Kıbrıs Tarihi Yerler | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs\'ın tarihi hanlar, surlar, antik yapılar ve mimari miras alanları.',
  },
};

export const revalidate = 3600;

export default async function HistoricalPlacesPage() {
  const [places, regions] = await Promise.all([getPlacesByCategory('Historical Place'), getAllRegions()]);

  return (
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Tarihi Yerler"
        title="Kuzey Kıbrıs Tarihi Yerleri"
        subtitle="Osmanlı hanları, ortaçağ şehirleri ve tarihin taşa kazındığı alanlar — Kuzey Kıbrıs'ın yüzyıllar öncesine uzanan mirası."
      />
      <Suspense fallback={<PlaceFiltersSkeleton />}>
        <PlaceFilters
          places={places}
          categories={['Historical Place']}
          regions={regions}
          lockedCategory="Historical Place"
        />
      </Suspense>
    </Container>
  );
}
