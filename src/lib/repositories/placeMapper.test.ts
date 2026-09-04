import { describe, it, expect, vi } from 'vitest';
import { toDomainPlace, toDomainPlaces, fromDomainPlace } from './placeMapper';
import { PlaceRow } from '@/lib/db/placeSchema';
import { Place } from '@/types/place';

function makeRow(overrides: Partial<PlaceRow> = {}): PlaceRow {
  return {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'girne-kalesi',
    name: 'Girne Kalesi',
    shortDescription: 'A castle.',
    description: 'A longer description.',
    category: 'Castle',
    region: 'Girne',
    city: 'Girne',
    address: 'Girne Harbour',
    latitude: 35.341,
    longitude: 33.318,
    image: '/images/girne-kalesi.jpg',
    gallery: [],
    featured: false,
    published: true,
    archived: false,
    verificationStatus: 'sample',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as PlaceRow;
}

describe('toDomainPlace', () => {
  it('maps a well-formed row to the domain Place shape', () => {
    const row = makeRow();
    const place = toDomainPlace(row);

    expect(place.slug).toBe('girne-kalesi');
    expect(place.image).toBe('/images/girne-kalesi.jpg');
    expect(place.latitude).toBe(35.341);
    expect(place.longitude).toBe(33.318);
  });

  it('throws when latitude/longitude is missing', () => {
    const row = makeRow({ latitude: undefined as unknown as number });
    expect(() => toDomainPlace(row)).toThrow(/missing required fields/);
  });

  it('throws when image is missing', () => {
    const row = makeRow({ image: '' });
    expect(() => toDomainPlace(row)).toThrow(/missing required fields/);
  });
});

describe('toDomainPlaces', () => {
  it('skips malformed rows instead of throwing, keeping well-formed ones', () => {
    const good = makeRow({ slug: 'good-place' });
    const bad = makeRow({ slug: 'bad-place', image: '' });

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
  it('round-trips a domain Place into a valid Supabase input shape', () => {
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
    expect(input.latitude).toBe(35.341);
    expect(input.longitude).toBe(33.318);
    expect(input.image).toBe('/images/girne-kalesi.jpg');
    expect(input.published).toBe(true);
    expect(input.archived).toBe(false);
  });
});
