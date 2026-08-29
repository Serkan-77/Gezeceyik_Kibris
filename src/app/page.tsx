// app/page.tsx — Ana Sayfa (/)
// Server Component — tüm bölümleri render eder, öne çıkan yerler sunucu tarafında çekilir.

import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedRail } from '@/components/home/FeaturedRail';
import { HistorySection } from '@/components/home/HistorySection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { RegionGrid } from '@/components/home/RegionGrid';
import { PlannerCTA } from '@/components/home/PlannerCTA';
import { getFeaturedPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Discovery — Müzeler, Kaleler, Plajlar ve Tarihi Yerler',
  description:
    'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin — müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar ve kültürel destinasyonlar.',
  openGraph: {
    title: 'Kuzey Kıbrıs Discovery — Adayı Keşfedin',
    description:
      'Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası — açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const featured = await getFeaturedPlaces();

  return (
    <>
      <Hero />
      <FeaturedRail places={featured.slice(0, 5)} />
      <HistorySection />
      <CategoryGrid />
      <RegionGrid />
      <PlannerCTA />
    </>
  );
}
