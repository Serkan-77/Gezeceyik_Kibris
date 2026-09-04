'use client';
// components/map/PlacesMapWrapper.tsx
// SSR-safe wrapper for the Leaflet map.
// Dynamically imports the actual map (which uses browser-only APIs) on client only.

import dynamic from 'next/dynamic';
import type L from 'leaflet';
import { Place } from '@/types/place';

const PlacesMap = dynamic(() => import('./PlacesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
      <div className="flex flex-col items-center gap-3 text-subtle">
        <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-body-sm">Harita yükleniyor…</p>
      </div>
    </div>
  ),
});

interface PlacesMapWrapperProps {
  places: Place[];
  visibleSlugs: Set<string>;
  selectedSlug?: string | null;
  onSelect?: (slug: string | null) => void;
  onUserMovedBounds?: (bounds: L.LatLngBounds) => void;
  visible?: boolean;
  favoriteSlugs?: Set<string>;
  routeSlugs?: string[];
  onToggleFavorite?: (slug: string) => void;
  onToggleRoute?: (slug: string) => void;
}

export function PlacesMapWrapper(props: PlacesMapWrapperProps) {
  // isolate: keeps Leaflet's internal pane z-indexes (600-1000+) from
  // comparing against page-level chrome like the sticky Navbar.
  return (
    <div className="relative isolate h-full w-full">
      <PlacesMap {...props} />
    </div>
  );
}
