'use client';
// hooks/useFavorites.ts
// localStorage-based favorites persistence.
// Safe for SSR — returns empty on server, hydrates on client.

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kktc_favorites';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(slugs: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // storage full or blocked — silently ignore
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readStorage();
    // Batch both state updates — suppress cascading render warning
    // This is correct usage: syncing from an external system (localStorage)
    Promise.resolve().then(() => {
      setFavorites(saved);
      setHydrated(true);
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      writeStorage(next);
      return next;
    });
  }, []);

  const add = useCallback((slug: string) => {
    setFavorites((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.filter((s) => s !== slug);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setFavorites([]);
    writeStorage([]);
  }, []);

  return { favorites, isFavorite, toggle, add, remove, clear, hydrated };
}
