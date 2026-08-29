import { describe, it, expect, vi } from 'vitest';
import { ObjectId } from 'mongodb';
import { toDomainPlace, toDomainPlaces, fromDomainPlace, toGeoPoint } from './placeMapper';
import { PlaceDocument } from '@/lib/db/placeDocument';
import { Place } from '@/types/place';

function makeDoc(overrides: Partial<PlaceDocument> = {}): PlaceDocument {
  return {
    _id: new ObjectId(),
    slug: 'girne-kalesi',
    name: 'Girne Kalesi',
    shortDescription: 'A castle.',
    description: 'A longer description.',
    category: 'Castle',
    region: 'Girne',
    city: 'Girne',
    address: 'Girne Harbour',
    location: { type: 'Point', coordinates: [33.318, 35.341] },
    images: { cover: '/images/girne-kalesi.jpg', gallery: [] },
    contact: {},
    featured: false,
    published: true,
    archived: false,
    verificationStatus: 'sample',
    sources: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as PlaceDocument;
}

describe('toGeoPoint', () => {
  it('stores coordinates as [longitude, latitude], not [latitude, longitude]', () => {
    const point = toGeoPoint(35.341, 33.318); // (lat, lng)
    expect(point).toEqual({ type: 'Point', coordinates: [33.318, 35.341] });
  });
});

describe('toDomainPlace', () => {
  it('maps a well-formed document to the domain Place shape', () => {
    const doc = makeDoc();
    const place = toDomainPlace(doc);

    expect(place.slug).toBe('girne-kalesi');
    expect(place.image).toBe('/images/girne-kalesi.jpg');
    // location.coordinates is [lng, lat]; domain Place stores them separately.
    expect(place.longitude).toBe(33.318);
    expect(place.latitude).toBe(35.341);
  });

  it('throws when location is missing', () => {
    const doc = makeDoc({ location: undefined as unknown as PlaceDocument['location'] });
    expect(() => toDomainPlace(doc)).toThrow(/missing required fields/);
  });

  it('throws when images.cover is missing', () => {
    const doc = makeDoc({ images: { cover: '', gallery: [] } });
    expect(() => toDomainPlace(doc)).toThrow(/missing required fields/);
  });
});

describe('toDomainPlaces', () => {
  it('skips malformed documents instead of throwing, keeping well-formed ones', () => {
    const good = makeDoc({ slug: 'good-place' });
    const bad = makeDoc({ slug: 'bad-place', images: { cover: '', gallery: [] } });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = toDomainPlaces([good, bad]);
    warnSpy.mockRestore();

    expect(result.map((p) => p.slug)).toEqual(['good-place']);
  });

  it('returns an empty array for an empty input without throwing', () => {
    expect(toDomainPlaces([])).toEqual([]);
  });
});

describe('fromDomainPlace', () => {
  it('round-trips a domain Place into a valid MongoDB input shape', () => {
    const place: Place = {
      id: '1',
      slug: 'girne-kalesi',
      name: 'Girne Kalesi',
      category: 'Castle',
      city: 'Girne',
      region: 'Girne',
      shortDescription: 'A castle.',
      description: 'A longer description.',
      image: '/images/girne-kalesi.jpg',
      address: 'Girne Harbour',
      latitude: 35.341,
      longitude: 33.318,
      featured: true,
      verificationStatus: 'sample',
    };

    const input = fromDomainPlace(place, { published: true });

    expect(input.slug).toBe('girne-kalesi');
    expect(input.location).toEqual({ type: 'Point', coordinates: [33.318, 35.341] });
    expect(input.images.cover).toBe('/images/girne-kalesi.jpg');
    expect(input.published).toBe(true);
    expect(input.archived).toBe(false);
  });
});
