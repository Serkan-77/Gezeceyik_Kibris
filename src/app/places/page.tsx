// app/places/page.tsx — Tüm Yerler (/places)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPlaces, getAllCategories, getAllRegions } from '@/lib/places';
import { DiscoveryExplorer, DiscoveryExplorerSkeleton } from '@/components/places/DiscoveryExplorer';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs\'ta Tüm Yerler: Müzeler, Kaleler, Plajlar ve Daha Fazlası',
  description:
    'Kuzey Kıbrıs\'taki tüm gezilecek yerleri keşfedin: müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar, seyir noktaları ve doğa güzellikleri.',
  // The clean path, regardless of ?q=/?category=/?region=/?free= — those
  // are real, shareable filtered views (kept working — see
  // DiscoveryExplorer.tsx), just not each their own indexable URL. This
  // keeps every combination consolidated onto one canonical page instead
  // of Google treating each filter combination as separate, near-duplicate content.
  alternates: { canonical: '/places' },
  openGraph: {
    title: 'Kuzey Kıbrıs\'ı Keşfet | Gezeceyik Kıbrıs',
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
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: 'Ana Sayfa', url: '/' }, { name: 'Yerler', url: '/places' }]} />
      <div className="mt-5">
        <Suspense fallback={<DiscoveryExplorerSkeleton />}>
          <DiscoveryExplorer
            places={places}
            categories={categories}
            regions={regions}
            title={`${places.length} yer arasında keşfedin`}
            subtitle="Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: tüm altı bölgede arayın ve filtreleyin."
          />
        </Suspense>
      </div>
    </Container>
  );
}
