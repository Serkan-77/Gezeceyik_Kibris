'use client';
// hooks/useTripSelection.ts
// localStorage-based trip place selection.
// Separate from favorites — a place can be selected for trip without being a favorite.

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kktc_trip_selection';

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
  } catch {}
}

export function useTripSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readStorage();
    Promise.resolve().then(() => {
      setSelected(saved);
      setHydrated(true);
    });
  }, []);

  const isSelected = useCallback(
    (slug: string) => selected.includes(slug),
    [selected]
  );

  const toggle = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      writeStorage(next);
      return next;
    });
  }, []);

  const add = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = prev.filter((s) => s !== slug);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
    writeStorage([]);
  }, []);

  return { selected, isSelected, toggle, add, remove, clear, hydrated, count: selected.length };
}
