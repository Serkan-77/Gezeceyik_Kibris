'use client';
// components/pages/SavedRoutesClient.tsx
// "Rotalarım" section of /gezilerim — the visitor's saved manual routes
// (Section 10 of the route-builder spec), separate from the auto-planner's
// saved itineraries below it (GezilerimClient). Fetches its own data via
// /api/routes on mount rather than as a server-rendered prop, so
// app/gezilerim/page.tsx can stay the simple static shell it already is —
// mirroring how GezilerimClient itself reads localStorage client-side.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RouteSummary } from '@/types/route';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { RouteIcon, ArrowRightIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function SavedRoutesClient() {
  const [routes, setRoutes] = useState<RouteSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/routes')
      .then((res) => res.json())
      .then((data: { routes: RouteSummary[] }) => {
        if (!cancelled) setRoutes(data.routes);
      })
      .catch(() => {
        if (!cancelled) setRoutes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (routes === null) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <EmptyState
        icon={<RouteIcon className="h-6 w-6" />}
        title={tr.route.savedRoutesEmpty}
        description={tr.route.savedRoutesEmptyHint}
        action={<Button href="/places">{tr.route.browsePlaces}</Button>}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {routes.map((route) => (
        <Link
          key={route.id}
          href={`/rotam/${route.id}`}
          className="group flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-5 py-4 transition-colors hover:border-ink"
        >
          <div className="min-w-0">
            <p className="truncate font-display text-card-title font-semibold text-strong">{route.name ?? tr.route.unnamedRoute}</p>
            <p className="text-meta text-subtle">
              {tr.route.stopCount(route.stopCount)} · {tr.route.updatedAt(formatDate(route.updatedAt))}
            </p>
          </div>
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
      ))}
    </div>
  );
}
