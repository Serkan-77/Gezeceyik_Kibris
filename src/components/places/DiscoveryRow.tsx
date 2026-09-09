'use client';
// components/places/DiscoveryRow.tsx
// Borderless editorial result row for the "nearby places" list on a place
// detail page — real photographic presence and breathing room, not a
// directory line or a repeated card grid.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { useTodayKey } from '@/hooks/useTodayKey';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { ArrowRightIcon, PinIcon, StarIcon } from '@/components/ui/icons';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';

interface DiscoveryRowProps {
  place: Place;
  /** Omitted or count 0 renders nothing — see PlaceCard for the same rule. */
  rating?: { average: number; count: number };
}

export function DiscoveryRow({ place, rating }: DiscoveryRowProps) {
  const todayKey = useTodayKey();
  const alwaysOpen = place.openingHours?.alwaysOpen ?? false;
  const todayHours = !alwaysOpen && todayKey ? place.openingHours?.[todayKey] : undefined;
  const admissionLabel = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
      ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
      : null;
  const representative = isImageRepresentative(place.verificationStatus);
  const CategoryIcon = CATEGORY_ICONS[place.category];

  return (
    <div className="group flex items-stretch gap-4 border-b border-line py-4 transition-colors hover:bg-surface-muted sm:gap-5">
      <Link href={`/places/${place.slug}`} className="flex min-w-0 flex-1 items-stretch gap-4 sm:gap-5">
        <span className="relative w-32 shrink-0 self-stretch overflow-hidden border border-line bg-surface-muted sm:w-44">
          {place.image && <Image src={place.image} alt="" fill sizes="(max-width: 640px) 40vw, 260px" className="object-cover" />}
          {representative && place.image && (
            <span className="absolute bottom-0 left-0 border-r border-t border-line bg-surface/95 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.05em] text-subtle">
              Temsili
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-subtle">
            <CategoryIcon className="h-3.5 w-3.5 shrink-0" />
            {tr.categories[place.category]}
          </span>
          <span className="block truncate font-serif text-card-title font-semibold text-strong">{place.name}</span>
          <span className="flex items-center gap-1 truncate font-mono text-meta text-subtle">
            <PinIcon className="h-3 w-3 shrink-0" />
            {place.city}, {place.region}
            {rating && rating.count > 0 && (
              <span className="ml-1.5 flex items-center gap-0.5 text-strong">
                <StarIcon filled className="h-3 w-3 text-ochre" />
                {rating.average.toFixed(1)} · {tr.rating.reviewCount(rating.count)}
              </span>
            )}
          </span>
          {(admissionLabel || alwaysOpen || todayHours !== undefined) && (
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta text-subtle">
              {admissionLabel && (
                <span className={place.admission?.isFree ? 'font-medium text-success' : 'font-medium text-muted'}>{admissionLabel}</span>
              )}
              {admissionLabel && (alwaysOpen || todayHours !== undefined) && <span aria-hidden="true">·</span>}
              {alwaysOpen ? (
                <span className="font-medium text-success">{tr.place.alwaysOpenBadge}</span>
              ) : (
                todayHours !== undefined && <span>{todayHours === null ? 'Bugün kapalı' : `Bugün ${todayHours}`}</span>
              )}
            </span>
          )}
        </span>
      </Link>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2 py-0.5">
        <FavoriteButton slug={place.slug} name={place.name} size="sm" />
        <Link
          href={`/places/${place.slug}`}
          aria-label={`${place.name}, ${tr.place.viewDetails}`}
          className="flex h-9 w-9 items-center justify-center rounded-sm text-subtle transition-colors hover:text-brand"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
