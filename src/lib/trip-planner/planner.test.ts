import { describe, it, expect } from 'vitest';
import { generateItinerary } from './planner';
import { Place } from '@/types/place';
import { PlannerInput } from './types';

const ACCOMMODATION = { lat: 35.341, lng: 33.318, label: 'Girne hotel', city: 'Girne', region: 'Girne' as const };

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

  it('orders region clusters nearest-first from the accommodation and caps each day at one cross-region hop', () => {
    const girnePlace = makePlace({ slug: 'girne', region: 'Girne', latitude: ACCOMMODATION.lat, longitude: ACCOMMODATION.lng });
    const lefkosaPlace = makePlace({ slug: 'lefkosa', region: 'Lefkoşa', latitude: 35.1857, longitude: 33.3823 });
    const magusaPlace = makePlace({ slug: 'magusa', region: 'Gazimağusa', latitude: 35.1264, longitude: 33.9421 });

    const input = makeInput({ days: 2, pace: 'intensive', mustVisitSlugs: ['girne', 'lefkosa', 'magusa'] });
    const itinerary = generateItinerary(input, [girnePlace, lefkosaPlace, magusaPlace]);

    expect(itinerary.days).toHaveLength(2);
    expect(itinerary.days[0].regions).toEqual(['Girne', 'Lefkoşa']); // Lefkoşa is the nearer of the two other regions
    expect(itinerary.days[1].regions).toEqual(['Gazimağusa']);
    itinerary.days.forEach((d) => expect(d.regions.length).toBeLessThanOrEqual(2));
  });

  it('models a real bus departure for a public-transport day that starts outside the accommodation region', () => {
    const magusaPlace = makePlace({ slug: 'magusa', region: 'Gazimağusa', latitude: 35.1264, longitude: 33.9421 });
    const route = {
      id: 'girne-magusa',
      operator: 'Kombos',
      fromRegion: 'Girne' as const,
      toRegion: 'Gazimağusa' as const,
      fromStop: { name: 'Kombos binası', city: 'Girne' },
      toStop: { name: 'Komtur', city: 'Gazimağusa' },
      durationMinutes: 75,
      fareTRY: 350,
      schedule: { type: 'fixed' as const, times: ['09:00'] },
      sourceUrl: 'https://example.com',
      lastVerifiedAt: '2026-01-01',
      verificationStatus: 'unverified' as const,
    };

    const input = makeInput({ days: 1, pace: 'relaxed', transport: 'public', mustVisitSlugs: ['magusa'] });
    const itinerary = generateItinerary(input, [magusaPlace], [route]);

    expect(itinerary.days[0].startTravel?.transitDetail?.operator).toBe('Kombos');
    expect(itinerary.days[0].startTravel?.transitDetail?.departureTime).toBe('09:00');
  });
});
