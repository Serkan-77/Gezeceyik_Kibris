// app/page.tsx — Homepage (/)
// Server Component — renders all sections, pulls featured places server-side.

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
  title: 'Cyprus Discovery — Museums, Castles, Beaches & Cultural Places',
  description:
    'Discover the best places to visit in Cyprus — museums, castles, archaeological sites, beaches, monasteries, and cultural destinations across all six regions of the island.',
  openGraph: {
    title: 'Cyprus Discovery — Explore the Island',
    description:
      'Museums, castles, beaches, monasteries, archaeological sites and more — with opening hours, prices and visitor guides.',
  },
};

export default function HomePage() {
  const featured = getFeaturedPlaces();

  return (
    <>
      <Hero />

      {/* Featured places */}
      <section
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        aria-labelledby="featured-heading"
      >
        <div className="mb-10">
          <SectionHeading
            id="featured-heading"
            title="Featured places"
            subtitle="Handpicked attractions that give a taste of Cyprus at its best."
            accent
          />
        </div>
        <PlaceGrid places={featured} />
        <div className="mt-10 text-center">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 rounded-sm border border-[#e8651a] px-5 py-2.5 text-sm font-medium text-[#e8651a] transition-colors hover:bg-[#e8651a] hover:text-white"
          >
            View all places
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Category grid — CategoryGrid manages its own max-w + padding */}
      <div className="bg-[#f5f2ee]">
        <CategoryGrid />
      </div>

      {/* Why section */}
      <WhySection />

      {/* Region grid — RegionGrid manages its own max-w + padding */}
      <RegionGrid />

      {/* Bottom CTA */}
      <HomeCTA />
    </>
  );
}
