'use client';
// components/home/DiscoveryIndex.tsx
// Scene 2 — What Draws You Here. An editorial masthead index, not five
// equal image tiles: a vertical text list of categories on the left —
// serif names, mono counts, no icons, no boxes, no cards — and one large
// photo on the right that responds to which category is focused. The
// browsing action itself becomes photographic instead of iconographic.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Place } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRightIcon } from '@/components/ui/icons';

interface Chapter {
  category: Category;
  href: string;
}

const CHAPTERS: Chapter[] = [
  { category: 'Historical Place', href: '/historical-places' },
  { category: 'Museum', href: '/museums' },
  { category: 'Castle', href: '/castles' },
  { category: 'Beach', href: '/beaches' },
  { category: 'Natural Attraction', href: '/places?category=Natural+Attraction' },
];

interface DiscoveryIndexProps {
  counts: Record<string, number>;
  places: Place[];
}

export function DiscoveryIndex({ counts, places }: DiscoveryIndexProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = CHAPTERS.map(
    ({ category }) => places.find((p) => p.category === category && p.image)?.image
  );

  return (
    <section className="bg-paper py-14 sm:py-20" aria-labelledby="discovery-heading">
      <Container>
        <Reveal className="mb-10 max-w-xl">
          <h2 id="discovery-heading" className="font-display text-section-title font-semibold text-strong text-balance">
            Keşfet, hisset, planla.
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-stretch lg:gap-12">
          <Reveal delayMs={60}>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {CHAPTERS.map(({ category, href }, i) => (
                <li key={category}>
                  <Link
                    href={href}
                    onMouseEnter={() => setActiveIdx(i)}
                    onFocus={() => setActiveIdx(i)}
                    className={`group flex items-baseline justify-between gap-4 py-4 transition-colors duration-[var(--duration-fast)] ${
                      activeIdx === i ? 'text-brand' : 'text-strong hover:text-brand'
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 translate-y-[-2px] rounded-[1px] transition-colors duration-[var(--duration-fast)] ${
                          activeIdx === i ? 'bg-gold' : 'bg-line group-hover:bg-gold'
                        }`}
                      />
                      <span className="font-display text-2xl font-semibold sm:text-3xl">
                        {tr.categories[category]}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-sm tabular-nums text-subtle">
                      {counts[category] ?? 0}
                      <ArrowRightIcon
                        className={`h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] ${
                          activeIdx === i ? 'translate-x-0.5' : ''
                        }`}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal
            delayMs={120}
            className="relative min-h-[280px] overflow-hidden bg-surface-muted sm:min-h-[380px]"
          >
            {images.map((image, i) =>
              image ? (
                <div
                  key={image}
                  className="absolute inset-0 transition-opacity duration-[var(--duration-base)]"
                  style={{ opacity: activeIdx === i ? 1 : 0 }}
                  aria-hidden={activeIdx !== i}
                >
                  <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                </div>
              ) : null
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
