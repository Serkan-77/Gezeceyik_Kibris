import { describe, it, expect } from 'vitest';
import { findBestTransitLeg } from './transitSchedule';
import { transitRoutes } from '@/data/transitRoutes';

describe('findBestTransitLeg', () => {
  it('finds the next departure after the given time, picking the earliest across operators', () => {
    // Lefkoşa → Gazimağusa has İtimat (hourly) and Gece (every 30 min); at
    // 10:20 Gece's 10:30 departure beats İtimat's 11:00.
    const leg = findBestTransitLeg(transitRoutes, 'Lefkoşa', 'Gazimağusa', 10 * 60 + 20); // 10:20
    expect(leg).not.toBeNull();
    expect(leg!.departureTime).toBe('10:30');
    expect(leg!.waitMinutes).toBe(10);
  });

  it('finds the next fixed-time departure at or after the given time', () => {
    // Çimen Güzelyurt → Girne has fixed departures including 12:30 and 14:30.
    const leg = findBestTransitLeg(transitRoutes, 'Güzelyurt', 'Girne', 13 * 60); // 13:00
    expect(leg).not.toBeNull();
    expect(leg!.departureTime).toBe('14:30');
  });

  it('returns null once the last departure of the day has passed', () => {
    // Akva Lefke → Lefkoşa only runs at 06:30 and 12:30.
    const leg = findBestTransitLeg(transitRoutes, 'Lefke', 'Lefkoşa', 13 * 60);
    expect(leg).toBeNull();
  });

  it('falls back to an unpublished-schedule route without inventing a departure time', () => {
    // VirgoBus Lefkoşa ↔ Girne has no published timetable.
    const leg = findBestTransitLeg(transitRoutes, 'Lefkoşa', 'Girne', 9 * 60);
    expect(leg).not.toBeNull();
    expect(leg!.departureTime).toBeUndefined();
    expect(leg!.route.operator).toBe('VirgoBus');
    expect(leg!.rideMinutes).toBeGreaterThan(0);
  });

  it('returns null for a region pair with no route data', () => {
    const leg = findBestTransitLeg(transitRoutes, 'Girne', 'Lefke', 9 * 60);
    expect(leg).toBeNull();
  });

  it('returns null when given an empty route list', () => {
    const leg = findBestTransitLeg([], 'Lefkoşa', 'Gazimağusa', 9 * 60);
    expect(leg).toBeNull();
  });
});
