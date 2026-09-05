// app/castles/page.tsx — Kaleler (/castles)

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPlacesByCategory, getAllRegions } from '@/lib/places';
import { DiscoveryExplorer, DiscoveryExplorerSkeleton } from '@/components/places/DiscoveryExplorer';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Kaleleri: Tarih, Açılış Saatleri ve Ziyaretçi Rehberi',
  description:
    'Kuzey Kıbrıs\'ın kalelerini ziyaret edin: Girne Kalesi, Othello Kalesi, St. Hilarion, Kantara ve daha fazlası. Açılış saatleri ve giriş ücretleri.',
  alternates: { canonical: '/castles' },
  openGraph: {
    title: 'Kuzey Kıbrıs Kaleleri | Gezeceyik Kıbrıs',
    description: 'Kuzey Kıbrıs\'ın ortaçağ kaleleri ve Haçlı döneminden kalma surlar.',
  },
};

export const revalidate = 3600;

export default async function CastlesPage() {
  const [castles, regions] = await Promise.all([getPlacesByCategory('Castle'), getAllRegions()]);

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: 'Ana Sayfa', url: '/' }, { name: 'Yerler', url: '/places' }, { name: 'Kaleler', url: '/castles' }]} />
      <div className="mt-5">
        <Suspense fallback={<DiscoveryExplorerSkeleton />}>
          <DiscoveryExplorer
            places={castles}
            categories={['Castle']}
            regions={regions}
            lockedCategory="Castle"
            title="Kuzey Kıbrıs Kaleleri"
            subtitle="Ortaçağ kaleleri, Haçlı döneminden kalma surlar ve Bizans kaleleri: Girne'nin liman kalesinden Gazimağusa'nın Venedik surlarına."
          />
        </Suspense>
      </div>
    </Container>
  );
}
