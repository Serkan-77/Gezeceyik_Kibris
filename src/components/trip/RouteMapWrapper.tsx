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
}

export function RouteMapWrapper({ day, accommodation }: RouteMapWrapperProps) {
  return <RouteMap day={day} accommodation={accommodation} />;
}
