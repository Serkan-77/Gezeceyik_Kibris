'use client';
// components/places/PlaceFilters.tsx
// Client Component — manages filter state, reads URL search params on mount.
// Receives all places as a prop (fetched server-side), filters client-side.

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Place, Category, Region } from '@/types/place';
import { PlaceGrid } from './PlaceGrid';

const ALL = '__all__';

interface PlaceFiltersProps {
  places: Place[];
  categories: Category[];
  regions: Region[];
  /** If provided, the category filter is locked and hidden. */
  lockedCategory?: Category;
}

export function PlaceFilters({
  places,
  categories,
  regions,
  lockedCategory,
}: PlaceFiltersProps) {
  const searchParams = useSearchParams();

  // Initialise from URL params so /places?category=Museum pre-filters correctly.
  // useSearchParams is reactive so this is safe as direct initialiser.
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => lockedCategory ?? searchParams.get('category') ?? ALL
  );
  const [selectedRegion, setSelectedRegion] = useState<string>(
    () => searchParams.get('region') ?? ALL
  );
  const [onlyFree, setOnlyFree] = useState(false);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (selectedCategory !== ALL && p.category !== selectedCategory) return false;
      if (selectedRegion !== ALL && p.region !== selectedRegion) return false;
      if (onlyFree) {
        const free = p.admission?.isFree ?? true;
        if (!free) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !p.shortDescription.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [places, selectedCategory, selectedRegion, onlyFree, query]);

  const isFiltered =
    query ||
    selectedRegion !== ALL ||
    (selectedCategory !== ALL && !lockedCategory) ||
    onlyFree;

  const inputBase =
    'h-10 rounded-sm border border-[#e8e4de] bg-white px-3 text-sm text-[#1a1a1a] transition-colors focus:border-[#e8651a] focus:outline-none focus:ring-1 focus:ring-[#e8651a]';

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

        {/* Search — visually prominent */}
        <div className="relative flex-1 sm:min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9ca3af]" aria-hidden="true">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="search-places"
            type="search"
            placeholder="Search by name or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputBase} w-full pl-9 placeholder:text-[#9ca3af]`}
          />
        </div>

        {/* Divider — visual grouping */}
        <div className="hidden h-6 w-px bg-[#e8e4de] sm:block" aria-hidden="true" />

        {/* Category */}
        {!lockedCategory && (
          <select
            id="filter-category"
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`${inputBase} pr-8`}
          >
            <option value={ALL}>All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        {/* Region */}
        <select
          id="filter-region"
          aria-label="Filter by region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className={`${inputBase} pr-8`}
        >
          <option value={ALL}>All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Free only toggle */}
        <label
          htmlFor="filter-free"
          className="flex h-10 cursor-pointer select-none items-center gap-2 rounded-sm border border-[#e8e4de] bg-white px-3 text-sm text-[#4b5563] transition-colors hover:border-[#e8651a]/50"
        >
          <input
            type="checkbox"
            id="filter-free"
            checked={onlyFree}
            onChange={(e) => setOnlyFree(e.target.checked)}
            className="h-4 w-4 rounded-sm border-[#e8e4de] accent-[#e8651a]"
          />
          Free entry
        </label>

        {/* Clear filters */}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedRegion(ALL);
              if (!lockedCategory) setSelectedCategory(ALL);
              setOnlyFree(false);
            }}
            className="flex h-10 items-center gap-1.5 rounded-sm border border-[#e8e4de] px-3 text-sm text-[#9ca3af] transition-colors hover:border-[#e8651a] hover:text-[#e8651a]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Results count — subtle */}
      <p className="mb-5 text-xs text-[#9ca3af]">
        {filtered.length === 0
          ? 'No places match your filters'
          : `${filtered.length} ${filtered.length === 1 ? 'place' : 'places'} found`}
      </p>

      <PlaceGrid
        places={filtered}
        emptyMessage="Try adjusting your search or clearing filters."
      />
    </div>
  );
}
