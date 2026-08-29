// lib/repositories/placeMapper.ts
// Converts between the MongoDB persistence shape (PlaceDocument, in
// src/lib/db/placeDocument.ts) and the application's domain shape (Place,
// in src/types/place.ts). This is the one place that needs to know both
// shapes — every UI component only ever sees the domain `Place` type,
// exactly as it did before MongoDB existed in this project.

import { Place } from '@/types/place';
import { PlaceDocument, PlaceInput, GeoPoint } from '@/lib/db/placeDocument';

/**
 * Builds a GeoJSON Point from separate lat/lng numbers.
 * MongoDB requires [longitude, latitude] order — the reverse of how this
 * app's domain type and most humans write coordinates ("lat, then lng").
 * Getting this backwards silently plots points in the wrong place on the
 * globe and breaks any $near/$geoWithin query, without ever throwing.
 */
export function toGeoPoint(latitude: number, longitude: number): GeoPoint {
  return { type: 'Point', coordinates: [longitude, latitude] };
}

/** Converts a MongoDB place document into the domain `Place` shape the UI expects. */
export function toDomainPlace(doc: PlaceDocument): Place {
  if (!doc.location?.coordinates || !doc.images?.cover) {
    throw new Error(
      `Place document "${doc.slug ?? doc._id}" is missing required fields (location and/or images.cover) — cannot map to the domain Place shape.`
    );
  }

  const [longitude, latitude] = doc.location.coordinates;

  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    city: doc.city,
    region: doc.region,
    shortDescription: doc.shortDescription,
    description: doc.description,
    history: doc.history,
    image: doc.images.cover,
    gallery: doc.images.gallery,
    openingHours: doc.openingHours,
    admission: doc.entranceFee,
    phone: doc.contact?.phone,
    website: doc.contact?.website,
    address: doc.address,
    latitude,
    longitude,
    accessibility: doc.accessibility,
    estimatedVisitMinutes: doc.visitDuration,
    featured: doc.featured,
    nearbyPlaceSlugs: doc.nearbyPlaceSlugs,
    sourceUrl: doc.sources?.[0],
    lastVerifiedAt: doc.lastVerifiedAt,
    verificationStatus: doc.verificationStatus,
  };
}

/**
 * Maps a list of documents, skipping (and warning about) any single
 * document that fails to map instead of letting one malformed record take
 * down an entire listing page.
 */
export function toDomainPlaces(docs: PlaceDocument[]): Place[] {
  const results: Place[] = [];
  for (const doc of docs) {
    try {
      results.push(toDomainPlace(doc));
    } catch (err) {
      console.warn(
        `[placeMapper] Skipping malformed place document "${doc.slug ?? doc._id}": ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }
  return results;
}

/**
 * Converts a domain `Place` (the shape used by src/data/places.ts and the
 * rest of the app) into the MongoDB write shape. Used by the seed script to
 * migrate the local dataset into the `places` collection — the inverse of
 * toDomainPlace, field for field.
 */
export function fromDomainPlace(place: Place, options: { published: boolean }): PlaceInput {
  return {
    slug: place.slug,
    name: place.name,
    shortDescription: place.shortDescription,
    description: place.description,
    history: place.history,
    category: place.category,
    region: place.region,
    city: place.city,
    address: place.address,
    location: toGeoPoint(place.latitude, place.longitude),
    images: { cover: place.image, gallery: place.gallery ?? [] },
    openingHours: place.openingHours,
    entranceFee: place.admission,
    contact: { phone: place.phone, website: place.website },
    visitDuration: place.estimatedVisitMinutes,
    accessibility: place.accessibility,
    nearbyPlaceSlugs: place.nearbyPlaceSlugs,
    featured: place.featured,
    published: options.published,
    archived: false,
    verificationStatus: place.verificationStatus,
    sources: place.sourceUrl ? [place.sourceUrl] : [],
    lastVerifiedAt: place.lastVerifiedAt,
  };
}
