// app/castles/page.tsx — Kaleler (/castles)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { PlaceFilters, PlaceFiltersSkeleton } from '@/components/places/PlaceFilters';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Kaleleri — Tarih, Açılış Saatleri ve Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'ın kalelerini ziyaret edin — Girne Kalesi, Othello Kalesi, St. Hilarion, Kantara ve daha fazlası. Açılış saatleri ve giriş ücretleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs Kaleleri | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs\'ın ortaçağ kaleleri ve Haçlı döneminden kalma surlar.',
  },
};

export const revalidate = 3600;

export default async function CastlesPage() {
  const [castles, regions] = await Promise.all([getPlacesByCategory('Castle'), getAllRegions()]);

  return (
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Kaleler"
        title="Kuzey Kıbrıs Kaleleri"
        subtitle="Ortaçağ kaleleri, Haçlı döneminden kalma surlar ve Bizans kaleleri — Girne'nin liman kalesinden Gazimağusa'nın Venedik surlarına."
      />
      <Suspense fallback={<PlaceFiltersSkeleton />}>
        <PlaceFilters
          places={castles}
          categories={['Castle']}
          regions={regions}
          lockedCategory="Castle"
        />
      </Suspense>
    </Container>
  );
}
