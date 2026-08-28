'use client';
// components/places/PlaceFilters.tsx
// Client Component — filter state lives in the URL (shareable, back-button
// safe) rather than local state; only the "clear" affordance and instant
// re-filtering justify this being a client component at all.

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Place, Category, Region } from '@/types/place';
import { PlaceGrid } from './PlaceGrid';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { tr } from '@/lib/i18n/tr';
import { SearchIcon, CloseIcon } from '@/components/ui/icons';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Search stays local+controlled (instant filtering, cheap at this dataset
  // size) but is still written to the URL so it's shareable/back-button safe.
  const [queryInput, setQueryInput] = useState(searchParams.get('q') ?? '');
  const query = queryInput;
  const selectedCategory = lockedCategory ?? searchParams.get('category') ?? ALL;
  const selectedRegion = searchParams.get('region') ?? ALL;
  const onlyFree = searchParams.get('free') === '1';

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '' || value === ALL) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

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
    query || selectedRegion !== ALL || (selectedCategory !== ALL && !lockedCategory) || onlyFree;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex-1 sm:min-w-[260px]">
          <label htmlFor="search-places" className="mb-1.5 block text-label font-medium text-muted">
            {tr.filter.search}
          </label>
          <Input
            id="search-places"
            type="search"
            placeholder={tr.filter.searchPlaceholder}
            value={queryInput}
            icon={<SearchIcon className="h-4 w-4" />}
            onChange={(e) => {
              setQueryInput(e.target.value);
              setParam('q', e.target.value);
            }}
          />
        </div>

        {!lockedCategory && (
          <div className="sm:w-48">
            <label htmlFor="filter-category" className="mb-1.5 block text-label font-medium text-muted">
              {tr.filter.category}
            </label>
            <Select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setParam('category', e.target.value)}
            >
              <option value={ALL}>{tr.filter.allCategories}</option>
              {categories.map((c) => (
                <option key={c} value={c}>{tr.categories[c]}</option>
              ))}
            </Select>
          </div>
        )}

        <div className="sm:w-44">
          <label htmlFor="filter-region" className="mb-1.5 block text-label font-medium text-muted">
            {tr.filter.region}
          </label>
          <Select
            id="filter-region"
            value={selectedRegion}
            onChange={(e) => setParam('region', e.target.value)}
          >
            <option value={ALL}>{tr.filter.allRegions}</option>
            {regions.map((r) => (
              <option key={r} value={r}>{tr.regions[r]}</option>
            ))}
          </Select>
        </div>

        <label
          htmlFor="filter-free"
          className="flex h-11 cursor-pointer select-none items-center gap-2 rounded-sm border border-line bg-surface px-3.5 text-sm text-muted transition-colors hover:border-brand/50"
        >
          <input
            type="checkbox"
            id="filter-free"
            checked={onlyFree}
            onChange={(e) => setParam('free', e.target.checked ? '1' : null)}
            className="h-4 w-4 rounded-sm border-line accent-brand"
          />
          {tr.filter.freeOnly}
        </label>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setQueryInput('');
              startTransition(() => {
                router.replace(pathname, { scroll: false });
              });
            }}
            className="flex h-11 items-center gap-1.5 rounded-sm border border-line px-3.5 text-sm text-subtle transition-colors hover:border-brand hover:text-brand"
          >
            <CloseIcon className="h-3.5 w-3.5" />
            {tr.filter.clearFilters}
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-5 text-body-sm text-subtle">
        {filtered.length === 0 ? tr.filter.noResults : tr.filter.resultsFound(filtered.length)}
      </p>

      <PlaceGrid
        places={filtered}
        emptyMessage="Arama kriterlerinizi değiştirmeyi veya filtreleri temizlemeyi deneyin."
      />
    </div>
  );
}

/** Suspense fallback shared by every page that renders PlaceFilters. */
export function PlaceFiltersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex gap-3">
        <div className="h-11 flex-1 rounded-sm bg-surface-muted" />
        <div className="h-11 w-36 rounded-sm bg-surface-muted" />
        <div className="h-11 w-36 rounded-sm bg-surface-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-md bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
