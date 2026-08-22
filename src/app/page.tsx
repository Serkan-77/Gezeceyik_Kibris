// app/page.tsx — Ana Sayfa (/)
// Server Component — tüm bölümleri render eder, öne çıkan yerler sunucu tarafında çekilir.

import { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { RegionGrid } from '@/components/home/RegionGrid';
import { WhySection } from '@/components/home/WhySection';
import { HomeCTA } from '@/components/home/HomeCTA';
import { PlaceGrid } from '@/components/places/PlaceGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
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

export default function HomePage() {
  const featured = getFeaturedPlaces();

  return (
    <>
      <Hero />

      {/* Öne çıkan yerler */}
      <section
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        aria-labelledby="featured-heading"
      >
        <div className="mb-10">
          <SectionHeading
            id="featured-heading"
            title="Öne Çıkan Yerler"
            subtitle="Kuzey Kıbrıs'ı en iyi temsil eden el ile seçilmiş destinasyonlar."
            accent
          />
        </div>
        <PlaceGrid places={featured} />
        <div className="mt-10 text-center">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 rounded-sm border border-[#e8651a] px-5 py-2.5 text-sm font-medium text-[#e8651a] transition-colors hover:bg-[#e8651a] hover:text-white"
          >
            Tüm yerleri gör
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Kategori grid */}
      <div className="bg-[#f5f2ee]">
        <CategoryGrid />
      </div>

      {/* Neden biz */}
      <WhySection />

      {/* Bölge grid */}
      <RegionGrid />

      {/* Alt CTA */}
      <HomeCTA />
    </>
  );
}
