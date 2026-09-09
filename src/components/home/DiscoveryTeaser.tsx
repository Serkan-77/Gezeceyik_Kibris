// components/home/DiscoveryTeaser.tsx
// The catalogue's highest-rated places, photo-forward, in a bento
// composition — rather than a wall of 121 identical cards or a fixed
// one-per-category lineup. Leads straight into /places for full browsing.

import Link from 'next/link';
import { Category, Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { PlaceCard } from '@/components/places/PlaceCard';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

// Used only as a fallback when fewer than 4 places have any community
// ratings yet (early on, most won't) — keeps the section looking curated
// instead of showing an arbitrary tail of unrated places.
const FALLBACK_CATEGORIES: Category[] = ['Castle', 'Beach', 'Historical Place', 'Monastery'];

// Plate layout for exactly 4 picks: a tall lead plate spanning both rows
// on the left, two plates stacked top-right, one wide plate beneath them.
// Grid items stretch to fill their row-span by default — PlaceCard's
// `fillHeight` then lets the photo (not the caption strip) absorb that
// extra height.
const BENTO_ITEM_CLASSES = [
  'col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-2',
  'lg:col-start-2 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-2',
];
// Matches BENTO_ITEM_CLASSES: the lead and wide cards run up to full
// viewport width on mobile, so next/image needs the wider `sizes` a 'lg'
// PlaceCard requests — 'md' would keep loading an undersized image.
const BENTO_SIZES: Array<'md' | 'lg'> = ['lg', 'md', 'md', 'lg'];

interface DiscoveryTeaserProps {
  places: Place[];
  ratings: Map<string, { average: number; count: number }>;
}

export function DiscoveryTeaser({ places, ratings }: DiscoveryTeaserProps) {
  const withImage = places.filter((p) => p.image);

  const rated = withImage
    .filter((p) => (ratings.get(p.id)?.count ?? 0) > 0)
    .sort((a, b) => {
      const ra = ratings.get(a.id)!;
      const rb = ratings.get(b.id)!;
      return rb.average - ra.average || rb.count - ra.count;
    });

  const picks = rated.slice(0, 4);
  const pickedIds = new Set(picks.map((p) => p.id));

  // Backfill with a category-diverse pick per still-empty slot when the
  // community hasn't rated enough places yet.
  for (const category of FALLBACK_CATEGORIES) {
    if (picks.length >= 4) break;
    const candidate =
      withImage.find((p) => p.category === category && p.featured && !pickedIds.has(p.id)) ??
      withImage.find((p) => p.category === category && !pickedIds.has(p.id));
    if (candidate) {
      picks.push(candidate);
      pickedIds.add(candidate.id);
    }
  }

  if (picks.length === 0) return null;

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="discovery-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <Eyebrow>§02 — Katalog</Eyebrow>
            <SplitHeading
              as="h2"
              id="discovery-heading"
              text="Keşfedecek çok şey var."
              className="mt-2 font-display text-section-title text-strong text-balance"
            />
          </div>
          <Link href="/places" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.05em] text-brand hover:underline">
            {places.length} yerin tamamı
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {picks.map((place, i) => (
            <Reveal key={place.slug} delayMs={i * 70} className={BENTO_ITEM_CLASSES[i] ?? ''}>
              <PlaceCard
                place={place}
                size={BENTO_SIZES[i]}
                rating={ratings.get(place.id)}
                fillHeight={i === 0}
                index={i}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
