'use client';
// components/route/AddStopSearch.tsx
// Inline "add more places" search inside the route builder (Section 3 —
// "add more places" without leaving /rotam). Filters the already-loaded
// published-place list client-side; 121 places is small enough that this
// needs no server round-trip.

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { PlaceLite } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { PlusIcon, SearchIcon, CheckIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/Input';

interface AddStopSearchProps {
  places: PlaceLite[];
  inRouteSlugs: Set<string>;
  pendingSlug?: string | null;
  onAdd: (place: PlaceLite) => void;
}

const MAX_RESULTS = 6;

export function AddStopSearch({ places, inRouteSlugs, pendingSlug, onAdd }: AddStopSearchProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return [];
    return places
      .filter((p) => p.name.toLocaleLowerCase('tr-TR').includes(q) || p.city.toLocaleLowerCase('tr-TR').includes(q))
      .slice(0, MAX_RESULTS);
  }, [places, query]);

  return (
    <div>
      <Input
        icon={<SearchIcon className="h-4 w-4" />}
        placeholder={tr.route.addMorePlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={tr.route.addMore}
      />
      {query.trim() && (
        <div className="mt-2 divide-y divide-line rounded-sm border border-line bg-surface">
          {results.length === 0 && <p className="px-3.5 py-3 text-body-sm text-subtle">{tr.route.addMoreEmpty}</p>}
          {results.map((place) => {
            const already = inRouteSlugs.has(place.slug);
            const pending = pendingSlug === place.slug;
            return (
              <div key={place.slug} className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                  {place.image && <Image src={place.image} alt="" fill sizes="40px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-sm font-medium text-strong">{place.name}</span>
                  <span className="block truncate text-meta text-subtle">{place.city}</span>
                </span>
                <button
                  type="button"
                  disabled={already || pending}
                  onClick={() => onAdd(place)}
                  aria-label={already ? `${place.name} zaten rotada` : `${place.name} rotaya ekle`}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    already
                      ? 'border-line bg-surface-muted text-success'
                      : 'border-line text-strong hover:border-ink disabled:opacity-50'
                  }`}
                >
                  {already ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
