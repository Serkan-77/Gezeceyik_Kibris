'use client';
// components/trip/RouteMapWrapper.tsx
// SSR-safe wrapper for the itinerary's route map (Leaflet is browser-only).

import dynamic from 'next/dynamic';
import { ItineraryDay, AccommodationLocation } from '@/lib/trip-planner/types';

const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-body-sm text-subtle">
      Rota yükleniyor…
    </div>
  ),
});

interface RouteMapWrapperProps {
  day: ItineraryDay;
  accommodation: AccommodationLocation;
  focusedSlug?: string | null;
  onSelectStop?: (slug: string) => void;
  panToken?: number;
  panSlug?: string | null;
}

export function RouteMapWrapper(props: RouteMapWrapperProps) {
  // isolate: keeps Leaflet's internal pane z-indexes (600-1000+) from
  // comparing against page-level chrome like the sticky Navbar.
  return (
    <div className="relative isolate h-full w-full">
      <RouteMap {...props} />
    </div>
  );
}
