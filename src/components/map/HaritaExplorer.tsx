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
import { SearchIcon, ListIcon, MapIcon, ArrowRightIcon } from '@/components/ui/icons';

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
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:flex-row">
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

        <div className="flex-1 overflow-y-auto">
          {filtered.map((place) => {
            const representative = isImageRepresentative(place.verificationStatus);
            const active = place.slug === selectedSlug;
            return (
              <button
                key={place.slug}
                type="button"
                onClick={() => setSelectedSlug(place.slug)}
                className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors ${active ? 'bg-brand/5' : 'hover:bg-surface-muted'}`}
              >
                <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                  {place.image && <Image src={place.image} alt="" fill sizes="64px" className="object-cover" />}
                  {representative && place.image && <span className="absolute bottom-0.5 left-0.5 rounded-sm bg-white/90 px-1 text-[8px] font-medium text-ink-soft">Temsili</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-subtle">{tr.categories[place.category]}</span>
                  <span className="block truncate font-display text-sm font-semibold text-strong">{place.name}</span>
                  <span className="block truncate text-meta text-subtle">{place.city}</span>
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

      <div className="flex shrink-0 border-t border-line bg-surface lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium ${mobileView === 'list' ? 'text-brand' : 'text-subtle'}`}
        >
          <ListIcon className="h-4 w-4" />
          Liste
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex flex-1 items-center justify-center gap-2 border-l border-line py-3.5 text-sm font-medium ${mobileView === 'map' ? 'text-brand' : 'text-subtle'}`}
        >
          <MapIcon className="h-4 w-4" />
          Harita
        </button>
      </div>
    </div>
  );
}
