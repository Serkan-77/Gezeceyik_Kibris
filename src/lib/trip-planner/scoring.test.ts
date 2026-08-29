import { describe, it, expect } from 'vitest';
import { scorePlaceForInput } from './scoring';
import { Place } from '@/types/place';
import { PlannerInput } from './types';

function makePlace(overrides: Partial<Place> = {}): Place {
  return {
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
    featured: false,
    verificationStatus: 'sample',
    ...overrides,
  };
}

function makeInput(overrides: Partial<PlannerInput> = {}): PlannerInput {
  return {
    accommodation: { lat: 35.341, lng: 33.318, label: 'Girne hotel', city: 'Girne' },
    days: 3,
    transport: 'car',
    pace: 'balanced',
    preferredCategories: [],
    onlyFree: false,
    mustVisitSlugs: [],
    ...overrides,
  };
}

describe('scorePlaceForInput', () => {
  it('gives a neutral base score with no preferences and no accommodation bonus applicable', () => {
    const place = makePlace({ latitude: undefined as unknown as number, longitude: undefined as unknown as number });
    const score = scorePlaceForInput(place, makeInput());
    expect(score).toBe(50);
  });

  it('rewards matching a preferred category and penalises a non-matching one', () => {
    const place = makePlace({ category: 'Castle', latitude: undefined as unknown as number });
    const matching = scorePlaceForInput(place, makeInput({ preferredCategories: ['Castle'] }));
    const nonMatching = scorePlaceForInput(place, makeInput({ preferredCategories: ['Beach'] }));
    expect(matching).toBeGreaterThan(nonMatching);
  });

  it('effectively excludes paid places when onlyFree is set', () => {
    const place = makePlace({ admission: { isFree: false, adultPrice: 50 } });
    const score = scorePlaceForInput(place, makeInput({ onlyFree: true }));
    expect(score).toBe(0); // clamped at 0, never negative
  });

  it('guarantees a high score for must-visit places even if otherwise undesirable', () => {
    const place = makePlace({ slug: 'must-see', category: 'Beach' });
    const score = scorePlaceForInput(
      place,
      makeInput({ preferredCategories: ['Castle'], mustVisitSlugs: ['must-see'] })
    );
    expect(score).toBeGreaterThanOrEqual(100);
  });

  it('never returns a negative score', () => {
    const place = makePlace({ category: 'Beach', admission: { isFree: false, adultPrice: 50 } });
    const score = scorePlaceForInput(
      place,
      makeInput({ preferredCategories: ['Castle'], onlyFree: true })
    );
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('gives a small bonus to featured places', () => {
    const notFeatured = makePlace({ featured: false, latitude: undefined as unknown as number });
    const featured = makePlace({ featured: true, latitude: undefined as unknown as number });
    const input = makeInput();
    expect(scorePlaceForInput(featured, input)).toBeGreaterThan(scorePlaceForInput(notFeatured, input));
  });

  it('excludes a place beyond walking range even when accommodation is in a different city', () => {
    // ~65km apart (Girne vs Gazimağusa) — walkable range is a few km.
    const farPlace = makePlace({ latitude: 35.1264, longitude: 33.9391 });
    const score = scorePlaceForInput(farPlace, makeInput({ transport: 'walking' }));
    expect(score).toBe(0);
  });

  it('does not exclude the same distant place for car or public transport', () => {
    const farPlace = makePlace({ latitude: 35.1264, longitude: 33.9391 });
    expect(scorePlaceForInput(farPlace, makeInput({ transport: 'car' }))).toBeGreaterThan(0);
    expect(scorePlaceForInput(farPlace, makeInput({ transport: 'public' }))).toBeGreaterThan(0);
  });

  it('keeps a nearby place scorable in walking mode', () => {
    // ~1.5km from accommodation — comfortably walkable.
    const nearPlace = makePlace({ latitude: 35.35, longitude: 33.318 });
    const score = scorePlaceForInput(nearPlace, makeInput({ transport: 'walking' }));
    expect(score).toBeGreaterThan(0);
  });

  it('excludes an unreachable-by-foot place even if marked must-visit', () => {
    const farPlace = makePlace({ slug: 'far-must-see', latitude: 35.1264, longitude: 33.9391 });
    const score = scorePlaceForInput(
      farPlace,
      makeInput({ transport: 'walking', mustVisitSlugs: ['far-must-see'] })
    );
    expect(score).toBe(0);
  });
});
