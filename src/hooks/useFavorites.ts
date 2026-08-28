'use client';
// hooks/useFavorites.ts
// localStorage-based favorites persistence.
// Safe for SSR — returns empty on server, hydrates on client.

import { useLocalStorageSet } from './useLocalStorageSet';

const STORAGE_KEY = 'kktc_favorites';

export function useFavorites() {
  const { items, has, toggle, add, remove, clear, hydrated } = useLocalStorageSet(STORAGE_KEY);
  return { favorites: items, isFavorite: has, toggle, add, remove, clear, hydrated };
}
