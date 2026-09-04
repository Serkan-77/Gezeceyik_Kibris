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
import { ArrowRightIcon, PinIcon } from '@/components/ui/icons';

export function DiscoveryRow({ place }: { place: Place }) {
  const todayKey = useTodayKey();
  const todayHours = todayKey ? place.openingHours?.[todayKey] : undefined;
  const admissionLabel = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
      ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
      : null;
  const representative = isImageRepresentative(place.verificationStatus);

  return (
    <div className="group flex items-stretch gap-4 border-b border-line py-4 transition-colors hover:bg-surface-muted sm:gap-5">
      <Link href={`/places/${place.slug}`} className="flex min-w-0 flex-1 items-stretch gap-4 sm:gap-5">
        <span className="relative w-32 shrink-0 self-stretch overflow-hidden rounded-sm bg-surface-muted sm:w-44">
          {place.image && <Image src={place.image} alt="" fill sizes="(max-width: 640px) 40vw, 260px" className="object-cover" />}
          {representative && place.image && (
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/92 px-1.5 py-0.5 text-[9px] font-medium text-ink-soft">
              Temsili
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">{tr.categories[place.category]}</span>
          <span className="block truncate font-display text-card-title font-semibold text-strong">{place.name}</span>
          <span className="flex items-center gap-1 truncate text-meta text-subtle">
            <PinIcon className="h-3 w-3 shrink-0" />
            {place.city}, {place.region}
          </span>
          {(admissionLabel || todayHours !== undefined) && (
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta text-subtle">
              {admissionLabel && (
                <span className={place.admission?.isFree ? 'font-medium text-success' : 'font-medium text-muted'}>{admissionLabel}</span>
              )}
              {admissionLabel && todayHours !== undefined && <span aria-hidden="true">·</span>}
              {todayHours !== undefined && <span>{todayHours === null ? 'Bugün kapalı' : `Bugün ${todayHours}`}</span>}
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
