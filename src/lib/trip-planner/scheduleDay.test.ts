import { describe, it, expect } from 'vitest';
import { scheduleDay } from './scheduleDay';
import { Place } from '@/types/place';

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

describe('scheduleDay', () => {
  it('starts the first stop at 09:00', () => {
    const day = scheduleDay([makePlace()], 1, 'car', 'Girne');
    expect(day.stops[0].arrivalTime).toBe('09:00');
  });

  it('advances arrival/departure times by the visit duration for co-located stops', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' })];
    const day = scheduleDay(places, 1, 'car', 'Girne');

    expect(day.stops[0].departureTime).toBe('10:30'); // 09:00 + 90min
    expect(day.stops[1].arrivalTime).toBe('10:30'); // no travel time, same coordinates
  });

  it('inserts a one-hour lunch break once the schedule reaches midday', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' }), makePlace({ slug: 'c' })];
    const day = scheduleDay(places, 1, 'car', 'Girne');

    // Stop 3 would naturally arrive at 12:00; lunch pushes it to 13:00.
    expect(day.stops[2].arrivalTime).toBe('13:00');
  });

  it('sums admission costs across stops, treating free places as zero', () => {
    const places = [
      makePlace({ slug: 'paid', admission: { isFree: false, adultPrice: 40 } }),
      makePlace({ slug: 'free', admission: { isFree: true } }),
    ];
    const day = scheduleDay(places, 1, 'car', 'Girne');
    expect(day.totalCost).toBe(40);
  });

  it('accumulates zero travel distance/time for stops at the same coordinates', () => {
    const places = [makePlace({ slug: 'a' }), makePlace({ slug: 'b' })];
    const day = scheduleDay(places, 1, 'car', 'Girne');
    expect(day.totalKm).toBe(0);
    expect(day.totalTravelMin).toBe(0);
  });

  it('carries the given day number and region through', () => {
    const day = scheduleDay([makePlace()], 2, 'walking', 'Gazimağusa');
    expect(day.dayNumber).toBe(2);
    expect(day.region).toBe('Gazimağusa');
  });
});
