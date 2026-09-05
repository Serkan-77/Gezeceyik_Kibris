// lib/repositories/routeMapper.ts
// Assembles the domain Route shape (types/route.ts) from a routes row, its
// routeStops rows, and the places those stops point to. Mirrors
// placeMapper.ts's role for the places table.

import { Route, RouteStop, RouteSummary } from '@/types/route';
import { RouteRow, RouteStopRow } from '@/lib/db/routeSchema';
import { PlaceRow } from '@/lib/db/placeSchema';
import { toDomainPlace } from './placeMapper';

/**
 * Builds a full Route (with ordered stops + place data) from raw rows.
 * Stops pointing at a place row that failed to map (or is missing
 * entirely — e.g. a hard-deleted place) are skipped with a warning rather
 * than throwing, so one bad stop can't take down the whole route.
 */
export function toDomainRoute(route: RouteRow, stopRows: RouteStopRow[], placeRows: PlaceRow[]): Route {
  const placesById = new Map(placeRows.map((p) => [p.id, p]));

  const stops: RouteStop[] = [];
  for (const stopRow of [...stopRows].sort((a, b) => a.position - b.position)) {
    const placeRow = placesById.get(stopRow.placeId);
    if (!placeRow) {
      console.warn(`[routeMapper] Skipping route stop "${stopRow.id}" — referenced place "${stopRow.placeId}" not found.`);
      continue;
    }
    try {
      stops.push({ id: stopRow.id, position: stopRow.position, place: toDomainPlace(placeRow) });
    } catch (err) {
      console.warn(`[routeMapper] Skipping route stop "${stopRow.id}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return {
    id: route.id,
    name: route.name,
    status: route.status,
    stops,
    createdAt: route.createdAt,
    updatedAt: route.updatedAt,
  };
}

export function toRouteSummary(route: RouteRow, stopCount: number): RouteSummary {
  return {
    id: route.id,
    name: route.name,
    status: route.status,
    stopCount,
    createdAt: route.createdAt,
    updatedAt: route.updatedAt,
  };
}
