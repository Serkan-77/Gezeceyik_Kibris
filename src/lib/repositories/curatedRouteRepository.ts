// lib/repositories/curatedRouteRepository.ts
// Data-access layer over the `curatedRoutes` table — mirrors
// transitRouteRepository.ts.

import { getSupabaseClient } from '@/lib/db/supabase';
import {
  CuratedRouteRow,
  CuratedRouteInput,
  CuratedRouteUpdate,
  curatedRouteInputSchema,
  curatedRouteUpdateSchema,
} from '@/lib/db/curatedRouteSchema';

const TABLE = 'curatedRoutes';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unwrap<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`Supabase error (${context}): ${error.message}`);
  return data as T;
}

// ─── Public reads ───────────────────────────────────────────────

/** Routes the homepage/`/rotalar` are allowed to show — excludes drafts. */
export async function findPublished(): Promise<CuratedRouteRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .order('displayOrder')
    .order('createdAt');
  return unwrap(data, error, 'findPublished') ?? [];
}

export async function findBySlugPublished(slug: string): Promise<CuratedRouteRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('slug', slug).eq('published', true).maybeSingle();
  return unwrap(data, error, 'findBySlugPublished');
}

// ─── Admin reads ────────────────────────────────────────────────

export async function findAll(): Promise<CuratedRouteRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').order('displayOrder').order('createdAt');
  return unwrap(data, error, 'findAll') ?? [];
}

export async function findById(id: string): Promise<CuratedRouteRow | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  return unwrap(data, error, 'findById');
}

// ─── Mutations ──────────────────────────────────────────────────

export async function createRoute(input: CuratedRouteInput): Promise<CuratedRouteRow> {
  const parsed = curatedRouteInputSchema.parse(input);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).insert(parsed).select('*').single();
  return unwrap(data, error, 'createRoute');
}

export async function updateRoute(id: string, patch: CuratedRouteUpdate): Promise<CuratedRouteRow | null> {
  if (!UUID_RE.test(id)) return null;
  const parsed = curatedRouteUpdateSchema.parse(patch);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...parsed, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  return unwrap(data, error, 'updateRoute');
}

export async function setPublished(id: string, published: boolean): Promise<CuratedRouteRow | null> {
  return updateRoute(id, { published });
}

/** Hard delete — a wrong/duplicate curated route can just be removed outright. */
export async function deleteRoute(id: string): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const supabase = getSupabaseClient();
  const { error, count } = await supabase.from(TABLE).delete({ count: 'exact' }).eq('id', id);
  if (error) throw new Error(`Supabase error (deleteRoute): ${error.message}`);
  return (count ?? 0) > 0;
}
