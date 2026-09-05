// components/places/PlaceCard.tsx
// Photo-forward, editorial card: name and city set into the photo itself
// (no white content plate below it), category read as plain text, no
// icon-in-a-colored-square chrome. "size" varies the aspect/scale so a
// grid of these can breathe instead of reading as a uniform card wall.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { StarIcon } from '@/components/ui/icons';

interface PlaceCardProps {
  place: Place;
  size?: 'md' | 'lg';
  priority?: boolean;
  /** Omitted or count 0 renders nothing — a card grid of 121 mostly-unrated places must not read as "0 değerlendirme" noise everywhere. */
  rating?: { average: number; count: number };
}

export function PlaceCard({ place, size = 'md', priority, rating }: PlaceCardProps) {
  const representative = isImageRepresentative(place.verificationStatus);
  const aspect = size === 'lg' ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-square';

  return (
    <Link href={`/places/${place.slug}`} className="group relative block overflow-hidden rounded-md bg-surface-muted">
      <div className={`relative ${aspect} w-full overflow-hidden`}>
        {place.image ? (
          <Image
            src={place.image}
            alt={`${place.name}, ${place.city}`}
            fill
            priority={priority}
            sizes={size === 'lg' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-display text-2xl italic text-white/25">Gezeceyik</span>
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{ background: 'linear-gradient(0deg, rgb(13 46 66 / 0.82) 0%, rgb(13 46 66 / 0) 100%)' }}
          aria-hidden="true"
        />

        <div className="absolute right-2.5 top-2.5">
          <FavoriteButton slug={place.slug} name={place.name} size="sm" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white/75">
            <span>{tr.categories[place.category]}</span>
            {representative && (
              <span className="rounded-full border border-white/25 px-1.5 py-0.5 text-[9px] normal-case tracking-normal text-white/70">
                Temsili görsel
              </span>
            )}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-white text-balance">
            {place.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
            <span>{place.city}, {place.region}</span>
            {rating && rating.count > 0 && (
              <span className="flex items-center gap-0.5 text-white/85">
                <StarIcon filled className="h-3 w-3 text-terracotta" />
                {rating.average.toFixed(1)} · {tr.rating.reviewCount(rating.count)}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
