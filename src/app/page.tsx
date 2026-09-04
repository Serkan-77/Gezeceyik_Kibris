// app/page.tsx — Ana Sayfa (/)
// Ground-up rebuild: Arrival → Discovery → Layers of History → Geography
// → Plan Your Trip. Nothing invented — every scene is built from real
// place data; the example day is computed by the same planner engine
// /gezi-planla uses, not fabricated.

import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { DiscoveryTeaser } from '@/components/home/DiscoveryTeaser';
import { HistoryScene } from '@/components/home/HistoryScene';
import { GeographyBand } from '@/components/home/GeographyBand';
import { PlanTripBand } from '@/components/home/PlanTripBand';
import { getAllPlaces, getFeaturedPlaces, getAllRegions } from '@/lib/places';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { PlannerInput } from '@/lib/trip-planner/types';

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

// A real, well-known Girne-area day — used only to demonstrate the
// planner on the homepage. Computed by the same generateItinerary()
// /gezi-planla calls; every distance/time on screen is a real result,
// not a placeholder.
const EXAMPLE_ACCOMMODATION = { label: 'Girne Merkez', city: 'Girne', lat: 35.3406, lng: 33.3193 };
const EXAMPLE_MUST_VISIT = ['girne-kalesi', 'bellapais-manastiri', 'st-hilarion-kalesi'];

export default async function HomePage() {
  const [places, featured, regions] = await Promise.all([getAllPlaces(), getFeaturedPlaces(), getAllRegions()]);

  const heroPool = featured.length > 0 ? featured : places;
  const heroFeature =
    heroPool.find((p) => p.image && p.verificationStatus === 'verified') ?? heroPool.find((p) => p.image) ?? null;

  const planFeature = places.find((p) => p.category === 'Beach' && p.image) ?? heroFeature;

  const exampleInput: PlannerInput = {
    accommodation: EXAMPLE_ACCOMMODATION,
    days: 1,
    transport: 'car',
    pace: 'balanced',
    preferredCategories: [],
    onlyFree: false,
    mustVisitSlugs: EXAMPLE_MUST_VISIT,
  };
  const exampleItinerary = generateItinerary(exampleInput, places, []);
  const exampleDay = exampleItinerary.days[0] ?? null;

  return (
    <>
      <Hero placeCount={places.length} regionCount={regions.length} feature={heroFeature} />
      <DiscoveryTeaser places={places} />
      <HistoryScene places={places} />
      <GeographyBand places={places} regionCount={regions.length} />
      <PlanTripBand feature={planFeature} exampleDay={exampleDay} accommodation={exampleDay ? EXAMPLE_ACCOMMODATION : null} />
    </>
  );
}
