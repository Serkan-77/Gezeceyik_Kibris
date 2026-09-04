// components/map/MapResultRow.tsx
// Compact result row for the /harita discovery list — lighter than the
// editorial DiscoveryRow used at /places, so a long scrolling list of
// hundreds of places stays scannable.
// Two separate interactive targets by design: the row button selects the
// place (pans/zooms the map to it), the trailing arrow navigates straight
// to the detail page — nesting a link inside a button isn't valid HTML/a11y,
// so they're kept as siblings instead.

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { CategoryBadge } from '@/components/ui/Badge';
import { ArrowRightIcon, PinIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

interface MapResultRowProps {
  place: Place;
  selected: boolean;
  onSelect: () => void;
  rowRef?: (el: HTMLDivElement | null) => void;
}

export function MapResultRow({ place, selected, onSelect, rowRef }: MapResultRowProps) {
  const hasLocation =
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude);

  return (
    <div
      ref={rowRef}
      className={`flex items-stretch gap-1 border-b border-line transition-colors ${
        selected ? 'bg-brand/5' : 'hover:bg-surface-muted'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!hasLocation}
        aria-pressed={selected}
        aria-label={`${place.name}${hasLocation ? ', haritada göster' : ''}`}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left disabled:cursor-default"
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
          {place.image && (
            <Image src={place.image} alt="" fill sizes="56px" className="object-cover" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-body-sm font-semibold text-strong">
            {place.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1 truncate text-meta text-subtle">
            <PinIcon className="h-3 w-3 shrink-0" />
            {place.city}, {place.region}
          </span>
          <span className="mt-1 flex items-center gap-2">
            <CategoryBadge category={place.category} />
            {!hasLocation && <span className="text-meta text-faint">{tr.map.noLocation}</span>}
          </span>
        </span>
      </button>
      <Link
        href={`/places/${place.slug}`}
        aria-label={`${place.name}, ${tr.place.viewDetails}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-sm text-subtle transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
