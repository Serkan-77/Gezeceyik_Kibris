'use client';
// context/DraftRouteContext.tsx
// The ONE canonical current-route state (Section 1/11 of the route-builder
// spec) — mounted once in the root layout, so it survives client-side
// navigation between place detail / discovery / map / /rotam without
// refetching, and every "Rotaya ekle" button anywhere in the app reads
// and writes through the same place.
//
// Backed by Supabase (via Server Actions), not localStorage — that's what
// makes it a real, refresh-proof, cross-tab "one draft route" rather than
// a per-tab client illusion. Initial state is hydrated with a single
// fetch to /api/route/draft on mount rather than as a server-rendered
// prop from the layout, specifically to avoid making the root layout (and
// therefore every statically-generated page under it) request-time
// dynamic — see that route's file comment for the full reasoning.
//
// Mirrors the hydrated-flag pattern already used by useFavorites
// (hooks/useLocalStorageSet.ts) so buttons never flash a wrong
// pre-hydration state.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { PlaceLite } from '@/types/place';
import { Route } from '@/types/route';
import { addStopToDraftAction, removeStopFromDraftAction } from '@/app/rotam/actions';

interface DraftRouteContextValue {
  route: Route | null;
  hydrated: boolean;
  count: number;
  isSelected: (slug: string) => boolean;
  isPending: (slug: string) => boolean;
  add: (place: PlaceLite) => void;
  remove: (slug: string) => void;
  /** Called after a server action elsewhere (route builder mutations) already has the fresh route — keeps this context in sync without a refetch. */
  setRoute: (route: Route | null) => void;
}

const DraftRouteContext = createContext<DraftRouteContextValue | null>(null);

export function DraftRouteProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState<Map<string, 'add' | 'remove'>>(new Map());
  const routeRef = useRef<Route | null>(null);
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/route/draft')
      .then((res) => res.json())
      .then((data: { route: Route | null }) => {
        if (cancelled) return;
        setRoute(data.route);
        setHydrated(true);
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isSelected = useCallback(
    (slug: string) => {
      const pendingAction = pending.get(slug);
      if (pendingAction) return pendingAction === 'add';
      return route?.stops.some((s) => s.place.slug === slug) ?? false;
    },
    [route, pending]
  );

  const isPending = useCallback((slug: string) => pending.has(slug), [pending]);

  const add = useCallback((place: PlaceLite) => {
    if (routeRef.current?.stops.some((s) => s.place.slug === place.slug)) return;
    setPending((prev) => new Map(prev).set(place.slug, 'add'));
    addStopToDraftAction(place.id)
      .then((result) => {
        if (result.error) throw new Error(result.error);
        if (result.route) setRoute(result.route);
      })
      .catch((err) => {
        console.warn('[DraftRouteContext] add failed:', err);
      })
      .finally(() => {
        setPending((prev) => {
          const next = new Map(prev);
          next.delete(place.slug);
          return next;
        });
      });
  }, []);

  const remove = useCallback((slug: string) => {
    const placeId = routeRef.current?.stops.find((s) => s.place.slug === slug)?.place.id;
    if (!placeId) return;
    setPending((prev) => new Map(prev).set(slug, 'remove'));
    removeStopFromDraftAction(placeId)
      .then((result) => {
        if (result.error) throw new Error(result.error);
        setRoute(result.route ?? null);
      })
      .catch((err) => {
        console.warn('[DraftRouteContext] remove failed:', err);
      })
      .finally(() => {
        setPending((prev) => {
          const next = new Map(prev);
          next.delete(slug);
          return next;
        });
      });
  }, []);

  const value = useMemo<DraftRouteContextValue>(
    () => ({
      route,
      hydrated,
      count: route?.stops.length ?? 0,
      isSelected,
      isPending,
      add,
      remove,
      setRoute,
    }),
    [route, hydrated, isSelected, isPending, add, remove]
  );

  return <DraftRouteContext.Provider value={value}>{children}</DraftRouteContext.Provider>;
}

export function useDraftRoute(): DraftRouteContextValue {
  const ctx = useContext(DraftRouteContext);
  if (!ctx) throw new Error('useDraftRoute must be used within a DraftRouteProvider.');
  return ctx;
}
