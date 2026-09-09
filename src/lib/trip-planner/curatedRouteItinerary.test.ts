import { describe, it, expect, vi } from 'vitest';
import { buildCuratedItinerary } from './curatedRouteItinerary';
import { Place } from '@/types/place';
import { CuratedRouteRow } from '@/lib/db/curatedRouteSchema';

function makePlace(overrides: Partial<Place> = {}): Place {
  return {
    id: overrides.slug ?? '1',
    slug: 'place',
    name: 'Place',
    category: 'Castle',
    city: 'Girne',
    region: 'Girne',
    shortDescription: 'A place.',
    description: 'A longer description.',
    image: '/images/place.jpg',
    address: 'Somewhere',
    latitude: 35.341,
    longitude: 33.318,
    featured: false,
    verificationStatus: 'sample',
    estimatedVisitMinutes: 60,
    ...overrides,
  };
}

function makeRoute(overrides: Partial<CuratedRouteRow> = {}): CuratedRouteRow {
  return {
    id: 'route-1',
    slug: 'girne-klasik',
    title: 'Girne Klasik',
    summary: 'Bir günlük klasik Girne turu.',
    coverImage: undefined,
    accommodation: { label: 'Girne hotel', city: 'Girne', region: 'Girne', lat: 35.341, lng: 33.318 },
    transport: 'car',
    days: [['a', 'b']],
    published: true,
    displayOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildCuratedItinerary', () => {
  it('resolves each day’s slugs to real places, in order', () => {
    const places = [makePlace({ slug: 'a', name: 'A' }), makePlace({ slug: 'b', name: 'B' })];
    const itinerary = buildCuratedItinerary(makeRoute(), places, []);

    expect(itinerary.days).toHaveLength(1);
    expect(itinerary.days[0].stops.map((s) => s.place.slug)).toEqual(['a', 'b']);
  });

  it('skips a slug that no longer resolves to a real place, without failing the whole day', () => {
    const places = [makePlace({ slug: 'a', name: 'A' })]; // 'b' is missing
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const itinerary = buildCuratedItinerary(makeRoute(), places, []);
    warnSpy.mockRestore();

    expect(itinerary.days).toHaveLength(1);
    expect(itinerary.days[0].stops.map((s) => s.place.slug)).toEqual(['a']);
  });

  it('drops a day that resolved to zero places and renumbers the rest', () => {
    const places = [makePlace({ slug: 'c', name: 'C' })];
    const route = makeRoute({ days: [['a', 'b'], ['c']] }); // day 1 fully unresolvable
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const itinerary = buildCuratedItinerary(route, places, []);
    warnSpy.mockRestore();

    expect(itinerary.days).toHaveLength(1);
    expect(itinerary.days[0].dayNumber).toBe(1);
    expect(itinerary.days[0].stops[0].place.slug).toBe('c');
  });

  it('carries the route’s accommodation and transport into the synthesized planner input', () => {
    const places = [makePlace({ slug: 'a' })];
    const route = makeRoute({ days: [['a']], transport: 'public' });
    const itinerary = buildCuratedItinerary(route, places, []);

    expect(itinerary.input.transport).toBe('public');
    expect(itinerary.input.accommodation).toEqual(route.accommodation);
    expect(itinerary.input.days).toBe(1);
  });

  it('sums cost/km/duration across all days', () => {
    const places = [
      makePlace({ slug: 'a', admission: { isFree: false, adultPrice: 40 } }),
      makePlace({ slug: 'b', admission: { isFree: true } }),
    ];
    const route = makeRoute({ days: [['a'], ['b']] });
    const itinerary = buildCuratedItinerary(route, places, []);

    expect(itinerary.totalPlaces).toBe(2);
    expect(itinerary.totalCost).toBe(40);
  });
});
