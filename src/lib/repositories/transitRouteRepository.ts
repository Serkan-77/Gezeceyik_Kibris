// lib/repositories/transitRouteRepository.ts
// Data-access layer over the `transitRoutes` table — the transit-route
// equivalent of placeRepository.ts.

import { getSupabaseClient } from '@/lib/db/supabase';
import {
  TransitRouteRow,
  TransitRouteInput,
  TransitRouteUpdate,
  transitRouteInputSchema,
  transitRouteUpdateSchema,
} from '@/lib/db/transitRouteSchema';

const TABLE = 'transitRoutes';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unwrap<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`Supabase error (${context}): ${error.message}`);
  return data as T;
}

// ─── Public reads ───────────────────────────────────────────────

/** Routes the trip planner is allowed to use — excludes anything toggled off in admin. */
export async function findActive(): Promise<TransitRouteRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('active', true)
    .order('fromRegion')
    .order('toRegion');
  return unwrap(data, error, 'findActive') ?? [];
}

// ─── Admin reads ────────────────────────────────────────────────

export async function findAll(): Promise<TransitRouteRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').order('fromRegion').order('toRegion');
  return unwrap(data, error, 'findAll') ?? [];
}

export async function findById(id: string): Promise<TransitRouteRow | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  return unwrap(data, error, 'findById');
}

// ─── Mutations ──────────────────────────────────────────────────

export async function createRoute(input: TransitRouteInput): Promise<TransitRouteRow> {
  const parsed = transitRouteInputSchema.parse(input);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).insert(parsed).select('*').single();
  return unwrap(data, error, 'createRoute');
}

export async function updateRoute(id: string, patch: TransitRouteUpdate): Promise<TransitRouteRow | null> {
  if (!UUID_RE.test(id)) return null;
  const parsed = transitRouteUpdateSchema.parse(patch);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...parsed, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  return unwrap(data, error, 'updateRoute');
}

export async function setActive(id: string, active: boolean): Promise<TransitRouteRow | null> {
  return updateRoute(id, { active });
}

/**
 * Hard delete. Unlike places, a transit route has no public URL pointing at
 * it and nothing else references it by id, so there's no orphaned-link risk
 * — removing a wrong/duplicate entry outright is the expected admin action.
 * Use setActive(id, false) instead when the goal is "hide, don't remove".
 */
export async function deleteRoute(id: string): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const supabase = getSupabaseClient();
  const { error, count } = await supabase.from(TABLE).delete({ count: 'exact' }).eq('id', id);
  if (error) throw new Error(`Supabase error (deleteRoute): ${error.message}`);
  return (count ?? 0) > 0;
}
