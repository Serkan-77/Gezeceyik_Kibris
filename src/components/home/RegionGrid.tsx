// components/home/RegionGrid.tsx
// Region discovery as an asymmetric spotlight + list — one flagship region
// gets a dark, typographic spotlight card, the remaining five live in a
// compact rail of plain rows (hairline dividers, not five more boxed cards).
// No photograph on the spotlight card: the sample dataset's stock photo IDs
// don't reliably depict what they're labeled as (see Hero.tsx).

import Link from 'next/link';
import { getPlaceCountByRegion } from '@/lib/places';
import { Region } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowRightIcon } from '@/components/ui/icons';

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
  const [flagship, ...rest] = regions;
  const flagshipCount = counts[flagship.region] ?? 0;

  return (
    <section className="bg-surface-muted py-20 sm:py-28" aria-labelledby="region-heading">
      <Reveal><Container>
        <div className="mb-10">
          <SectionHeader id="region-heading" eyebrow="Altı Bölge" title="Bölgeye göre keşfet" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
          {/* Flagship region spotlight */}
          <Link
            href={`/places?region=${encodeURIComponent(flagship.region)}`}
            className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg bg-ink lg:min-h-[26rem]"
          >
            <p
              aria-hidden="true"
              className="absolute -right-4 -top-6 select-none font-display text-display font-bold leading-none text-white/[0.06]"
            >
              {flagship.region.slice(0, 2)}
            </p>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="relative p-6 sm:p-8">
              <p className="text-label font-semibold uppercase tracking-widest text-brand">Öne çıkan bölge</p>
              <h3 className="mt-2 font-display text-section-title font-semibold text-white">
                {flagship.region}
              </h3>
              <p className="mt-1 text-body-sm text-on-ink-muted">{flagship.tagline}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${flagship.region} öne çıkan yerler`}>
                {flagship.highlights.map((h) => (
                  <li key={h} className="rounded-sm bg-white/10 px-2.5 py-1 text-meta text-white/85 backdrop-blur-sm">
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-5 inline-flex items-center gap-1.5 text-body-sm font-medium text-white">
                {flagshipCount} yer keşfedin
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </div>
          </Link>

          {/* Remaining regions — plain rows */}
          <ul className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface" role="list">
            {rest.map(({ region, tagline, highlights }) => {
              const count = counts[region] ?? 0;
              return (
                <li key={region}>
                  <Link
                    href={`/places?region=${encodeURIComponent(region)}`}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-card-title font-semibold text-strong transition-colors group-hover:text-brand">
                        {region}
                      </h3>
                      <p className="mt-0.5 truncate text-body-sm text-subtle">{tagline}</p>
                      <p className="mt-1 truncate text-meta text-faint">{highlights.join(' · ')}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-meta font-medium text-subtle">
                      {count} yer
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container></Reveal>
    </section>
  );
}
