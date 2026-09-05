import { describe, it, expect, vi } from 'vitest';
import { toDomainRoute, toRouteSummary } from './routeMapper';
import { RouteRow, RouteStopRow } from '@/lib/db/routeSchema';
import { PlaceRow } from '@/lib/db/placeSchema';

function makeRouteRow(overrides: Partial<RouteRow> = {}): RouteRow {
  return {
    id: 'r1',
    ownerId: 'owner-1',
    name: 'Girne Macerası',
    status: 'draft',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeStopRow(overrides: Partial<RouteStopRow> = {}): RouteStopRow {
  return {
    id: 'stop-1',
    routeId: 'r1',
    placeId: 'p1',
    position: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makePlaceRow(overrides: Partial<PlaceRow> = {}): PlaceRow {
  return {
    id: 'p1',
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
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as PlaceRow;
}

describe('toDomainRoute', () => {
  it('assembles ordered stops with their place data', () => {
    const route = toDomainRoute(
      makeRouteRow(),
      [
        makeStopRow({ id: 's2', placeId: 'p2', position: 2 }),
        makeStopRow({ id: 's1', placeId: 'p1', position: 1 }),
      ],
      [makePlaceRow({ id: 'p1', slug: 'girne-kalesi' }), makePlaceRow({ id: 'p2', slug: 'bellapais-manastiri' })]
    );

    expect(route.stops.map((s) => s.place.slug)).toEqual(['girne-kalesi', 'bellapais-manastiri']);
    expect(route.stops.map((s) => s.position)).toEqual([1, 2]);
  });

  it('skips a stop whose place row is missing, keeping the rest', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const route = toDomainRoute(
      makeRouteRow(),
      [makeStopRow({ id: 's1', placeId: 'p1', position: 1 }), makeStopRow({ id: 's2', placeId: 'missing', position: 2 })],
      [makePlaceRow({ id: 'p1' })]
    );
    warnSpy.mockRestore();

    expect(route.stops).toHaveLength(1);
    expect(route.stops[0].place.id).toBe('p1');
  });

  it('returns an empty stop list for a route with no stops', () => {
    const route = toDomainRoute(makeRouteRow(), [], []);
    expect(route.stops).toEqual([]);
  });
});

describe('toRouteSummary', () => {
  it('carries the route fields plus a stop count', () => {
    const summary = toRouteSummary(makeRouteRow({ status: 'saved' }), 4);
    expect(summary).toEqual({
      id: 'r1',
      name: 'Girne Macerası',
      status: 'saved',
      stopCount: 4,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });
});
