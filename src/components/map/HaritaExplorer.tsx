'use client';
// components/map/HaritaExplorer.tsx
// The /harita geographic instrument (Phase 5, refined). The map owns the
// full remaining viewport — no fixed split, no floating capsules/pills.
// Controls are thin, precise, quiet: a plain underlined search field, a
// text-toggle filter disclosure, plain-text basemap labels (in
// PlacesMap.tsx). The results list is a collapsible panel, not a
// permanent sidebar — default state shows very little UI, only the map.
//
// Filter state stays local (not URL-synced like /places): this is a
// browsing/exploration surface, not a bookmarked results page.
//
// Route-building reuses the site's real trip-selection state (the same
// mechanism AddToTripButton/the planner already use) — adding a place
// here is the same "Rotama ekle" action as everywhere else, not a
// parallel system.

import { useEffect, useMemo, useRef, useState } from 'react';
import type L from 'leaflet';
import Link from 'next/link';
import { Category, Place, Region } from '@/types/place';
import { PlacesMapWrapper } from './PlacesMapWrapper';
import { MapResultRow } from './MapResultRow';
import { useFavorites } from '@/hooks/useFavorites';
import { useTripSelection } from '@/hooks/useTripSelection';
import { EmptyState } from '@/components/ui/EmptyState';
import { tr } from '@/lib/i18n/tr';
import { SearchIcon, CloseIcon, FilterIcon, ArrowRightIcon } from '@/components/ui/icons';

const ALL = '__all__';

interface HaritaExplorerProps {
  places: Place[];
  categories: Category[];
  regions: Region[];
}

export function HaritaExplorer({ places, categories, regions }: HaritaExplorerProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);
  const [region, setRegion] = useState<string>(ALL);
  const [onlyFree, setOnlyFree] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pendingBounds, setPendingBounds] = useState<L.LatLngBounds | null>(null);
  const [activeBounds, setActiveBounds] = useState<L.LatLngBounds | null>(null);

  const { favorites, toggle: toggleFavorite } = useFavorites();
  const { selected: routeSlugs, toggle: toggleRoute } = useTripSelection();
  const favoriteSlugs = useMemo(() => new Set(favorites), [favorites]);

  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const listPanelRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const isFiltered = Boolean(query.trim()) || category !== ALL || region !== ALL || onlyFree;
  const activeFilterCount = (category !== ALL ? 1 : 0) + (region !== ALL ? 1 : 0) + (onlyFree ? 1 : 0);

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (region !== ALL && p.region !== region) return false;
      if (onlyFree && !(p.admission?.isFree ?? true)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.shortDescription.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [places, category, region, onlyFree, query]);

  const visiblePlaces = useMemo(() => {
    if (!activeBounds) return filteredPlaces;
    return filteredPlaces.filter(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number' && activeBounds.contains([p.latitude, p.longitude])
    );
  }, [filteredPlaces, activeBounds]);

  const visibleSlugs = useMemo(() => new Set(visiblePlaces.map((p) => p.slug)), [visiblePlaces]);

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
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    if (rowTop < visibleTop) container.scrollTo({ top: rowTop - 8, behavior });
    else if (rowBottom > visibleBottom) container.scrollTo({ top: rowBottom - container.clientHeight + 8, behavior });
  }, [selectedSlug]);

  useEffect(() => {
    if (!filterOpen) return;
    const onClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [filterOpen]);

  const clearFilters = () => {
    setQuery('');
    setCategory(ALL);
    setRegion(ALL);
    setOnlyFree(false);
  };

  return (
    <div className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden">
      <PlacesMapWrapper
        places={places}
        visibleSlugs={visibleSlugs}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
        onUserMovedBounds={setPendingBounds}
        favoriteSlugs={favoriteSlugs}
        routeSlugs={routeSlugs}
        onToggleFavorite={toggleFavorite}
        onToggleRoute={toggleRoute}
      />

      {/* Quiet control zone — thin, precise, no floating capsules */}
      <div className="pointer-events-none absolute left-3 top-3 z-[var(--z-map-controls)] max-w-[calc(100%-5rem)] sm:left-4 sm:top-4">
        <div className="pointer-events-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1.5 border-b border-line bg-paper/90 px-1 backdrop-blur-sm">
              <SearchIcon className="h-3.5 w-3.5 shrink-0 text-subtle" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr.filter.searchPlaceholder}
                aria-label={tr.filter.search}
                className="w-40 bg-transparent py-1.5 text-sm text-strong placeholder:text-subtle focus:outline-none sm:w-56"
              />
            </div>

            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-paper/90 px-1 py-1.5 text-sm font-medium text-strong backdrop-blur-sm"
              >
                <FilterIcon className="h-3.5 w-3.5" />
                {tr.filter.filters}
                {activeFilterCount > 0 && <span className="text-brand">({activeFilterCount})</span>}
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
                  <div className="flex flex-col gap-4 text-sm">
                    <div>
                      <p className="mb-1.5 text-label font-medium uppercase tracking-wider text-subtle">{tr.filter.category}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <button type="button" onClick={() => setCategory(ALL)} className={category === ALL ? 'font-medium text-brand' : 'text-muted hover:text-strong'}>
                          {tr.filter.allCategories}
                        </button>
                        {categories.map((c) => (
                          <button key={c} type="button" onClick={() => setCategory(c)} className={category === c ? 'font-medium text-brand' : 'text-muted hover:text-strong'}>
                            {tr.categories[c]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-label font-medium uppercase tracking-wider text-subtle">{tr.filter.region}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <button type="button" onClick={() => setRegion(ALL)} className={region === ALL ? 'font-medium text-brand' : 'text-muted hover:text-strong'}>
                          {tr.filter.allRegions}
                        </button>
                        {regions.map((r) => (
                          <button key={r} type="button" onClick={() => setRegion(r)} className={region === r ? 'font-medium text-brand' : 'text-muted hover:text-strong'}>
                            {tr.regions[r]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex cursor-pointer items-center gap-1.5 text-muted">
                      <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} className="h-3.5 w-3.5 rounded-sm border-line accent-brand" />
                      {tr.filter.freeOnly}
                    </label>
                    {isFiltered && (
                      <button type="button" onClick={clearFilters} className="self-start text-meta text-subtle underline underline-offset-2 hover:text-brand">
                        {tr.filter.clearFilters}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              className="bg-paper/90 px-1 py-1.5 text-sm font-medium text-strong underline decoration-line underline-offset-4 backdrop-blur-sm hover:decoration-brand"
            >
              {tr.filter.resultsFound(visiblePlaces.length)} · {listOpen ? 'Haritayı göster' : 'Listeyi göster'}
            </button>
          </div>

          {(activeBounds || pendingBounds) && (
            <div className="flex items-center gap-3 text-meta">
              {activeBounds && (
                <button type="button" onClick={() => setActiveBounds(null)} className="bg-paper/90 px-1 font-medium text-brand underline underline-offset-2 backdrop-blur-sm">
                  {tr.map.areaResultsActive}
                </button>
              )}
              {pendingBounds && (
                <button
                  type="button"
                  onClick={() => { setActiveBounds(pendingBounds); setPendingBounds(null); }}
                  className="flex items-center gap-1 bg-paper/90 px-1 font-medium text-strong underline underline-offset-2 backdrop-blur-sm"
                >
                  <SearchIcon className="h-3 w-3 text-brand" />
                  {tr.map.searchThisArea}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results panel — collapsible, not permanent. Full-screen on mobile, a
          flush side panel (no heavy shadow/rounding) on larger widths. */}
      <div
        className={`absolute inset-y-0 left-0 z-[var(--z-preview)] w-full border-r border-line bg-surface shadow-[var(--shadow-card)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-editorial)] sm:w-[380px] ${
          listOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-medium text-strong">{tr.filter.resultsFound(visiblePlaces.length)}</p>
          <button type="button" onClick={() => setListOpen(false)} aria-label="Kapat" className="text-subtle hover:text-strong">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div ref={listPanelRef} className="h-[calc(100%-49px)] overflow-y-auto">
          {visiblePlaces.length === 0 ? (
            <EmptyState icon={<SearchIcon className="h-6 w-6" />} title={tr.filter.noResults} description="Filtreleri değiştirmeyi veya bölge aramasını temizlemeyi deneyin." />
          ) : (
            visiblePlaces.map((place) => (
              <MapResultRow
                key={place.slug}
                place={place}
                selected={place.slug === selectedSlug}
                onSelect={() => setSelectedSlug(place.slug)}
                rowRef={(el) => {
                  if (el) rowRefs.current.set(place.slug, el);
                  else rowRefs.current.delete(place.slug);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Route-building strip — restrained, minimal chrome, appears only once building a route */}
      {routeSlugs.length >= 1 && (
        <div className="absolute inset-x-0 bottom-0 z-[var(--z-map-controls)] flex justify-center px-4 pb-4">
          <div className="flex items-center gap-3 border border-line bg-surface/95 px-4 py-2.5 text-sm shadow-[var(--shadow-card)] backdrop-blur-sm">
            <span className="font-medium text-strong">
              {routeSlugs.length} durak seçildi
            </span>
            <Link href="/gezi-planla" className="flex items-center gap-1 font-semibold text-brand hover:underline">
              Rotanı Planla
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
