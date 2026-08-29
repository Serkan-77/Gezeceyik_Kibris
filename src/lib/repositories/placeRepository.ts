// lib/repositories/placeRepository.ts
// Data-access layer over the `places` collection. This is the only module
// in the app that talks to MongoDB in terms of place data — the UI never
// queries MongoDB directly, and src/lib/places.ts (the app's data seam) is
// the only in-app caller of this repository. It's also imported directly by
// the standalone scripts (scripts/*.ts) for seeding/verification/index
// management — see the note in lib/db/mongodb.ts for why the
// Client-Component safety guard lives at lib/places.ts instead of here.
//
// Public read methods (findPublished, findFeatured, findByCategory,
// findByRegion, findBySlugPublished, findBySlugs) only ever return
// published, non-archived documents — exactly what should be visible to
// visitors. Unpublished/archived records are reachable only through the
// internal methods (findAll, findBySlugAny), which nothing in the public
// app currently calls.

import { Collection, Filter } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { Category, Region } from '@/types/place';
import { PlaceDocument, PlaceInput, PlaceUpdate, placeInputSchema, placeUpdateSchema } from '@/lib/db/placeDocument';

const COLLECTION_NAME = 'places';

async function getCollection(): Promise<Collection<PlaceDocument>> {
  const db = await getDb();
  return db.collection<PlaceDocument>(COLLECTION_NAME);
}

/** Filter shared by every public-facing read: visible, non-archived places only. */
const PUBLIC_FILTER: Filter<PlaceDocument> = { published: true, archived: { $ne: true } };

// ─── Public reads ───────────────────────────────────────────────

export async function findPublished(): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection.find(PUBLIC_FILTER).sort({ name: 1 }).toArray();
}

export async function findBySlugPublished(slug: string): Promise<PlaceDocument | null> {
  const collection = await getCollection();
  return collection.findOne({ ...PUBLIC_FILTER, slug });
}

export async function findByCategory(category: Category): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection.find({ ...PUBLIC_FILTER, category }).sort({ name: 1 }).toArray();
}

export async function findByRegion(region: Region): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection.find({ ...PUBLIC_FILTER, region }).sort({ name: 1 }).toArray();
}

export async function findFeatured(): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection.find({ ...PUBLIC_FILTER, featured: true }).sort({ name: 1 }).toArray();
}

/** Look up several places by slug in one query — used for the "nearby places" list. */
export async function findBySlugs(slugs: string[]): Promise<PlaceDocument[]> {
  if (slugs.length === 0) return [];
  const collection = await getCollection();
  return collection.find({ ...PUBLIC_FILTER, slug: { $in: slugs } }).toArray();
}

export async function findAllSlugs(): Promise<string[]> {
  const collection = await getCollection();
  const docs = await collection.find(PUBLIC_FILTER, { projection: { slug: 1 } }).toArray();
  return docs.map((d) => d.slug);
}

export async function findAllCategories(): Promise<Category[]> {
  const collection = await getCollection();
  const values = await collection.distinct('category', PUBLIC_FILTER);
  return (values as Category[]).sort();
}

export async function findAllRegions(): Promise<Region[]> {
  const collection = await getCollection();
  const values = await collection.distinct('region', PUBLIC_FILTER);
  return (values as Region[]).sort();
}

export async function countByRegion(): Promise<Record<string, number>> {
  const collection = await getCollection();
  const rows = await collection
    .aggregate<{ _id: string; count: number }>([
      { $match: PUBLIC_FILTER },
      { $group: { _id: '$region', count: { $sum: 1 } } },
    ])
    .toArray();
  return Object.fromEntries(rows.map((r) => [r._id, r.count]));
}

/**
 * Geospatial "near a point" query, foundation for future nearby/map-radius
 * features. Uses the `location` field's 2dsphere index. Not currently
 * called by any UI — the existing nearby-places feature is slug-list based
 * (findBySlugs) and is left as-is per the current app's behavior.
 */
export async function findNear(
  longitude: number,
  latitude: number,
  maxDistanceMeters: number,
  limit = 10
): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection
    .find({
      ...PUBLIC_FILTER,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: maxDistanceMeters,
        },
      },
    })
    .limit(limit)
    .toArray();
}

// ─── Internal / admin-facing reads (not filtered to published) ─────

export async function findAll(): Promise<PlaceDocument[]> {
  const collection = await getCollection();
  return collection.find({}).sort({ name: 1 }).toArray();
}

export async function findBySlugAny(slug: string): Promise<PlaceDocument | null> {
  const collection = await getCollection();
  return collection.findOne({ slug });
}

// ─── Mutations ──────────────────────────────────────────────────
// Foundation for a future admin interface. Nothing in the current app calls
// these yet — no route handler or server action exposes them publicly.

export async function createPlace(input: PlaceInput): Promise<PlaceDocument> {
  const parsed = placeInputSchema.parse(input);
  const collection = await getCollection();
  const now = new Date();

  const existing = await collection.findOne({ slug: parsed.slug });
  if (existing) {
    throw new Error(`A place with slug "${parsed.slug}" already exists.`);
  }

  const doc = { ...parsed, createdAt: now, updatedAt: now } as Omit<PlaceDocument, '_id'>;
  const result = await collection.insertOne(doc as PlaceDocument);
  return { ...doc, _id: result.insertedId };
}

export async function updatePlace(slug: string, patch: PlaceUpdate): Promise<PlaceDocument | null> {
  const parsed = placeUpdateSchema.parse(patch);
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { slug },
    { $set: { ...parsed, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function publishPlace(slug: string): Promise<PlaceDocument | null> {
  return updatePlace(slug, { published: true });
}

export async function unpublishPlace(slug: string): Promise<PlaceDocument | null> {
  return updatePlace(slug, { published: false });
}

/**
 * Archives a place. This is a soft delete — it flips `archived`/`published`
 * flags rather than removing the document, so archived places can be
 * restored and never disappear from the database outright. There is
 * deliberately no hard-delete operation in this repository yet; that would
 * need explicit, privileged handling later, not a foundation-only pass.
 */
export async function archivePlace(slug: string): Promise<PlaceDocument | null> {
  return updatePlace(slug, { archived: true, published: false });
}
