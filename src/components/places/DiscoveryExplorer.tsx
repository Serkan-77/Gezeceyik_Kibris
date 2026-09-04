'use client';
// components/places/DiscoveryExplorer.tsx
// The redesigned /places experience (Phase 3, refined) — content-led
// hybrid discovery. Search/filter state stays URL-synced (shareable,
// back-button safe — the one real advantage /places has over /harita's
// deliberately local filter state). Reuses the exact same real map
// capabilities as /harita (PlacesMapWrapper: clustering, selectedSlug,
// zoomToShowLayer, bounds search) but content leads — the map is a
// constant companion, not the main event. No fixed 58/42 split: a
// breathing composition, no hard vertical rule, shared background tone.

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import type L from 'leaflet';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Category, Place, Region } from '@/types/place';
import { DiscoveryRow } from './DiscoveryRow';
import { PlacesMapWrapper } from '@/components/map/PlacesMapWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MobileFilterSheet } from '@/components/ui/MobileFilterSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { tr } from '@/lib/i18n/tr';
import { SearchIcon, CloseIcon, FilterIcon, MapIcon, ListIcon } from '@/components/ui/icons';

const ALL = '__all__';

interface DiscoveryExplorerProps {
  places: Place[];
  categories: Category[];
  regions: Region[];
  lockedCategory?: Category;
  title: string;
  subtitle: string;
}

export function DiscoveryExplorer({ places, categories, regions, lockedCategory, title, subtitle }: DiscoveryExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [queryInput, setQueryInput] = useState(searchParams.get('q') ?? '');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pendingBounds, setPendingBounds] = useState<L.LatLngBounds | null>(null);
  const [activeBounds, setActiveBounds] = useState<L.LatLngBounds | null>(null);

  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const listPanelRef = useRef<HTMLDivElement>(null);

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

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    places.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, [places]);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (selectedCategory !== ALL && p.category !== selectedCategory) return false;
      if (selectedRegion !== ALL && p.region !== selectedRegion) return false;
      if (onlyFree && !(p.admission?.isFree ?? true)) return false;
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

  // Bounds only ever narrows an already-filtered list, and only once the
  // user explicitly confirms "Bu bölgede ara" — the map never silently
  // drives the result list on its own.
  const visiblePlaces = useMemo(() => {
    if (!activeBounds) return filtered;
    return filtered.filter(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number' && activeBounds.contains([p.latitude, p.longitude])
    );
  }, [filtered, activeBounds]);

  const visibleSlugs = useMemo(() => new Set(visiblePlaces.map((p) => p.slug)), [visiblePlaces]);

  const isFiltered = Boolean(query) || selectedRegion !== ALL || (selectedCategory !== ALL && !lockedCategory) || onlyFree;
  const sheetFilterCount =
    (selectedCategory !== ALL && !lockedCategory ? 1 : 0) + (selectedRegion !== ALL ? 1 : 0) + (onlyFree ? 1 : 0);

  useEffect(() => {
    if (!selectedSlug || visiblePlaces.some((p) => p.slug === selectedSlug)) return;
    Promise.resolve().then(() => setSelectedSlug(null));
  }, [visiblePlaces, selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) return;
    const container = listPanelRef.current;
    const row = rowRefs.current.get(selectedSlug);
    if (!container || !row) return;
    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowTop = rowRect.top - containerRect.top + container.scrollTop;
    const rowBottom = rowTop + rowRect.height;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    if (rowTop < visibleTop) container.scrollTo({ top: rowTop - 8, behavior });
    else if (rowBottom > visibleBottom) container.scrollTo({ top: rowBottom - container.clientHeight + 8, behavior });
  }, [selectedSlug]);

  const clearAll = useCallback(() => {
    setQueryInput('');
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const categoryTabs = !lockedCategory && (
    <nav aria-label={tr.filter.category} className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <button
        type="button"
        onClick={() => setParam('category', null)}
        className={`shrink-0 whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
          selectedCategory === ALL ? 'border-b-2 border-brand text-brand' : 'border-b-2 border-transparent text-muted hover:text-strong'
        }`}
      >
        {tr.filter.allCategories}
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setParam('category', c)}
          className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
            selectedCategory === c ? 'border-b-2 border-brand text-brand' : 'border-b-2 border-transparent text-muted hover:text-strong'
          }`}
        >
          {tr.categories[c]}
          <span className="font-mono text-xs tabular-nums text-subtle">{categoryCounts[c] ?? 0}</span>
        </button>
      ))}
    </nav>
  );

  const regionRow = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={() => setParam('region', null)}
        className={`text-meta font-medium transition-colors ${selectedRegion === ALL ? 'text-brand' : 'text-subtle hover:text-strong'}`}
      >
        {tr.filter.allRegions}
      </button>
      {regions.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setParam('region', r)}
          className={`text-meta font-medium transition-colors ${selectedRegion === r ? 'text-brand' : 'text-subtle hover:text-strong'}`}
        >
          {tr.regions[r]}
        </button>
      ))}
      <label className="ml-auto flex cursor-pointer select-none items-center gap-1.5 text-meta text-subtle">
        <input
          type="checkbox"
          checked={onlyFree}
          onChange={(e) => setParam('free', e.target.checked ? '1' : null)}
          className="h-3.5 w-3.5 rounded-sm border-line accent-brand"
        />
        {tr.filter.freeOnly}
      </label>
    </div>
  );

  return (
    <div>
      {/* Opening — editorial, search as typography, not a boxed input above a grid */}
      <div className="mb-8 border-b border-line pb-8">
        <p className="font-display text-page-title font-semibold leading-tight text-strong text-balance">
          {title}
        </p>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-muted text-pretty">{subtitle}</p>

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 sm:max-w-md">
            <Input
              type="search"
              placeholder={tr.filter.searchPlaceholder}
              value={queryInput}
              icon={<SearchIcon className="h-4 w-4" />}
              onChange={(e) => {
                setQueryInput(e.target.value);
                setParam('q', e.target.value);
              }}
              aria-label={tr.filter.search}
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-sm border border-line bg-surface px-3.5 text-sm font-medium text-strong transition-colors hover:border-brand/50 sm:hidden"
          >
            <FilterIcon className="h-4 w-4" />
            {tr.filter.filters}
            {sheetFilterCount > 0 && <span className="text-brand">({sheetFilterCount})</span>}
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={clearAll}
              className="hidden h-11 items-center gap-1.5 rounded-sm border border-line px-3.5 text-sm text-subtle transition-colors hover:border-brand hover:text-brand sm:flex"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              {tr.filter.clearFilters}
            </button>
          )}
        </div>

        <div className="mt-6 hidden flex-col gap-3 sm:flex">
          {categoryTabs}
          {regionRow}
        </div>

        <p className="mt-5 text-body-sm text-subtle">
          {visiblePlaces.length === 0 ? tr.filter.noResults : tr.filter.resultsFound(visiblePlaces.length)}
        </p>

        {activeBounds && (
          <button
            type="button"
            onClick={() => setActiveBounds(null)}
            className="mt-2 inline-flex items-center gap-1.5 text-meta font-medium text-brand underline underline-offset-2"
          >
            {tr.map.areaResultsActive}
            <CloseIcon className="h-3 w-3" />
          </button>
        )}
        {pendingBounds && (
          <button
            type="button"
            onClick={() => {
              setActiveBounds(pendingBounds);
              setPendingBounds(null);
            }}
            className="mt-2 ml-4 inline-flex items-center gap-1.5 text-meta font-medium text-strong underline underline-offset-2"
          >
            <SearchIcon className="h-3 w-3 text-brand" />
            {tr.map.searchThisArea}
          </button>
        )}
      </div>

      {/* Mobile Liste/Harita toggle */}
      <div className="mb-3 flex gap-1 rounded-sm border border-line bg-surface-muted p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
            mobileView === 'list' ? 'bg-surface text-strong shadow-[var(--shadow-card)]' : 'text-muted hover:text-strong'
          }`}
        >
          <ListIcon className="h-4 w-4" />
          {tr.map.viewList} ({visiblePlaces.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
            mobileView === 'map' ? 'bg-surface text-strong shadow-[var(--shadow-card)]' : 'text-muted hover:text-strong'
          }`}
        >
          <MapIcon className="h-4 w-4" />
          {tr.map.viewMap}
        </button>
      </div>

      {/* Composed surface — content and geography, breathing, not a rigid split */}
      <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-start">
        <div
          ref={listPanelRef}
          className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block ${
            visiblePlaces.length === 0 ? '' : 'max-h-none overflow-visible lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'
          }`}
        >
          {visiblePlaces.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-6 w-6" />}
              title={tr.filter.noResults}
              description="Filtreleri değiştirmeyi veya bölge aramasını temizlemeyi deneyin."
              action={
                isFiltered ? (
                  <Button variant="secondary" onClick={clearAll}>
                    {tr.filter.clearFilters}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            visiblePlaces.map((place, i) => (
              <DiscoveryRow
                key={place.slug}
                place={place}
                selected={place.slug === selectedSlug}
                onSelect={() => setSelectedSlug(place.slug)}
                featured={i === 0}
                rowRef={(el) => {
                  if (el) rowRefs.current.set(place.slug, el);
                  else rowRefs.current.delete(place.slug);
                }}
              />
            ))
          )}
        </div>

        <div
          className={`${mobileView === 'map' ? 'block' : 'hidden'} relative h-[65svh] min-h-[420px] overflow-hidden rounded-md border border-line lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-7rem)]`}
        >
          <PlacesMapWrapper
            places={places}
            visibleSlugs={visibleSlugs}
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
            onUserMovedBounds={setPendingBounds}
            visible={mobileView === 'map'}
          />
        </div>
      </div>

      <MobileFilterSheet
        open={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        title={tr.filter.filters}
        footer={
          <div className="flex gap-3">
            {isFiltered && (
              <Button variant="secondary" className="flex-1" onClick={() => { clearAll(); setMobileSheetOpen(false); }}>
                {tr.filter.clearFilters}
              </Button>
            )}
            <Button className="flex-1" onClick={() => setMobileSheetOpen(false)}>
              {tr.filter.resultsFound(visiblePlaces.length)}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          {categoryTabs}
          {regionRow}
        </div>
      </MobileFilterSheet>
    </div>
  );
}

/** Suspense fallback shared by every page that renders DiscoveryExplorer. */
export function DiscoveryExplorerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 border-b border-line pb-8">
        <div className="h-9 w-2/3 rounded-sm bg-surface-muted" />
        <div className="mt-3 h-5 w-1/2 rounded-sm bg-surface-muted" />
        <div className="mt-6 h-11 w-full max-w-md rounded-sm bg-surface-muted" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-line py-4">
            <div className="h-28 w-32 shrink-0 rounded-sm bg-surface-muted sm:w-44" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-24 rounded-sm bg-surface-muted" />
              <div className="h-5 w-1/2 rounded-sm bg-surface-muted" />
              <div className="h-4 w-1/3 rounded-sm bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
