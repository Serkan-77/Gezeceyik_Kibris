import { describe, it, expect } from 'vitest';
import { generateItinerary } from './planner';
import { Place } from '@/types/place';
import { PlannerInput } from './types';

const ACCOMMODATION = { lat: 35.341, lng: 33.318, label: 'Girne hotel', city: 'Girne' };

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
    latitude: ACCOMMODATION.lat,
    longitude: ACCOMMODATION.lng,
    featured: false,
    verificationStatus: 'sample',
    estimatedVisitMinutes: 60,
    ...overrides,
  };
}

function makeInput(overrides: Partial<PlannerInput> = {}): PlannerInput {
  return {
    accommodation: ACCOMMODATION,
    days: 1,
    transport: 'car',
    pace: 'relaxed', // 2 places/day
    preferredCategories: [],
    onlyFree: false,
    mustVisitSlugs: [],
    ...overrides,
  };
}

describe('generateItinerary', () => {
  it('selects exactly days * placesPerDay(pace) places when enough candidates exist', () => {
    const places = ['a', 'b', 'c', 'd'].map((slug) => makePlace({ slug }));
    const itinerary = generateItinerary(makeInput({ days: 1, pace: 'relaxed' }), places);

    expect(itinerary.totalPlaces).toBe(2); // relaxed = 2/day, 1 day
    expect(itinerary.days).toHaveLength(1);
  });

  it('always includes must-visit places even when other candidates would otherwise be chosen', () => {
    const mustSee = makePlace({ slug: 'must-see', category: 'Beach' });
    const others = ['a', 'b', 'c'].map((slug) => makePlace({ slug, category: 'Castle' }));
    const input = makeInput({ days: 1, pace: 'relaxed', mustVisitSlugs: ['must-see'] });

    const itinerary = generateItinerary(input, [mustSee, ...others]);
    const selectedSlugs = itinerary.days.flatMap((d) => d.stops.map((s) => s.place.slug));

    expect(selectedSlugs).toContain('must-see');
  });

  it('excludes non-free places when onlyFree is set', () => {
    const free = makePlace({ slug: 'free', admission: { isFree: true } });
    const paid = makePlace({ slug: 'paid', admission: { isFree: false, adultPrice: 30 } });
    const itinerary = generateItinerary(makeInput({ onlyFree: true, days: 1, pace: 'relaxed' }), [free, paid]);

    const selectedSlugs = itinerary.days.flatMap((d) => d.stops.map((s) => s.place.slug));
    expect(selectedSlugs).toEqual(['free']);
  });

  it('produces no days when there are no eligible candidates', () => {
    const paid = makePlace({ slug: 'paid', admission: { isFree: false, adultPrice: 30 } });
    const itinerary = generateItinerary(makeInput({ onlyFree: true, days: 2, pace: 'relaxed' }), [paid]);

    expect(itinerary.days).toHaveLength(0);
    expect(itinerary.totalPlaces).toBe(0);
  });

  it('caps totalPlaces at the number of available candidates when fewer exist than requested', () => {
    const places = ['a', 'b'].map((slug) => makePlace({ slug }));
    const itinerary = generateItinerary(makeInput({ days: 3, pace: 'intensive' }), places); // wants 12
    expect(itinerary.totalPlaces).toBe(2);
  });
});
