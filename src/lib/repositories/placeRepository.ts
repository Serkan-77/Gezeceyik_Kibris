// lib/repositories/placeRepository.ts
// Data-access layer over the `places` table (Supabase/Postgres). This is
// the only module in the app that talks to Supabase in terms of place
// data — the UI never queries it directly, and src/lib/places.ts (the
// app's data seam) is the only in-app caller of this repository. It's
// also imported directly by the standalone scripts (scripts/*.ts) for
// seeding/verification — see the note in lib/db/supabase.ts for why the
// Client-Component safety guard lives at lib/places.ts instead of here.
//
// Public read methods (findPublished, findFeatured, findByCategory,
// findByRegion, findBySlugPublished, findBySlugs) only ever return
// published, non-archived rows — exactly what should be visible to
// visitors. Unpublished/archived records are reachable only through the
// internal methods (findAll, findBySlugAny), which nothing in the public
// app currently calls.

import { getSupabaseClient } from '@/lib/db/supabase';
import { haversineKm } from '@/lib/trip-planner/distance';
import { Category, Region } from '@/types/place';
import { PlaceRow, PlaceInput, PlaceUpdate, placeInputSchema, placeUpdateSchema } from '@/lib/db/placeSchema';

const TABLE = 'places';

function unwrap<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`Supabase error (${context}): ${error.message}`);
  return data as T;
}

// ─── Public reads ───────────────────────────────────────────────

export async function findPublished(): Promise<PlaceRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .order('name');
  return unwrap(data, error, 'findPublished') ?? [];
}

export async function findBySlugPublished(slug: string): Promise<PlaceRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .eq('slug', slug)
    .maybeSingle();
  return unwrap(data, error, 'findBySlugPublished');
}

export async function findByCategory(category: Category): Promise<PlaceRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .eq('category', category)
    .order('name');
  return unwrap(data, error, 'findByCategory') ?? [];
}

export async function findByRegion(region: Region): Promise<PlaceRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .eq('region', region)
    .order('name');
  return unwrap(data, error, 'findByRegion') ?? [];
}

export async function findFeatured(): Promise<PlaceRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .eq('featured', true)
    .order('name');
  return unwrap(data, error, 'findFeatured') ?? [];
}

/** Look up several places by slug in one query — used for the "nearby places" list. */
export async function findBySlugs(slugs: string[]): Promise<PlaceRow[]> {
  if (slugs.length === 0) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .eq('archived', false)
    .in('slug', slugs);
  return unwrap(data, error, 'findBySlugs') ?? [];
}

export async function findAllSlugs(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('slug').eq('published', true).eq('archived', false);
  const rows = unwrap(data, error, 'findAllSlugs') ?? [];
  return rows.map((r) => r.slug as string);
}

/** Slug + the row's real updatedAt — used by the sitemap for an honest per-URL lastModified (never a fabricated build-time date). */
export async function findAllSlugsWithUpdatedAt(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('slug, updatedAt')
    .eq('published', true)
    .eq('archived', false);
  return unwrap(data, error, 'findAllSlugsWithUpdatedAt') ?? [];
}

export async function findAllCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('category').eq('published', true).eq('archived', false);
  const rows = unwrap(data, error, 'findAllCategories') ?? [];
  return [...new Set(rows.map((r) => r.category as Category))].sort();
}

export async function findAllRegions(): Promise<Region[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('region').eq('published', true).eq('archived', false);
  const rows = unwrap(data, error, 'findAllRegions') ?? [];
  return [...new Set(rows.map((r) => r.region as Region))].sort();
}

export async function countByRegion(): Promise<Record<string, number>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('region').eq('published', true).eq('archived', false);
  const rows = unwrap(data, error, 'countByRegion') ?? [];
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.region as string] = (counts[r.region as string] ?? 0) + 1;
  return counts;
}

export async function countByCategory(): Promise<Record<string, number>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('category').eq('published', true).eq('archived', false);
  const rows = unwrap(data, error, 'countByCategory') ?? [];
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.category as string] = (counts[r.category as string] ?? 0) + 1;
  return counts;
}

/**
 * "Near a point" lookup, foundation for future nearby/map-radius features.
 * Not currently called by any UI — the existing nearby-places feature is
 * slug-list based (findBySlugs) and is left as-is per the current app's
 * behavior. Filters/sorts in application code using the same haversine
 * helper the trip planner already uses, rather than requiring the PostGIS
 * extension for a feature nothing calls yet.
 */
export async function findNear(
  longitude: number,
  latitude: number,
  maxDistanceMeters: number,
  limit = 10
): Promise<PlaceRow[]> {
  const rows = await findPublished();
  const maxKm = maxDistanceMeters / 1000;
  return rows
    .map((row) => ({ row, km: haversineKm({ lat: latitude, lng: longitude }, { lat: row.latitude, lng: row.longitude }) }))
    .filter((x) => x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map((x) => x.row);
}

// ─── Internal / admin-facing reads (not filtered to published) ─────

export async function findAll(): Promise<PlaceRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  return unwrap(data, error, 'findAll') ?? [];
}

export async function findBySlugAny(slug: string): Promise<PlaceRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('slug', slug).maybeSingle();
  return unwrap(data, error, 'findBySlugAny');
}

/**
 * Look up several places by id, regardless of published/archived state.
 * Used by routeRepository to resolve a route's stops — a stop should
 * keep showing the place it points to even if that place is later
 * unpublished, rather than silently vanishing from a saved route.
 */
export async function findByIdsAny(ids: string[]): Promise<PlaceRow[]> {
  if (ids.length === 0) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').in('id', ids);
  return unwrap(data, error, 'findByIdsAny') ?? [];
}

/** Confirms a place id exists (and is published) before it's added to a route. */
export async function existsPublishedId(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('id')
    .eq('id', id)
    .eq('published', true)
    .eq('archived', false)
    .maybeSingle();
  return unwrap(data, error, 'existsPublishedId') !== null;
}

// ─── Mutations ──────────────────────────────────────────────────

export async function createPlace(input: PlaceInput): Promise<PlaceRow> {
  const parsed = placeInputSchema.parse(input);
  const supabase = getSupabaseClient();

  const { data: existing } = await supabase.from(TABLE).select('id').eq('slug', parsed.slug).maybeSingle();
  if (existing) {
    throw new Error(`A place with slug "${parsed.slug}" already exists.`);
  }

  const { data, error } = await supabase.from(TABLE).insert(parsed).select('*').single();
  return unwrap(data, error, 'createPlace');
}

export async function updatePlace(slug: string, patch: PlaceUpdate): Promise<PlaceRow | null> {
  const parsed = placeUpdateSchema.parse(patch);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...parsed, updatedAt: new Date().toISOString() })
    .eq('slug', slug)
    .select('*')
    .maybeSingle();
  return unwrap(data, error, 'updatePlace');
}

export async function publishPlace(slug: string): Promise<PlaceRow | null> {
  return updatePlace(slug, { published: true });
}

export async function unpublishPlace(slug: string): Promise<PlaceRow | null> {
  return updatePlace(slug, { published: false });
}

/**
 * Archives a place. This is a soft delete — it flips `archived`/`published`
 * flags rather than removing the row, so archived places can be restored
 * and never disappear from the database outright. There is deliberately no
 * hard-delete operation in this repository yet; that would need explicit,
 * privileged handling later, not a foundation-only pass.
 */
export async function archivePlace(slug: string): Promise<PlaceRow | null> {
  return updatePlace(slug, { archived: true, published: false });
}
