'use client';
// components/places/DiscoveryRow.tsx
// Borderless editorial result row — replaces the card-grid default. Real
// photographic presence and breathing room (not a directory line), two
// separate interactive targets by design: the row body selects the place
// (syncs the map), the trailing link navigates to the detail page —
// nesting a link inside a button isn't valid HTML/a11y, so they stay
// siblings. `featured` gives the lead result in a list more photographic
// space — a justified rhythm variation, not a card.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { CategoryBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { useTodayKey } from '@/hooks/useTodayKey';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { ArrowRightIcon, PinIcon } from '@/components/ui/icons';

interface DiscoveryRowProps {
  place: Place;
  selected?: boolean;
  onSelect?: () => void;
  featured?: boolean;
  rowRef?: (el: HTMLDivElement | null) => void;
}

export function DiscoveryRow({ place, selected = false, onSelect, featured = false, rowRef }: DiscoveryRowProps) {
  const hasLocation =
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude);

  const todayKey = useTodayKey();
  const todayHours = todayKey ? place.openingHours?.[todayKey] : undefined;
  const admissionLabel = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
    : null;
  const representative = isImageRepresentative(place.verificationStatus);

  const photoWidth = featured ? 'w-40 sm:w-64' : 'w-32 sm:w-44';

  return (
    <div
      ref={rowRef}
      className={`group flex items-stretch gap-4 border-b border-line py-4 pl-3 transition-colors sm:gap-5 ${
        selected ? 'border-l-2 border-l-brand bg-brand/5 pl-2.5' : 'hover:bg-surface-muted'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!hasLocation || !onSelect}
        aria-pressed={selected}
        aria-label={`${place.name}${hasLocation ? ', haritada göster' : ''}`}
        className="flex min-w-0 flex-1 items-stretch gap-4 text-left disabled:cursor-default sm:gap-5"
      >
        <span className={`relative shrink-0 self-stretch overflow-hidden rounded-sm bg-surface-muted ${photoWidth}`}>
          {place.image ? (
            <Image
              src={place.image}
              alt=""
              fill
              sizes="(max-width: 640px) 40vw, 260px"
              className="object-cover"
            />
          ) : null}
          {representative && place.image && (
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/92 px-1.5 py-0.5 text-[9px] font-medium text-ink-soft">
              Temsili
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={place.category} />
            {!hasLocation && <span className="text-meta text-faint">{tr.map.noLocation}</span>}
          </span>
          <span
            className={`block truncate font-display font-semibold text-strong ${
              featured ? 'text-block-title' : 'text-card-title'
            }`}
          >
            {place.name}
          </span>
          <span className="flex items-center gap-1 truncate text-meta text-subtle">
            <PinIcon className="h-3 w-3 shrink-0" />
            {place.city}, {place.region}
          </span>
          <span className="line-clamp-2 max-w-2xl text-body-sm leading-relaxed text-muted">
            {place.shortDescription}
          </span>
          {(admissionLabel || todayHours !== undefined) && (
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta text-subtle">
              {admissionLabel && (
                <span className={place.admission?.isFree ? 'font-medium text-success' : 'font-medium text-muted'}>
                  {admissionLabel}
                </span>
              )}
              {admissionLabel && todayHours !== undefined && <span aria-hidden="true">·</span>}
              {todayHours !== undefined && <span>{todayHours === null ? 'Bugün kapalı' : `Bugün ${todayHours}`}</span>}
            </span>
          )}
        </span>
      </button>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2 py-0.5">
        <FavoriteButton placeSlug={place.slug} placeName={place.name} />
        <Link
          href={`/places/${place.slug}`}
          aria-label={`${place.name}, ${tr.place.viewDetails}`}
          className="flex h-9 w-9 items-center justify-center rounded-sm text-subtle transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
