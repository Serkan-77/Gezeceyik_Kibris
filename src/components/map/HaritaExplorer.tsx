'use client';
// components/map/HaritaExplorer.tsx
// The map is the dominant surface from the moment the page loads — no
// hero, no floating toolbar islands. A compact list panel (search +
// region/category filters) sits beside it on desktop; on mobile the two
// swap via a simple List/Map toggle rather than fighting for the same
// screen. Selecting a result pans the map; selecting a marker scrolls
// the list — one shared selection state, not two disconnected views.

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Place, Region } from '@/types/place';
import { PlacesMapWrapper } from './PlacesMapWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { SearchIcon, ListIcon, MapIcon, ArrowRightIcon, PinIcon } from '@/components/ui/icons';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';

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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('map');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (region !== ALL && p.region !== region) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [places, category, region, query]);

  const visibleSlugs = useMemo(() => new Set(filtered.map((p) => p.slug)), [filtered]);

  return (
    <div className="relative flex h-[calc(100dvh-4rem)] flex-col lg:flex-row">
      <div className={`flex w-full shrink-0 flex-col border-r border-line bg-paper lg:w-[380px] ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="space-y-2.5 border-b border-line p-4">
          <Input icon={<SearchIcon className="h-4 w-4" />} placeholder="Yer veya şehir ara…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Yer ara" />
          <div className="flex gap-2">
            <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategori" className="flex-1">
              <option value={ALL}>Tüm kategoriler</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {tr.categories[c]}
                </option>
              ))}
            </Select>
            <Select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Bölge" className="flex-1">
              <option value={ALL}>Tüm bölgeler</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <p className="text-meta text-subtle">{filtered.length} yer</p>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {filtered.map((place) => {
            const representative = isImageRepresentative(place.verificationStatus);
            const active = place.slug === selectedSlug;
            const CategoryIcon = CATEGORY_ICONS[place.category];
            return (
              <button
                key={place.slug}
                type="button"
                onClick={() => setSelectedSlug(place.slug)}
                className={`relative flex w-full items-center gap-3.5 border-b border-line py-3.5 pl-4 pr-4 text-left transition-colors ${active ? 'bg-brand/[0.06]' : 'hover:bg-surface-muted'}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-[3px] transition-colors ${active ? 'bg-brand' : 'bg-transparent'}`}
                  aria-hidden="true"
                />
                <span className="relative h-16 w-20 shrink-0 overflow-hidden border border-line bg-surface-muted">
                  {place.image && <Image src={place.image} alt="" fill sizes="80px" className="object-cover" />}
                  {representative && place.image && <span className="absolute bottom-0 left-0 bg-surface/90 px-1 font-mono text-[8px] uppercase text-ink-soft">Temsili</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-subtle">
                    <CategoryIcon className="h-3 w-3 shrink-0" />
                    {tr.categories[place.category]}
                  </span>
                  <span className={`block truncate font-serif text-base font-semibold ${active ? 'text-brand-strong' : 'text-strong'}`}>{place.name}</span>
                  <span className="mt-0.5 flex items-center gap-1 truncate text-meta text-subtle">
                    <PinIcon className="h-3 w-3 shrink-0" />
                    {place.city}
                  </span>
                </span>
                <Link
                  href={`/places/${place.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${place.name}, ${tr.place.viewDetails}`}
                  className="shrink-0 text-subtle transition-colors hover:text-brand"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`relative flex-1 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
        <PlacesMapWrapper places={places} visibleSlugs={visibleSlugs} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
      </div>

      {/* Floating switch instead of a full-width bar — overlaps the active
          view (list or map) rather than claiming its own permanent row, so
          both panels get the full viewport height beneath it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[var(--z-index-map-controls)] flex justify-center lg:hidden">
        <div className="pointer-events-auto flex items-center border border-ink bg-paper/95 shadow-lift backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.05em] transition-colors ${mobileView === 'list' ? 'bg-ink text-white' : 'text-muted'}`}
          >
            <ListIcon className="h-4 w-4" />
            Liste
          </button>
          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 border-l border-ink px-4 py-2.5 font-mono text-xs uppercase tracking-[0.05em] transition-colors ${mobileView === 'map' ? 'bg-ink text-white' : 'text-muted'}`}
          >
            <MapIcon className="h-4 w-4" />
            Harita
          </button>
        </div>
      </div>
    </div>
  );
}
