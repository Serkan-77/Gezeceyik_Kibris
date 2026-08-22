'use client';
// components/places/PlaceFilters.tsx
// Client Component — Turkish labels, reads URL search params on mount.

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Place, Category, Region } from '@/types/place';
import { PlaceGrid } from './PlaceGrid';

const ALL = '__all__';

interface PlaceFiltersProps {
  places: Place[];
  categories: Category[];
  regions: Region[];
  lockedCategory?: Category;
}

export function PlaceFilters({
  places,
  categories,
  regions,
  lockedCategory,
}: PlaceFiltersProps) {
  const searchParams = useSearchParams();

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
        if (!(p.admission?.isFree ?? true)) return false;
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

        {/* Search */}
        <div className="relative flex-1 sm:min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9ca3af]" aria-hidden="true">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="search-places"
            type="search"
            placeholder="Yer adı veya şehir ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputBase} w-full pl-9 placeholder:text-[#9ca3af]`}
          />
        </div>

        <div className="hidden h-6 w-px bg-[#e8e4de] sm:block" aria-hidden="true" />

        {/* Category */}
        {!lockedCategory && (
          <select
            id="filter-category"
            aria-label="Kategoriye göre filtrele"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`${inputBase} pr-8`}
          >
            <option value={ALL}>Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        {/* Region */}
        <select
          id="filter-region"
          aria-label="Bölgeye göre filtrele"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className={`${inputBase} pr-8`}
        >
          <option value={ALL}>Tüm Bölgeler</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Free only */}
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
          Ücretsiz Giriş
        </label>

        {/* Clear */}
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
            Temizle
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-5 text-xs text-[#9ca3af]">
        {filtered.length === 0
          ? 'Arama kriterlerinize uygun yer bulunamadı'
          : `${filtered.length} yer bulundu`}
      </p>

      <PlaceGrid
        places={filtered}
        emptyMessage="Arama kriterlerinizi değiştirmeyi veya filtreleri temizlemeyi deneyin."
      />
    </div>
  );
}
