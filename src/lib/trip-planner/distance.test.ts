import { describe, it, expect } from 'vitest';
import { haversineKm, drivingMinutes, walkingMinutes, publicTransitMinutes } from './distance';

// Girne (Kyrenia) harbour to Gazimağusa (Famagusta) old town — real-world
// distance is roughly 100km by road, ~65km as the crow flies.
const GIRNE = { lat: 35.3417, lng: 33.319 };
const GAZIMAGUSA = { lat: 35.1264, lng: 33.9391 };

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    expect(haversineKm(GIRNE, GIRNE)).toBe(0);
  });

  it('returns a plausible great-circle distance between two known towns', () => {
    const km = haversineKm(GIRNE, GAZIMAGUSA);
    expect(km).toBeGreaterThan(55);
    expect(km).toBeLessThan(75);
  });

  it('is symmetric', () => {
    expect(haversineKm(GIRNE, GAZIMAGUSA)).toBeCloseTo(haversineKm(GAZIMAGUSA, GIRNE), 10);
  });
});

describe('travel-time estimators', () => {
  it('orders speeds driving > public transit > walking for the same distance', () => {
    const drive = drivingMinutes(GIRNE, GAZIMAGUSA);
    const transit = publicTransitMinutes(GIRNE, GAZIMAGUSA);
    const walk = walkingMinutes(GIRNE, GAZIMAGUSA);

    expect(drive).toBeLessThan(transit);
    expect(transit).toBeLessThan(walk);
  });

  it('returns 0 minutes for zero distance (plus any fixed transit wait)', () => {
    expect(drivingMinutes(GIRNE, GIRNE)).toBe(0);
    expect(walkingMinutes(GIRNE, GIRNE)).toBe(0);
    expect(publicTransitMinutes(GIRNE, GIRNE)).toBe(15); // fixed wait/transfer buffer
  });
});
