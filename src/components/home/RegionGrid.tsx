// components/home/RegionGrid.tsx
// KKTC 6-region destination selector — Turkish copy, real KKTC regions.
// Links to /places?region= for filtered discovery.

import Link from 'next/link';
import { getPlaceCountByRegion } from '@/lib/places';
import { Region } from '@/types/place';

interface RegionCard {
  region: Region;
  tagline: string;
  highlights: string[];
}

const regions: RegionCard[] = [
  {
    region: 'Girne',
    tagline: 'Pitoresk liman ve tarihi kaleler',
    highlights: ['Girne Kalesi', 'Bellapais Manastırı', 'St. Hilarion'],
  },
  {
    region: 'Gazimağusa',
    tagline: 'Antik Salamis ve Venedik surları',
    highlights: ['Othello Kalesi', 'Salamis', 'Venedik Surları'],
  },
  {
    region: 'Lefkoşa',
    tagline: 'Osmanlı hanları ve Gotik katedraller',
    highlights: ['Büyük Han', 'Selimiye Camii', 'Buffavento'],
  },
  {
    region: 'İskele',
    tagline: 'Karpaz Yarımadası\'nın bakir doğası',
    highlights: ['Altın Sahil', 'Apostolos Andreas', 'Karpaz Parkı'],
  },
  {
    region: 'Güzelyurt',
    tagline: 'Antik mozaikler ve narenciye bahçeleri',
    highlights: ['Soli Antik Kenti', 'Güzelyurt Müzesi', 'Pighades'],
  },
  {
    region: 'Lefke',
    tagline: 'Osmanlı dokusunu koruyan sakin kasaba',
    highlights: ['Tarihi Çarşı', 'Osmanlı Evleri', 'Şeyh Nazım Türbesi'],
  },
];

export function RegionGrid() {
  const counts = getPlaceCountByRegion();

  return (
    <section className="bg-[#f5f2ee] py-16 sm:py-20" aria-labelledby="region-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
            Altı bölge
          </p>
          <h2
            id="region-heading"
            className="font-display text-2xl font-bold text-[#1a1a1a] sm:text-3xl"
          >
            Bölgeye göre keşfet
          </h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {regions.map(({ region, tagline, highlights }) => {
            const count = counts[region] ?? 0;
            return (
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
                      {count} yer
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
                  <ul className="flex flex-wrap gap-1.5" aria-label={`${region} öne çıkan yerler`}>
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
            );
          })}
        </ul>
      </div>
    </section>
  );
}
