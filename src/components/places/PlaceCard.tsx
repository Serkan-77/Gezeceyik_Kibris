'use client';
// components/places/PlaceCard.tsx
// Destination-first card: image → name → location/category → light visitor
// info. Favorite/trip actions stay reachable but visually secondary — small
// icon toggles stacked on the image, never competing with the destination itself.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { Badge, CategoryBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { useTodayKey } from '@/hooks/useTodayKey';
import { tr } from '@/lib/i18n/tr';
import { formatDistance } from '@/lib/places';
import { PinIcon } from '@/components/ui/icons';

interface PlaceCardProps {
  place: Place;
  /** Optional distance in metres — shown when available (geolocation mode) */
  distanceMeters?: number;
}

export function PlaceCard({ place, distanceMeters }: PlaceCardProps) {
  const admissionLabel = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
    : null;

  const todayKey = useTodayKey();
  const todayHours = todayKey ? place.openingHours?.[todayKey] : undefined;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow duration-[var(--duration-base)] hover:shadow-[var(--shadow-lift)]">
      {/* Image */}
      <Link
        href={`/places/${place.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-muted"
        tabIndex={-1}
        aria-hidden="true"
      >
        {place.image ? (
          <Image
            src={place.image}
            alt={`${place.name}, ${place.city}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-editorial)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-body-sm text-faint">
            Fotoğraf yok
          </div>
        )}

        <div className="absolute left-3 top-3">
          <CategoryBadge category={place.category} overlay />
        </div>
      </Link>

      {/* Fav + trip actions — secondary, stacked with the free badge if present */}
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
        {place.admission?.isFree && <Badge label={tr.place.free} variant="success" />}
        <FavoriteButton placeSlug={place.slug} placeName={place.name} />
        <AddToTripButton placeSlug={place.slug} placeName={place.name} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="font-display text-card-title font-semibold leading-snug text-strong">
          <Link
            href={`/places/${place.slug}`}
            className="hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {place.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1 text-meta text-subtle">
          <PinIcon className="h-3 w-3 shrink-0" />
          {place.city}, {place.region}
          {distanceMeters !== undefined && (
            <span className="text-brand">· {formatDistance(distanceMeters)}</span>
          )}
        </p>

        <p className="mt-2 line-clamp-2 text-body-sm leading-relaxed text-muted">
          {place.shortDescription}
        </p>

        {/* Footer meta — light touch, not a data table */}
        {(admissionLabel || todayHours !== undefined) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3.5 text-meta text-subtle">
            {admissionLabel && (
              <span className={place.admission?.isFree ? 'font-medium text-success' : 'font-medium text-muted'}>
                {admissionLabel}
              </span>
            )}
            {admissionLabel && todayHours !== undefined && <span aria-hidden="true">·</span>}
            {todayHours !== undefined && (
              <span>{todayHours === null ? 'Bugün kapalı' : `Bugün ${todayHours}`}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
