'use client';
// hooks/useTripSelection.ts
// localStorage-based trip place selection.
// Separate from favorites — a place can be selected for trip without being a favorite.

import { useLocalStorageSet } from './useLocalStorageSet';

const STORAGE_KEY = 'kktc_trip_selection';

export function useTripSelection() {
  const { items, has, toggle, add, remove, clear, hydrated } = useLocalStorageSet(STORAGE_KEY);
  return {
    selected: items,
    isSelected: has,
    toggle,
    add,
    remove,
    clear,
    hydrated,
    count: items.length,
  };
}
