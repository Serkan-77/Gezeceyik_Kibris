'use server';
// app/rotam/actions.ts
// Server Actions behind the manual route builder ("Rotaya ekle" / /rotam /
// /rotam/[id]). Every mutation resolves the caller's identity itself from
// the httpOnly anon cookie (never from a value the client could supply)
// and every route-scoped mutation re-verifies ownership inside
// routeRepository before touching a row — a routeId in a request is never
// trusted just because the browser sent it.
//
// Errors are returned as { error } rather than thrown: Next.js redacts
// thrown Server Action errors to a generic message in production (see
// node_modules/next/dist/docs/.../guides/data-security.md), which would
// hide genuinely useful feedback like "route not found" or "name required".

import { revalidatePath } from 'next/cache';
import { getAnonId, getOrCreateAnonId } from '@/lib/identity/anon';
import * as routeRepository from '@/lib/repositories/routeRepository';
import { routeNameSchema } from '@/lib/db/routeSchema';
import { Route } from '@/types/route';

export interface RouteActionResult {
  route?: Route;
  error?: string;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function revalidateRoutePages(routeId?: string) {
  revalidatePath('/rotam');
  revalidatePath('/gezilerim');
  if (routeId) revalidatePath(`/rotam/${routeId}`);
}

/** Used by AddToTripButton — adds a place to the visitor's current draft, creating it if needed. */
export async function addStopToDraftAction(placeId: string): Promise<RouteActionResult> {
  if (!placeId) return { error: 'Geçersiz yer.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.addStopToDraft(ownerId, placeId);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

/** Used by AddToTripButton's "✓ Rotada" toggle-off. A no-op if there's no draft at all. */
export async function removeStopFromDraftAction(placeId: string): Promise<RouteActionResult> {
  if (!placeId) return { error: 'Geçersiz yer.' };
  try {
    const ownerId = await getAnonId();
    if (!ownerId) return {};
    const route = await routeRepository.removeStopFromDraftIfExists(ownerId, placeId);
    revalidateRoutePages(route?.id);
    return { route: route ?? undefined };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

/** Generic add — used by the "yer ekle" search inside the route builder (draft or a saved route). */
export async function addStopToRouteAction(routeId: string, placeId: string): Promise<RouteActionResult> {
  if (!routeId || !placeId) return { error: 'Geçersiz istek.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.addStopToRoute(routeId, ownerId, placeId);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

/** Generic remove — used by the route builder's per-stop remove control. */
export async function removeStopAction(routeId: string, placeId: string): Promise<RouteActionResult> {
  if (!routeId || !placeId) return { error: 'Geçersiz istek.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.removeStopFromRoute(routeId, ownerId, placeId);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function reorderRouteAction(routeId: string, orderedPlaceIds: string[]): Promise<RouteActionResult> {
  if (!routeId || orderedPlaceIds.length === 0) return { error: 'Geçersiz istek.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.reorderRoute(routeId, ownerId, orderedPlaceIds);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function renameRouteAction(routeId: string, name: string): Promise<RouteActionResult> {
  const parsed = routeNameSchema.safeParse(name);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Geçersiz rota adı.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.renameRoute(routeId, ownerId, parsed.data);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

/** Converts the current draft into a named, saved route (Section 7 — "Rotayı kaydet"). */
export async function saveDraftRouteAction(routeId: string, name: string): Promise<RouteActionResult> {
  const parsed = routeNameSchema.safeParse(name);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Geçersiz rota adı.' };
  try {
    const ownerId = await getOrCreateAnonId();
    const route = await routeRepository.saveDraftRoute(routeId, ownerId, parsed.data);
    revalidateRoutePages(route.id);
    return { route };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function deleteRouteAction(routeId: string): Promise<{ error?: string }> {
  if (!routeId) return { error: 'Geçersiz istek.' };
  try {
    const ownerId = await getOrCreateAnonId();
    await routeRepository.deleteRoute(routeId, ownerId);
    revalidateRoutePages(routeId);
    return {};
  } catch (err) {
    return { error: errorMessage(err) };
  }
}
