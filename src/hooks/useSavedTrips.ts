'use client';
// hooks/useSavedTrips.ts
// localStorage-based saved trip itineraries ("Gezilerim").
// Unlike useFavorites (a simple slug set), a saved trip is
// a full TripItinerary object — this hook owns its own read/write pair
// rather than reusing useLocalStorageSet, which only stores string arrays.

import { useState, useEffect, useCallback } from 'react';
import { TripItinerary } from '@/lib/trip-planner/types';

const STORAGE_KEY = 'kktc_saved_trips';

export interface SavedTrip {
  id: string;
  label: string;
  createdAt: string;
  itinerary: TripItinerary;
}

function readStorage(): SavedTrip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTrip[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(trips: SavedTrip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // storage full or blocked — silently ignore
  }
}

function defaultLabel(itinerary: TripItinerary): string {
  const { days, input } = itinerary;
  return `${days.length} Günlük ${input.accommodation.city} Gezisi`;
}

export function useSavedTrips() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readStorage();
    Promise.resolve().then(() => {
      setTrips(saved);
      setHydrated(true);
    });
  }, []);

  const saveTrip = useCallback((itinerary: TripItinerary, label?: string) => {
    const trip: SavedTrip = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: label?.trim() || defaultLabel(itinerary),
      createdAt: new Date().toISOString(),
      itinerary,
    };
    setTrips((prev) => {
      const next = [trip, ...prev];
      writeStorage(next);
      return next;
    });
    return trip.id;
  }, []);

  const removeTrip = useCallback((id: string) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setTrips([]);
    writeStorage([]);
  }, []);

  return { trips, hydrated, saveTrip, removeTrip, clear };
}
