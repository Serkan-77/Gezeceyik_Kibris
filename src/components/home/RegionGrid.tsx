// components/home/RegionGrid.tsx
// Destination selector — 6 regions of Cyprus.
// Cards feel like editorial destination picks, not plain list boxes.

import Link from 'next/link';
import { Region } from '@/types/place';

interface RegionCard {
  region: Region;
  tagline: string;
  placeCount: number;
  highlights: string[];
}

const regions: RegionCard[] = [
  {
    region: 'Nicosia',
    tagline: 'The divided capital',
    placeCount: 3,
    highlights: ['Cyprus Museum', 'Venetian Walls', 'Old City'],
  },
  {
    region: 'Limassol',
    tagline: 'Cosmopolitan coastal city',
    placeCount: 4,
    highlights: ['Medieval Castle', 'Kourion', 'Kolossi'],
  },
  {
    region: 'Paphos',
    tagline: 'Birthplace of Aphrodite',
    placeCount: 3,
    highlights: ['Mosaic Park', 'Tombs of Kings', 'Akamas'],
  },
  {
    region: 'Larnaca',
    tagline: 'Ancient port city',
    placeCount: 2,
    highlights: ['Hala Sultan Tekke', 'Salt Lake flamingos', 'Pierides Museum'],
  },
  {
    region: 'Kyrenia',
    tagline: 'Picturesque harbour town',
    placeCount: 2,
    highlights: ['Kyrenia Castle', 'Bellapais Abbey', 'Shipwreck Museum'],
  },
  {
    region: 'Famagusta',
    tagline: 'Walled medieval city',
    placeCount: 2,
    highlights: ['Cape Greco', 'Fig Tree Bay', 'Old City walls'],
  },
];

export function RegionGrid() {
  return (
    <section className="bg-[#f5f2ee] py-16 sm:py-20" aria-labelledby="region-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
            Six regions
          </p>
          <h2
            id="region-heading"
            className="font-display text-2xl font-bold text-[#1a1a1a] sm:text-3xl"
          >
            Explore by region
          </h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {regions.map(({ region, tagline, placeCount, highlights }) => (
            <li key={region}>
              <Link
                href={`/places?region=${encodeURIComponent(region)}`}
                className="group flex flex-col gap-4 rounded-md border border-[#e0dbd4] bg-white p-5 transition-all hover:border-[#e8651a]/30 hover:shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1a1a1a] transition-colors group-hover:text-[#e8651a]">
                      {region}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#9ca3af]">{tagline}</p>
                  </div>
                  <span className="ml-4 shrink-0 text-xs font-medium text-[#9ca3af]">
                    {placeCount} place{placeCount !== 1 ? 's' : ''}
                    <svg
                      className="ml-1 inline h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>

                {/* Highlight tags */}
                <ul className="flex flex-wrap gap-1.5" aria-label={`Highlights in ${region}`}>
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-sm bg-[#f5f2ee] px-2 py-0.5 text-[11px] text-[#6b7280]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
