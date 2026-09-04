'use client';
// components/home/RouteSceneMapWrapper.tsx
// SSR-safe wrapper — RouteSceneMap uses browser-only Leaflet APIs.

import dynamic from 'next/dynamic';
import type { RouteSceneStop } from './RouteSceneMap';

const RouteSceneMap = dynamic(() => import('./RouteSceneMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-body-sm text-subtle">
      Harita yükleniyor…
    </div>
  ),
});

export function RouteSceneMapWrapper({ stops }: { stops: RouteSceneStop[] }) {
  return <RouteSceneMap stops={stops} />;
}
