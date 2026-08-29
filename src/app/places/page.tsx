// app/places/page.tsx — Tüm Yerler (/places)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPlaces, getAllCategories, getAllRegions } from '@/lib/places';
import { PlaceFilters, PlaceFiltersSkeleton } from '@/components/places/PlaceFilters';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs\'ta Tüm Yerler — Müzeler, Kaleler, Plajlar ve Daha Fazlası',
  description:
    'Kuzey Kıbrıs\'taki tüm gezilecek yerleri keşfedin — müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar, seyir noktaları ve doğa güzellikleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs\'ı Keşfet | Kuzey Kıbrıs Discovery',
    description: 'Tüm bölgelerdeki müze, kale, plaj, manastır ve arkeolojik alanları bulun.',
  },
};

export const revalidate = 3600;

export default async function PlacesPage() {
  const [places, categories, regions] = await Promise.all([
    getAllPlaces(),
    getAllCategories(),
    getAllRegions(),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Tüm Yerler"
        title="Kuzey Kıbrıs'ı Keşfet"
        subtitle="Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası — tüm altı bölgede arayın ve filtreleyin."
      />

      <Suspense fallback={<PlaceFiltersSkeleton />}>
        <PlaceFilters places={places} categories={categories} regions={regions} />
      </Suspense>
    </Container>
  );
}
