// app/page.tsx — Ana Sayfa (/)
// Ground-up rebuild: Arrival → Discovery → Geography → Plan Your Trip.
// Nothing invented — every scene is built from real place data.

import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { DiscoveryTeaser } from '@/components/home/DiscoveryTeaser';
import { GeographyBand } from '@/components/home/GeographyBand';
import { PlanTripBand } from '@/components/home/PlanTripBand';
import { getAllPlaces, getFeaturedPlaces, getAllRegions } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Tarihi Yerler',
  description:
    'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin: müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar ve kültürel destinasyonlar.',
  openGraph: {
    title: 'Gezeceyik Kıbrıs: Adayı Keşfedin',
    description: 'Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [places, featured, regions] = await Promise.all([getAllPlaces(), getFeaturedPlaces(), getAllRegions()]);

  const heroPool = featured.length > 0 ? featured : places;
  const heroFeature =
    heroPool.find((p) => p.image && p.verificationStatus === 'verified') ?? heroPool.find((p) => p.image) ?? null;

  const planFeature = places.find((p) => p.category === 'Beach' && p.image) ?? heroFeature;

  return (
    <>
      <Hero placeCount={places.length} regionCount={regions.length} feature={heroFeature} />
      <DiscoveryTeaser places={places} />
      <GeographyBand placeCount={places.length} regionCount={regions.length} />
      <PlanTripBand feature={planFeature} />
    </>
  );
}
