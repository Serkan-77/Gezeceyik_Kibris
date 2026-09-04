'use client';
// components/map/PlaceGeoContextWrapper.tsx
// SSR-safe wrapper — PlaceGeoContext uses browser-only Leaflet APIs.

import dynamic from 'next/dynamic';
import type { GeoContextPoint } from './PlaceGeoContext';

const PlaceGeoContext = dynamic(() => import('./PlaceGeoContext'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-body-sm text-subtle">
      Harita yükleniyor…
    </div>
  ),
});

export function PlaceGeoContextWrapper({ place, nearby }: { place: GeoContextPoint; nearby: GeoContextPoint[] }) {
  // isolate: Leaflet's own panes (markers, popups, controls) use internal
  // z-index values well above the page's own scale (600-1000+); without
  // a new stacking context here they compare directly against page
  // chrome like the sticky Navbar and can paint over it while scrolling.
  return (
    <div className="relative isolate h-full w-full">
      <PlaceGeoContext place={place} nearby={nearby} />
    </div>
  );
}
