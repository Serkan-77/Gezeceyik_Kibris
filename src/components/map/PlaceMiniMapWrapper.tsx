'use client';
// components/map/PlaceMiniMapWrapper.tsx
// SSR-safe wrapper for the single-place Leaflet mini map.

import dynamic from 'next/dynamic';

const PlaceMiniMap = dynamic(() => import('./PlaceMiniMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-meta text-subtle">
      Harita yükleniyor…
    </div>
  ),
});

interface PlaceMiniMapWrapperProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function PlaceMiniMapWrapper({ latitude, longitude, name }: PlaceMiniMapWrapperProps) {
  return <PlaceMiniMap latitude={latitude} longitude={longitude} name={name} />;
}
