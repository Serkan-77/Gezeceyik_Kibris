'use client';
// components/route/RouteBuilderMapWrapper.tsx
// SSR-safe wrapper — RouteBuilderMap uses browser-only Leaflet APIs.

import dynamic from 'next/dynamic';
import { RouteStop } from '@/types/route';
import { tr } from '@/lib/i18n/tr';

const RouteBuilderMap = dynamic(() => import('./RouteBuilderMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-body-sm text-subtle">
      {tr.route.mapLoading}
    </div>
  ),
});

interface RouteBuilderMapWrapperProps {
  stops: RouteStop[];
  focusedSlug?: string | null;
  onSelectStop?: (slug: string) => void;
}

export function RouteBuilderMapWrapper(props: RouteBuilderMapWrapperProps) {
  // isolate: keeps Leaflet's internal pane z-indexes (600-1000+) from
  // comparing against page-level chrome like the sticky Navbar.
  return (
    <div className="relative isolate h-full w-full">
      <RouteBuilderMap {...props} />
    </div>
  );
}
