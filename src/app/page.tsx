// app/page.tsx — Ana Sayfa (/)
// Server Component — the five approved homepage scenes, in order:
// Arrival, Discovery Index, The Island Live, Layers of History, Plan
// Your Route. Nothing here is invented; each scene is built from real
// place data.

import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { DiscoveryIndex } from '@/components/home/DiscoveryIndex';
import { MapScene } from '@/components/home/MapScene';
import { HistoryScene } from '@/components/home/HistoryScene';
import { RouteScene } from '@/components/home/RouteScene';
import { getAllPlaces, getFeaturedPlaces, getPlaceCountByCategory, getAllRegions } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Tarihi Yerler',
  description:
    'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin: müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar ve kültürel destinasyonlar.',
  openGraph: {
    title: 'Gezeceyik Kıbrıs: Adayı Keşfedin',
    description:
      'Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [places, featured, categoryCounts, regions] = await Promise.all([
    getAllPlaces(),
    getFeaturedPlaces(),
    getPlaceCountByCategory(),
    getAllRegions(),
  ]);

  const heroPool = featured.length > 0 ? featured : places;
  const heroFeature =
    heroPool.find((p) => p.image && p.verificationStatus === 'verified') ??
    heroPool.find((p) => p.image) ??
    null;

  return (
    <>
      <Hero placeCount={places.length} regionCount={regions.length} feature={heroFeature} />
      <DiscoveryIndex counts={categoryCounts} places={places} />
      <MapScene places={places} />
      <HistoryScene places={places} />
      <RouteScene places={places} />
    </>
  );
}
