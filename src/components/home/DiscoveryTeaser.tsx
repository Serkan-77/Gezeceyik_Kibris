// components/home/DiscoveryTeaser.tsx
// A curated cross-section of the catalogue — one real place per major
// category, photo-forward — rather than a wall of 121 identical cards.
// Leads straight into /places for the full browsing experience.

import Link from 'next/link';
import { Category, Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { PlaceCard } from '@/components/places/PlaceCard';
import { ArrowRightIcon } from '@/components/ui/icons';

// Exactly 4 picks — the lead card spans 2 of the 5 grid tracks (see the
// grid below), so 4 picks (2+1+1+1 = 5) fill the row exactly. A 5th pick
// used to strand a lone card alone on a mostly-empty second row.
const FEATURE_CATEGORIES: Category[] = ['Castle', 'Beach', 'Historical Place', 'Monastery'];

interface DiscoveryTeaserProps {
  places: Place[];
}

export function DiscoveryTeaser({ places }: DiscoveryTeaserProps) {
  const picks: Place[] = [];
  for (const category of FEATURE_CATEGORIES) {
    const candidate =
      places.find((p) => p.category === category && p.featured && p.image) ??
      places.find((p) => p.category === category && p.image);
    if (candidate) picks.push(candidate);
  }

  if (picks.length === 0) return null;

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="discovery-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="discovery-heading" className="font-display text-section-title font-semibold text-strong text-balance">
            Keşfedecek çok şey var.
          </h2>
          <Link href="/places" className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            {places.length} yerin tamamı
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {picks.map((place, i) => (
            <div key={place.slug} className={i === 0 ? 'col-span-2' : ''}>
              <PlaceCard place={place} size={i === 0 ? 'lg' : 'md'} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
