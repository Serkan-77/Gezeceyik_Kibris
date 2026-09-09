import { describe, it, expect } from 'vitest';
import { scheduleDay } from './scheduleDay';
import { Place } from '@/types/place';
import { AccommodationLocation } from './types';
import { BusRoute } from '@/types/transit';

function makePlace(overrides: Partial<Place> = {}): Place {
  return {
    id: '1',
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
    estimatedVisitMinutes: 90,
    ...overrides,
  };
}

const GIRNE_ACCOMMODATION: AccommodationLocation = {
  lat: 35.341,
  lng: 33.318,
  label: 'Girne hotel',
  city: 'Girne',
  region: 'Girne',
};

function makeBusRoute(overrides: Partial<BusRoute> = {}): BusRoute {
  return {
    id: 'girne-magusa',
    operator: 'Test Otobüs',
    fromRegion: 'Girne',
    toRegion: 'Gazimağusa',
    fromStop: { name: 'Girne Terminali', city: 'Girne' },
    toStop: { name: 'Mağusa Terminali', city: 'Gazimağusa' },
    durationMinutes: 75,
    fareTRY: 300,
    schedule: { type: 'fixed', times: ['09:00', '12:00', '15:00'] },
    phone: ['+90 000 000 00 00'],
    sourceUrl: 'https://example.com',
    lastVerifiedAt: '2026-01-01',
    verificationStatus: 'unverified',
    ...overrides,
  };
}

describe('scheduleDay', () => {
  it('starts the first stop at 09:00 when the day stays in the accommodation region', () => {
    const day = scheduleDay([makePlace()], 1, 'car', GIRNE_ACCOMMODATION);
    expect(day.stops[0].arrivalTime).toBe('09:00');
    expect(day.startTravel).toBeUndefined();
    expect(day.endTravel).toBeUndefined();
  });

  it('advances arrival/departure times by the visit duration for co-located stops', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' })];
    const day = scheduleDay(places, 1, 'car', GIRNE_ACCOMMODATION);

    expect(day.stops[0].departureTime).toBe('10:30'); // 09:00 + 90min
    expect(day.stops[1].arrivalTime).toBe('10:30'); // no travel time, same coordinates
  });

  it('inserts a one-hour lunch break once the schedule reaches midday', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' }), makePlace({ slug: 'c' })];
    const day = scheduleDay(places, 1, 'car', GIRNE_ACCOMMODATION);

    // Stop 3 would naturally arrive at 12:00; lunch pushes it to 13:00.
    expect(day.stops[2].arrivalTime).toBe('13:00');
  });

  it('sums admission costs across stops, treating free places as zero', () => {
    const places = [
      makePlace({ slug: 'paid', admission: { isFree: false, adultPrice: 40 } }),
      makePlace({ slug: 'free', admission: { isFree: true } }),
    ];
    const day = scheduleDay(places, 1, 'car', GIRNE_ACCOMMODATION);
    expect(day.totalCost).toBe(40);
  });

  it('accumulates zero travel distance/time for stops at the same coordinates', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' })];
    const day = scheduleDay(places, 1, 'car', GIRNE_ACCOMMODATION);
    expect(day.totalKm).toBe(0);
    expect(day.totalTravelMin).toBe(0);
  });

  it('carries the given day number through and derives region/regions from the stops', () => {
    const place = makePlace({ region: 'Gazimağusa', city: 'Gazimağusa' });
    const day = scheduleDay([place], 2, 'walking', { ...GIRNE_ACCOMMODATION, region: 'Gazimağusa' });
    expect(day.dayNumber).toBe(2);
    expect(day.region).toBe('Gazimağusa');
    expect(day.regions).toEqual(['Gazimağusa']);
  });

  describe('cross-region days (first/last stop outside the accommodation region)', () => {
    const FAR_STOP = makePlace({ slug: 'far', region: 'Gazimağusa', city: 'Gazimağusa', latitude: 35.126, longitude: 33.942 });

    it('models a real morning bus departure when transport is public and a route covers the pair', () => {
      const day = scheduleDay([FAR_STOP], 2, 'public', GIRNE_ACCOMMODATION, [makeBusRoute()]);

      expect(day.startTravel).toBeDefined();
      expect(day.startTravel!.transitDetail).toBeDefined();
      expect(day.startTravel!.transitDetail!.operator).toBe('Test Otobüs');
      // Ready to leave at 08:00, walk 10min to the terminal (08:10) → next fixed departure is 09:00.
      expect(day.startTravel!.transitDetail!.departureTime).toBe('09:00');
      // 08:00 + (10 walk + 50 wait + 75 ride + 10 walk) = 08:00 + 145min = 10:25.
      expect(day.stops[0].arrivalTime).toBe('10:25');
    });

    it('falls back to a generic estimate when transport is public but no route covers the region pair', () => {
      const day = scheduleDay([FAR_STOP], 1, 'public', GIRNE_ACCOMMODATION, []);
      expect(day.startTravel).toBeDefined();
      expect(day.startTravel!.transitDetail).toBeUndefined();
      expect(day.startTravel!.travelMin).toBeGreaterThan(0);
    });

    it('models a generic drive/walk estimate — never a real bus — when transport is not public', () => {
      const day = scheduleDay([FAR_STOP], 1, 'car', GIRNE_ACCOMMODATION, [makeBusRoute()]);
      expect(day.startTravel).toBeDefined();
      expect(day.startTravel!.transitDetail).toBeUndefined();
    });

    it('models a real return bus leg when the last stop is outside the accommodation region', () => {
      const returnRoute = makeBusRoute({
        id: 'magusa-girne',
        fromRegion: 'Gazimağusa',
        toRegion: 'Girne',
        fromStop: { name: 'Mağusa Terminali', city: 'Gazimağusa' },
        toStop: { name: 'Girne Terminali', city: 'Girne' },
        schedule: { type: 'fixed', times: ['18:00'] },
      });
      const day = scheduleDay([FAR_STOP], 1, 'public', GIRNE_ACCOMMODATION, [returnRoute]);

      expect(day.endTravel).toBeDefined();
      expect(day.endTravel!.transitDetail?.operator).toBe('Test Otobüs');
      expect(day.endTravel!.transitDetail?.departureTime).toBe('18:00');
    });

    it('does not model start/end legs when the day stays within the accommodation region', () => {
      const day = scheduleDay([makePlace()], 1, 'public', GIRNE_ACCOMMODATION, [makeBusRoute()]);
      expect(day.startTravel).toBeUndefined();
      expect(day.endTravel).toBeUndefined();
    });
  });
});
