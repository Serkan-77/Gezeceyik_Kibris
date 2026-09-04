// app/museums/page.tsx — Müzeler (/museums)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { DiscoveryExplorer, DiscoveryExplorerSkeleton } from '@/components/places/DiscoveryExplorer';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Müzeleri: Açılış Saatleri, Fiyatlar ve Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'taki en iyi müzeleri keşfedin: arkeoloji koleksiyonları, Bizans sanatı, Osmanlı tarihi ve daha fazlası. Tüm bölgeler için açılış saatleri ve giriş ücretleri.',
  openGraph: {
    title: 'Kuzey Kıbrıs Müzeleri | Gezeceyik Kıbrıs',
    description: 'Kuzey Kıbrıs\'ın altı bölgesindeki arkeoloji, sanat ve tarih müzeleri.',
  },
};

export const revalidate = 3600;

export default async function MuseumsPage() {
  const [museums, regions] = await Promise.all([getPlacesByCategory('Museum'), getAllRegions()]);

  return (
    <Container className="py-10 sm:py-14">
      <Suspense fallback={<DiscoveryExplorerSkeleton />}>
        <DiscoveryExplorer
          places={museums}
          categories={['Museum']}
          regions={regions}
          lockedCategory="Museum"
          title="Kuzey Kıbrıs Müzeleri"
          subtitle="Dünya standartlarında arkeoloji, sanat ve tarih müzeleri: açılış saatleri, giriş ücretleri ve ziyaretçi bilgileriyle."
        />
      </Suspense>
    </Container>
  );
}
