'use client';
// components/places/PlaceCard.tsx
// Kuzey Kıbrıs Discovery — travel editorial card.
// Turkish labels, favorite button, add-to-trip button.
// Client component because it reads favorites/trip state from localStorage.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { CategoryBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';

interface PlaceCardProps {
  place: Place;
  /** Optional distance in metres — shown when available (geolocation mode) */
  distanceMeters?: number;
}

function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function PlaceCard({ place, distanceMeters }: PlaceCardProps) {
  const admissionLabel = place.admission?.isFree
    ? 'Ücretsiz'
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
    : null;

  const todayKey = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ][new Date().getDay()] as keyof NonNullable<Place['openingHours']>;

  const todayHours = place.openingHours?.[todayKey];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-[#e8e4de] bg-white transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        href={`/places/${place.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f5f2ee]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {place.image ? (
          <Image
            src={place.image}
            alt={`${place.name}, ${place.city}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#c4bdb4] text-sm">
            Fotoğraf yok
          </div>
        )}

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={place.category} overlay />
        </div>

        {/* Free badge */}
        {place.admission?.isFree && (
          <div className="absolute right-3 top-3">
            <span className="inline-block rounded-sm bg-emerald-700/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Ücretsiz
            </span>
          </div>
        )}
      </Link>

      {/* Action buttons — absolute top-right on image when NOT free */}
      {!place.admission?.isFree && (
        <div className="absolute right-3 top-3 flex gap-1.5">
          <FavoriteButton placeSlug={place.slug} placeName={place.name} />
        </div>
      )}
      {place.admission?.isFree && (
        <div className="absolute right-3 bottom-[calc(100%-theme(spacing.10))] flex gap-1.5" />
      )}

      {/* Fav + Trip buttons overlay when free (right side below free badge) */}
      <div className="absolute right-3 top-11 flex flex-col gap-1.5">
        <FavoriteButton placeSlug={place.slug} placeName={place.name} />
        <AddToTripButton placeSlug={place.slug} placeName={place.name} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        {/* Location */}
        <p className="flex items-center gap-1 text-xs font-medium text-[#9ca3af]">
          <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {place.city}, {place.region}
          {distanceMeters !== undefined && (
            <span className="ml-1 text-[#e8651a]">· {formatDistance(distanceMeters)}</span>
          )}
        </p>

        {/* Title */}
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#1a1a1a]">
          <Link
            href={`/places/${place.slug}`}
            className="hover:text-[#e8651a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8651a] focus-visible:ring-offset-2"
          >
            {place.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#6b7280]">
          {place.shortDescription}
        </p>

        {/* Footer meta */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3.5">
          {admissionLabel && (
            <span
              className={`text-xs font-medium ${
                place.admission?.isFree ? 'text-emerald-700' : 'text-[#4b5563]'
              }`}
            >
              {admissionLabel}
            </span>
          )}
          {admissionLabel && todayHours !== undefined && (
            <span className="text-[#e8e4de]" aria-hidden="true">·</span>
          )}
          {todayHours !== undefined && (
            <span className="text-xs text-[#9ca3af]">
              {todayHours === null ? 'Bugün kapalı' : `Bugün ${todayHours}`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
