// components/places/PlaceCard.tsx
// "Kıbrıs Atlas" rebuild — a specimen-plate card, not a photo-with-text-
// overlay. The photograph sits in a hairline-bordered frame on its own;
// the name, category and index number live in a caption block BELOW it,
// like a museum label under a framed print. No gradient scrim, no white
// pill badges on the image — the frame and the rule under it do the work.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { StarIcon } from '@/components/ui/icons';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';

interface PlaceCardProps {
  place: Place;
  size?: 'md' | 'lg';
  priority?: boolean;
  /** Omitted or count 0 renders nothing — a card grid of 121 mostly-unrated places must not read as "0 değerlendirme" noise everywhere. */
  rating?: { average: number; count: number };
  /** Overrides the size-derived aspect ratio — for bento/collage layouts where the grid cell shape, not `size`, decides the image's proportions. */
  aspectClassName?: string;
  /** Stretches the card to fill its grid cell's full height instead of sizing from its own aspect ratio — pair with an `aspectClassName` that includes `h-full` (e.g. a row-spanning bento cell). */
  fillHeight?: boolean;
  /** Plate number printed in the caption strip (N°014). Purely decorative index — omitted when the caller has no stable position to show. */
  index?: number;
}

export function PlaceCard({ place, size = 'md', priority, rating, aspectClassName, fillHeight, index }: PlaceCardProps) {
  const representative = isImageRepresentative(place.verificationStatus);
  const aspect = aspectClassName ?? (size === 'lg' ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-square');
  const CategoryIcon = CATEGORY_ICONS[place.category];

  return (
    <Link
      href={`/places/${place.slug}`}
      className={`group relative flex flex-col border border-line bg-surface transition-colors hover:border-ink${fillHeight ? ' h-full' : ''}`}
    >
      <div
        className={`relative w-full overflow-hidden border-b border-line bg-surface-muted ${
          fillHeight ? 'min-h-[160px] flex-1' : `${aspect} shrink-0`
        }`}
      >
        {place.image ? (
          <Image
            src={place.image}
            alt={`${place.name}, ${place.city}`}
            fill
            priority={priority}
            sizes={size === 'lg' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
            className="object-cover grayscale-[15%] transition-[filter,transform] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-display text-lg text-white/25">Gezeceyik</span>
          </div>
        )}

        <div className="absolute right-2 top-2">
          <FavoriteButton slug={place.slug} name={place.name} size="sm" />
        </div>

        {representative && (
          <span className="absolute bottom-0 left-0 border-r border-t border-line bg-surface/95 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-subtle">
            Temsili
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 p-3 sm:p-3.5">
        <div>
          <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
            <span className="flex items-center gap-1.5">
              <CategoryIcon className="h-3.5 w-3.5 shrink-0" />
              {tr.categories[place.category]}
            </span>
            {index !== undefined && <span className="text-faint">N&deg;{String(index + 1).padStart(3, '0')}</span>}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5em] font-serif text-[17px] font-semibold leading-tight text-strong">{place.name}</h3>
        </div>
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span>{place.city}, {place.region}</span>
          {rating && rating.count > 0 && (
            <span className="ml-auto flex items-center gap-1 text-ink-soft">
              <StarIcon filled className="h-3 w-3 text-ochre" />
              {rating.average.toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
