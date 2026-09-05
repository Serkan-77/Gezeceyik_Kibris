// lib/repositories/routeRepository.ts
// Data-access layer over the `routes` / `routeStops` tables. Ownership is
// always enforced here (against the anonymous id from lib/identity/anon.ts),
// never trusted from a caller-supplied value alone — every mutation takes
// an ownerId and re-checks the row actually belongs to it before touching
// anything. See src/app/rotam/actions.ts for the Server Actions that call
// into this module.

import { getSupabaseClient } from '@/lib/db/supabase';
import * as placeRepository from '@/lib/repositories/placeRepository';
import { RouteRow, RouteStopRow, RouteStatus } from '@/lib/db/routeSchema';
import { Route, RouteSummary } from '@/types/route';
import { toDomainRoute, toRouteSummary } from './routeMapper';

const ROUTES_TABLE = 'routes';
const STOPS_TABLE = 'routeStops';
const UNIQUE_VIOLATION = '23505';

function unwrap<T>(data: T | null, error: { message: string; code?: string } | null, context: string): T {
  if (error) throw new Error(`Supabase error (${context}): ${error.message}`);
  return data as T;
}

export class RouteNotFoundError extends Error {
  constructor(routeId: string) {
    super(`Route "${routeId}" not found or not owned by this visitor.`);
    this.name = 'RouteNotFoundError';
  }
}

// ─── Row-level reads ────────────────────────────────────────────

async function findRouteRow(routeId: string): Promise<RouteRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(ROUTES_TABLE).select('*').eq('id', routeId).maybeSingle();
  return unwrap(data, error, 'findRouteRow');
}

async function findStopRows(routeId: string): Promise<RouteStopRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(STOPS_TABLE).select('*').eq('routeId', routeId).order('position');
  return unwrap(data, error, 'findStopRows') ?? [];
}

/** Throws RouteNotFoundError if the route doesn't exist or isn't owned by ownerId. */
async function requireOwnedRoute(routeId: string, ownerId: string): Promise<RouteRow> {
  const row = await findRouteRow(routeId);
  if (!row || row.ownerId !== ownerId) throw new RouteNotFoundError(routeId);
  return row;
}

async function loadFullRoute(routeRow: RouteRow): Promise<Route> {
  const stopRows = await findStopRows(routeRow.id);
  const placeRows = await placeRepository.findByIdsAny(stopRows.map((s) => s.placeId));
  return toDomainRoute(routeRow, stopRows, placeRows);
}

// ─── Public reads ───────────────────────────────────────────────

/** The visitor's in-progress draft, or null if they've never started one. Does not create one. */
export async function getDraftRouteForOwner(ownerId: string): Promise<Route | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(ROUTES_TABLE)
    .select('*')
    .eq('ownerId', ownerId)
    .eq('status', 'draft')
    .maybeSingle();
  const row = unwrap(data, error, 'getDraftRouteForOwner');
  if (!row) return null;
  return loadFullRoute(row);
}

/** A specific route (draft or saved), only if owned by ownerId. Returns null otherwise — callers should 404, not distinguish "missing" from "not yours". */
export async function getRouteForOwner(routeId: string, ownerId: string): Promise<Route | null> {
  const row = await findRouteRow(routeId);
  if (!row || row.ownerId !== ownerId) return null;
  return loadFullRoute(row);
}

export async function listSavedRoutesForOwner(ownerId: string): Promise<RouteSummary[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(ROUTES_TABLE)
    .select('*')
    .eq('ownerId', ownerId)
    .eq('status', 'saved')
    .order('updatedAt', { ascending: false });
  const rows = unwrap(data, error, 'listSavedRoutesForOwner') ?? [];
  if (rows.length === 0) return [];

  const { data: stopCounts, error: stopErr } = await supabase
    .from(STOPS_TABLE)
    .select('routeId')
    .in(
      'routeId',
      rows.map((r) => r.id)
    );
  const stopRows = unwrap(stopCounts, stopErr, 'listSavedRoutesForOwner.stopCounts') ?? [];
  const countByRoute = new Map<string, number>();
  for (const s of stopRows) countByRoute.set(s.routeId, (countByRoute.get(s.routeId) ?? 0) + 1);

  return rows.map((r) => toRouteSummary(r, countByRoute.get(r.id) ?? 0));
}

// ─── Draft resolution ───────────────────────────────────────────

/**
 * Finds the visitor's draft route id, creating an empty one if they don't
 * have one yet. Races (two rapid "Rotaya ekle" clicks before the first
 * request lands) are resolved by the partial unique index
 * routes_one_draft_per_owner_idx — a losing insert's unique-violation is
 * caught and the winning row re-fetched.
 */
async function getOrCreateDraftRouteId(ownerId: string): Promise<string> {
  const supabase = getSupabaseClient();
  const { data: existing, error: findErr } = await supabase
    .from(ROUTES_TABLE)
    .select('id')
    .eq('ownerId', ownerId)
    .eq('status', 'draft')
    .maybeSingle();
  const existingRow = unwrap(existing, findErr, 'getOrCreateDraftRouteId.find');
  if (existingRow) return existingRow.id;

  const { data: created, error: insertErr } = await supabase
    .from(ROUTES_TABLE)
    .insert({ ownerId, status: 'draft' })
    .select('id')
    .single();

  if (insertErr) {
    if (insertErr.code === UNIQUE_VIOLATION) {
      const { data: winner, error: refetchErr } = await supabase
        .from(ROUTES_TABLE)
        .select('id')
        .eq('ownerId', ownerId)
        .eq('status', 'draft')
        .single();
      return unwrap(winner, refetchErr, 'getOrCreateDraftRouteId.refetch').id;
    }
    throw new Error(`Supabase error (getOrCreateDraftRouteId.insert): ${insertErr.message}`);
  }
  return unwrap(created, null, 'getOrCreateDraftRouteId.insert').id;
}

// ─── Mutations ──────────────────────────────────────────────────

async function touchRoute(routeId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from(ROUTES_TABLE).update({ updatedAt: new Date().toISOString() }).eq('id', routeId);
}

async function nextPosition(routeId: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(STOPS_TABLE)
    .select('position')
    .eq('routeId', routeId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = unwrap(data, error, 'nextPosition');
  return (row?.position ?? 0) + 1;
}

/** Adds a place to an owned route. Idempotent — adding an already-present place is a no-op. */
export async function addStopToRoute(routeId: string, ownerId: string, placeId: string): Promise<Route> {
  const routeRow = await requireOwnedRoute(routeId, ownerId);

  const exists = await placeRepository.existsPublishedId(placeId);
  if (!exists) throw new Error(`Place "${placeId}" does not exist or is not published.`);

  const supabase = getSupabaseClient();
  const position = await nextPosition(routeId);
  const { error } = await supabase.from(STOPS_TABLE).insert({ routeId, placeId, position });

  if (error && error.code !== UNIQUE_VIOLATION) {
    throw new Error(`Supabase error (addStopToRoute): ${error.message}`);
  }
  // UNIQUE_VIOLATION means this place is already a stop — treated as success (toggle-on is idempotent).

  await touchRoute(routeId);
  return loadFullRoute({ ...routeRow, updatedAt: new Date().toISOString() });
}

/** Adds a place to the visitor's draft, creating the draft first if needed. */
export async function addStopToDraft(ownerId: string, placeId: string): Promise<Route> {
  const draftId = await getOrCreateDraftRouteId(ownerId);
  return addStopToRoute(draftId, ownerId, placeId);
}

/** Removes a place from an owned route and compacts remaining positions to stay contiguous (1..N). */
export async function removeStopFromRoute(routeId: string, ownerId: string, placeId: string): Promise<Route> {
  const routeRow = await requireOwnedRoute(routeId, ownerId);
  const supabase = getSupabaseClient();

  const { error: delErr } = await supabase.from(STOPS_TABLE).delete().eq('routeId', routeId).eq('placeId', placeId);
  if (delErr) throw new Error(`Supabase error (removeStopFromRoute): ${delErr.message}`);

  await compactPositions(routeId);
  await touchRoute(routeId);
  return loadFullRoute({ ...routeRow, updatedAt: new Date().toISOString() });
}

/** Same as removeStopFromRoute, but a no-op (returns null) if the visitor has no draft at all. */
export async function removeStopFromDraftIfExists(ownerId: string, placeId: string): Promise<Route | null> {
  const draft = await getDraftRouteForOwner(ownerId);
  if (!draft) return null;
  return removeStopFromRoute(draft.id, ownerId, placeId);
}

async function compactPositions(routeId: string): Promise<void> {
  const rows = await findStopRows(routeId);
  const supabase = getSupabaseClient();
  for (let i = 0; i < rows.length; i++) {
    const wantedPosition = i + 1;
    if (rows[i].position !== wantedPosition) {
      await supabase.from(STOPS_TABLE).update({ position: wantedPosition }).eq('id', rows[i].id);
    }
  }
}

/**
 * Reorders an owned route's stops to match orderedPlaceIds exactly.
 * orderedPlaceIds must be a permutation of the route's current stop
 * placeIds — anything else is rejected rather than silently ignored,
 * since it would otherwise let a tampered client request drop or
 * duplicate a stop via "reordering".
 *
 * Positions are written in two passes (negative, then final) because the
 * UNIQUE(routeId, position) constraint would otherwise reject an
 * intermediate state where two rows briefly share a position while
 * being swapped — negative positions never collide with the real
 * (positive) ones or with each other.
 */
export async function reorderRoute(routeId: string, ownerId: string, orderedPlaceIds: string[]): Promise<Route> {
  const routeRow = await requireOwnedRoute(routeId, ownerId);
  const stopRows = await findStopRows(routeId);

  const currentIds = new Set(stopRows.map((s) => s.placeId));
  const requestedIds = new Set(orderedPlaceIds);
  const isSamePermutation =
    orderedPlaceIds.length === stopRows.length &&
    currentIds.size === requestedIds.size &&
    [...currentIds].every((id) => requestedIds.has(id));
  if (!isSamePermutation) {
    throw new Error('reorderRoute: orderedPlaceIds must be a permutation of the route\'s current stops.');
  }

  const supabase = getSupabaseClient();
  const stopByPlaceId = new Map(stopRows.map((s) => [s.placeId, s]));

  for (let i = 0; i < orderedPlaceIds.length; i++) {
    const stop = stopByPlaceId.get(orderedPlaceIds[i])!;
    await supabase.from(STOPS_TABLE).update({ position: -(i + 1) }).eq('id', stop.id);
  }
  for (let i = 0; i < orderedPlaceIds.length; i++) {
    const stop = stopByPlaceId.get(orderedPlaceIds[i])!;
    await supabase.from(STOPS_TABLE).update({ position: i + 1 }).eq('id', stop.id);
  }

  await touchRoute(routeId);
  return loadFullRoute({ ...routeRow, updatedAt: new Date().toISOString() });
}

/** Renames an owned route (draft or saved). */
export async function renameRoute(routeId: string, ownerId: string, name: string): Promise<Route> {
  const routeRow = await requireOwnedRoute(routeId, ownerId);
  const supabase = getSupabaseClient();
  const updatedAt = new Date().toISOString();
  const { error } = await supabase.from(ROUTES_TABLE).update({ name, updatedAt }).eq('id', routeId);
  if (error) throw new Error(`Supabase error (renameRoute): ${error.message}`);
  return loadFullRoute({ ...routeRow, name, updatedAt });
}

/** Converts the visitor's draft into a saved, named route. */
export async function saveDraftRoute(routeId: string, ownerId: string, name: string): Promise<Route> {
  const routeRow = await requireOwnedRoute(routeId, ownerId);
  if (routeRow.status !== 'draft') {
    throw new Error('saveDraftRoute: route is already saved.');
  }
  const supabase = getSupabaseClient();
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from(ROUTES_TABLE)
    .update({ name, status: 'saved' as RouteStatus, updatedAt })
    .eq('id', routeId);
  if (error) throw new Error(`Supabase error (saveDraftRoute): ${error.message}`);
  return loadFullRoute({ ...routeRow, name, status: 'saved', updatedAt });
}

/** Deletes an owned route (and its stops, via ON DELETE CASCADE). */
export async function deleteRoute(routeId: string, ownerId: string): Promise<void> {
  await requireOwnedRoute(routeId, ownerId);
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(ROUTES_TABLE).delete().eq('id', routeId);
  if (error) throw new Error(`Supabase error (deleteRoute): ${error.message}`);
}
