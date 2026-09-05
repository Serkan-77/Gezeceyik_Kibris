// types/route.ts
// Domain shape for a manually-built route ("rota") — the app-wide type
// every UI component works with. See lib/repositories/routeRepository.ts /
// routeMapper.ts for how this is assembled from the routes/routeStops
// tables and the existing places table.

import { Place } from './place';
import { RouteStatus } from '@/lib/db/routeSchema';

export interface RouteStop {
  /** routeStops.id — stable identity for list rendering across reorders. */
  id: string;
  position: number;
  place: Place;
}

export interface Route {
  id: string;
  name: string | null;
  status: RouteStatus;
  stops: RouteStop[];
  createdAt: string;
  updatedAt: string;
}

/** Lightweight projection for list views (Gezilerim) — no place data needed. */
export interface RouteSummary {
  id: string;
  name: string | null;
  status: RouteStatus;
  stopCount: number;
  createdAt: string;
  updatedAt: string;
}
