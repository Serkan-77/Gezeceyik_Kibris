'use client';
// hooks/useLocalStorageSet.ts
// Generic localStorage-backed string-array set with SSR-safe hydration.
// Shared plumbing behind useFavorites — a "toggle a slug in/out of a
// persisted list" shape. (The trip-selection equivalent now lives in
// context/DraftRouteContext.tsx, Supabase-backed rather than localStorage.)

import { useState, useEffect, useCallback } from 'react';

function readStorage(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, slugs: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(slugs));
  } catch {
    // storage full or blocked — silently ignore
  }
}

export function useLocalStorageSet(storageKey: string) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readStorage(storageKey);
    // Batch both state updates — suppress cascading render warning
    // This is correct usage: syncing from an external system (localStorage)
    Promise.resolve().then(() => {
      setItems(saved);
      setHydrated(true);
    });
  }, [storageKey]);

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  const toggle = useCallback(
    (slug: string) => {
      setItems((prev) => {
        const next = prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [...prev, slug];
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const add = useCallback(
    (slug: string) => {
      setItems((prev) => {
        if (prev.includes(slug)) return prev;
        const next = [...prev, slug];
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const remove = useCallback(
    (slug: string) => {
      setItems((prev) => {
        const next = prev.filter((s) => s !== slug);
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const clear = useCallback(() => {
    setItems([]);
    writeStorage(storageKey, []);
  }, [storageKey]);

  return { items, has, toggle, add, remove, clear, hydrated };
}
