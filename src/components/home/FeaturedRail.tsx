// components/home/FeaturedRail.tsx
// Featured destinations as a horizontal, image-dominant editorial rail —
// deliberately not a symmetric 3-card grid. Photography carries the section;
// text stays minimal (name, location, category).

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { PinIcon, ArrowRightIcon } from '@/components/ui/icons';

interface FeaturedRailProps {
  places: Place[];
}

export function FeaturedRail({ places }: FeaturedRailProps) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="featured-heading">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            id="featured-heading"
            eyebrow="Öne Çıkanlar"
            title="Kuzey Kıbrıs'ı en iyi anlatan yerler"
            subtitle="El ile seçilmiş, editoryal olarak yazılmış destinasyonlar."
          />
          <Button href="/places" variant="secondary" icon={<ArrowRightIcon className="h-4 w-4" />} className="hidden sm:inline-flex">
            Tüm yerleri gör
          </Button>
        </div>
      </Container>

      {/* Horizontal scroll-snap rail — bleeds to the viewport edge on mobile */}
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6 lg:mx-auto lg:max-w-7xl lg:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        {places.map((place, i) => (
          <Link
            key={place.id}
            href={`/places/${place.slug}`}
            className="group relative flex aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden rounded-lg bg-surface-muted sm:w-[46vw] lg:w-[23%]"
            style={{ scrollSnapAlign: 'start' }}
          >
            {place.image && (
              <Image
                src={place.image}
                alt={`${place.name}, ${place.city}`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 23vw"
                priority={i === 0}
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-editorial)] group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

            <span className="absolute left-4 top-4">
              <CategoryBadge category={place.category} overlay />
            </span>

            <div className="relative mt-auto flex flex-col gap-1 p-4 text-white">
              <p className="flex items-center gap-1 text-meta text-on-ink-muted">
                <PinIcon className="h-3 w-3 shrink-0" />
                {place.city}, {place.region}
              </p>
              <h3 className="font-display text-card-title font-semibold leading-snug">
                {place.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 px-4 sm:hidden">
        <Button href="/places" variant="secondary" icon={<ArrowRightIcon className="h-4 w-4" />} className="w-full">
          Tüm yerleri gör
        </Button>
      </div>
    </section>
  );
}
