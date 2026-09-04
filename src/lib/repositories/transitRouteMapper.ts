// lib/repositories/transitRouteMapper.ts
// Converts between the Supabase persistence shape (TransitRouteRow) and the
// application's domain shape (BusRoute, in src/types/transit.ts) — the
// transit-route equivalent of placeMapper.ts. Since the row shape already
// matches BusRoute field-for-field (both were always flat/camelCase), this
// mapping was already close to identity and stays that way.

import { BusRoute } from '@/types/transit';
import { TransitRouteRow, TransitRouteInput } from '@/lib/db/transitRouteSchema';

/** Converts a Supabase transit route row into the domain `BusRoute` shape the trip planner expects. */
export function toDomainBusRoute(row: TransitRouteRow): BusRoute {
  return {
    id: row.id,
    operator: row.operator,
    fromRegion: row.fromRegion,
    toRegion: row.toRegion,
    fromStop: row.fromStop,
    toStop: row.toStop,
    durationMinutes: row.durationMinutes,
    fareTRY: row.fareTRY,
    schedule: row.schedule,
    phone: row.phone,
    notes: row.notes,
    sourceUrl: row.sourceUrl,
    lastVerifiedAt: row.lastVerifiedAt,
    verificationStatus: row.verificationStatus,
  };
}

export function toDomainBusRoutes(rows: TransitRouteRow[]): BusRoute[] {
  return rows.map(toDomainBusRoute);
}

/**
 * Converts a domain `BusRoute` into the Supabase write shape. Used by the
 * seed script to migrate src/data/transitRoutes.ts into the `transitRoutes`
 * table.
 */
export function fromDomainBusRoute(route: BusRoute, options: { active: boolean }): TransitRouteInput {
  return {
    operator: route.operator,
    fromRegion: route.fromRegion,
    toRegion: route.toRegion,
    fromStop: route.fromStop,
    toStop: route.toStop,
    durationMinutes: route.durationMinutes,
    fareTRY: route.fareTRY,
    schedule: route.schedule,
    phone: route.phone ?? [],
    notes: route.notes,
    sourceUrl: route.sourceUrl,
    lastVerifiedAt: route.lastVerifiedAt,
    verificationStatus: route.verificationStatus,
    active: options.active,
  };
}
