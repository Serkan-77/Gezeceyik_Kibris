// app/beaches/page.tsx — Plajlar (/beaches)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { DiscoveryExplorer, DiscoveryExplorerSkeleton } from '@/components/places/DiscoveryExplorer';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Plajları: En İyi Sahil Rehberi',
  description:
    'Kuzey Kıbrıs\'ın en güzel plajlarını keşfedin: berrak turkuaz sular, ince beyaz kum ve el değmemiş koylar. Altın Sahil, Alagadi, Karpaz Plajları ve daha fazlası.',
  alternates: { canonical: '/beaches' },
  openGraph: {
    title: 'Kuzey Kıbrıs Plajları | Gezeceyik Kıbrıs',
    description: 'Kuzey Kıbrıs\'ın Altın Sahili\'nden Karpaz yarımadasının bakir koylarına en iyi plajlar.',
  },
};

export const revalidate = 3600;

export default async function BeachesPage() {
  const [beaches, regions] = await Promise.all([getPlacesByCategory('Beach'), getAllRegions()]);

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: 'Ana Sayfa', url: '/' }, { name: 'Yerler', url: '/places' }, { name: 'Plajlar', url: '/beaches' }]} />
      <div className="mt-5">
        <Suspense fallback={<DiscoveryExplorerSkeleton />}>
          <DiscoveryExplorer
            places={beaches}
            categories={['Beach']}
            regions={regions}
            lockedCategory="Beach"
            title="Kuzey Kıbrıs Plajları"
            subtitle="Berrak turkuaz sular, ince beyaz kum ve el değmemiş koylar: Kuzey Kıbrıs'ın tüm bölgelerindeki en güzel plajlar."
          />
        </Suspense>
      </div>
    </Container>
  );
}
