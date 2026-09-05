'use client';
// components/places/MobileActionBar.tsx
// Mobile is a primary use case here (someone walking around Cyprus), so
// the actions that matter most in the moment — save it, add to trip, get
// directions — stay reachable without scrolling back up. When the visitor
// has an in-progress route, a thin status row surfaces it right above the
// action buttons — the mobile entry point into /rotam (Section 2 of the
// route-builder spec) — without becoming a second floating panel.

import Link from 'next/link';
import { Place } from '@/types/place';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { Button } from '@/components/ui/Button';
import { DirectionsIcon, ArrowRightIcon } from '@/components/ui/icons';
import { useDraftRoute } from '@/context/DraftRouteContext';
import { tr } from '@/lib/i18n/tr';

export function MobileActionBar({ place }: { place: Place }) {
  const { count, hydrated } = useDraftRoute();
  const mapsQuery = encodeURIComponent(`${place.name}, ${place.address}`);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-overlay border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {hydrated && count > 0 && (
        <Link
          href="/rotam"
          className="flex items-center justify-between border-b border-line/70 bg-brand/5 px-4 py-2 text-caption text-brand-strong"
        >
          <span>
            <span className="font-semibold tabular-nums">{count}</span> durak rotanda
          </span>
          <span className="flex items-center gap-1 font-medium">
            Rotanı görüntüle
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </Link>
      )}
      <div className="flex items-center gap-2 px-4 py-3">
        <FavoriteButton slug={place.slug} name={place.name} />
        <AddToTripButton place={place} />
        <Button
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="ink"
          icon={<DirectionsIcon className="h-4 w-4" />}
          className="flex-1"
        >
          {tr.place.getDirections}
          <span className="sr-only">(yeni sekmede açılır)</span>
        </Button>
      </div>
    </div>
  );
}
