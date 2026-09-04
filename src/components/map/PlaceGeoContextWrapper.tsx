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
  return <PlaceGeoContext place={place} nearby={nearby} />;
}
