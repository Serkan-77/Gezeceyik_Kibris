// app/page.tsx — Ana Sayfa (/)
// Ground-up rebuild: Arrival → Discovery → Layers of History → Geography
// → Plan Your Trip. Nothing invented — every scene is built from real
// place data; the example day is computed by the same planner engine
// /gezi-planla uses, not fabricated.

import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { CategoryNav } from '@/components/home/CategoryNav';
import { WeatherBand } from '@/components/home/WeatherBand';
import { DiscoveryTeaser } from '@/components/home/DiscoveryTeaser';
import { HistoryScene } from '@/components/home/HistoryScene';
import { GeographyBand } from '@/components/home/GeographyBand';
import { CuratedRoutesBand } from '@/components/home/CuratedRoutesBand';
import { PlanTripBand } from '@/components/home/PlanTripBand';
import { getAllPlaces, getFeaturedPlaces, getAllRegions } from '@/lib/places';
import { getPublishedCuratedTrips } from '@/lib/curatedRoutes';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { PlannerInput } from '@/lib/trip-planner/types';
import { getRatingAggregates } from '@/lib/repositories/ratingRepository';

export const metadata: Metadata = {
  title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Tarihi Yerler',
  description:
    'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin: müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar ve kültürel destinasyonlar.',
  alternates: { canonical: '/' },
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
const EXAMPLE_ACCOMMODATION = { label: 'Girne Merkez', city: 'Girne', region: 'Girne' as const, lat: 35.3406, lng: 33.3193 };
const EXAMPLE_MUST_VISIT = ['girne-kalesi', 'bellapais-manastiri', 'st-hilarion-kalesi'];

export default async function HomePage() {
  const [places, featured, regions, curatedTrips] = await Promise.all([
    getAllPlaces(),
    getFeaturedPlaces(),
    getAllRegions(),
    getPublishedCuratedTrips(),
  ]);

  // Powers the "highest-rated first" ordering in DiscoveryTeaser. Falls
  // back to an empty map (teaser then falls back to a category-diverse
  // pick) rather than failing the whole homepage if ratings are down.
  const ratingsRaw = await getRatingAggregates(places.map((p) => p.id)).catch((err) => {
    console.warn('[home] ratings unavailable for discovery teaser:', err instanceof Error ? err.message : err);
    return new Map<string, { average: number | undefined; count: number }>();
  });
  const ratings = new Map(
    [...ratingsRaw].filter((entry): entry is [string, { average: number; count: number }] => entry[1].average !== undefined)
  );

  const heroPool = featured.length > 0 ? featured : places;
  const heroFeature =
    heroPool.find((p) => p.image && p.verificationStatus === 'verified') ?? heroPool.find((p) => p.image) ?? null;

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
      <WeatherBand />
      <DiscoveryTeaser places={places} ratings={ratings} />
      <CategoryNav places={places} />
      <HistoryScene places={places} />
      <GeographyBand places={places} regionCount={regions.length} />
      <CuratedRoutesBand trips={curatedTrips} />
      <PlanTripBand exampleDay={exampleDay} accommodation={exampleDay ? EXAMPLE_ACCOMMODATION : null} />
    </>
  );
}
