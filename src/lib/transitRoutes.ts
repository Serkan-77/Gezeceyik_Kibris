import 'server-only';
// lib/transitRoutes.ts
// Data-access seam for inter-city bus route data — the transit equivalent
// of lib/places.ts. Every page/component reads transit data through this,
// never directly from Supabase and never directly from the local dataset.
//
// Tries Supabase first (transitRouteRepository). In development, a failed
// read falls back to the local static dataset (src/data/transitRoutes.ts)
// with a warning, so `npm run dev` works without a live database. In
// production, a failed read propagates instead of silently serving stale
// local data.

import { transitRoutes as localTransitRoutes } from '@/data/transitRoutes';
import { BusRoute } from '@/types/transit';
import * as transitRouteRepository from '@/lib/repositories/transitRouteRepository';
import { toDomainBusRoutes } from '@/lib/repositories/transitRouteMapper';

const isProduction = process.env.NODE_ENV === 'production';

function warnFallback(context: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.warn(
    `[lib/transitRoutes] Supabase read failed (${context}) — falling back to local sample data. ` +
      `This fallback only runs outside production. Reason: ${message}`
  );
}

export async function getActiveTransitRoutes(): Promise<BusRoute[]> {
  try {
    return toDomainBusRoutes(await transitRouteRepository.findActive());
  } catch (err) {
    if (isProduction) throw err;
    warnFallback('getActiveTransitRoutes', err);
    return localTransitRoutes;
  }
}
