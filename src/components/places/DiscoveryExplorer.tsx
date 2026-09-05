'use client';
// components/places/DiscoveryExplorer.tsx
// Ground-up rebuild. Search + region/category filters, URL-synced (so a
// filtered view is shareable and back-button safe) driving a photo-first
// grid — the first result runs large, the rest settle into a standard
// grid, so 121 places never read as an identical card wall.

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Category, Place, Region } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { PlaceCard } from './PlaceCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SearchIcon, MapIcon } from '@/components/ui/icons';

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
  const [ratings, setRatings] = useState<Record<string, { average: number; count: number }>>({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ratings/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeIds: places.map((p) => p.id) }),
    })
      .then((res) => res.json())
      .then((data: { ratings: Record<string, { average: number | undefined; count: number }> }) => {
        if (cancelled) return;
        const withVotes: Record<string, { average: number; count: number }> = {};
        for (const [id, agg] of Object.entries(data.ratings)) {
          if (agg.average !== undefined) withVotes[id] = { average: agg.average, count: agg.count };
        }
        setRatings(withVotes);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [places]);

  const selectedCategory = lockedCategory ?? (searchParams.get('category') as Category | null) ?? ALL;
  const selectedRegion = (searchParams.get('region') as Region | null) ?? ALL;

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL) params.delete(key);
      else params.set(key, value);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const filtered = useMemo(() => {
    const q = queryInput.trim().toLowerCase();
    return places.filter((p) => {
      if (selectedCategory !== ALL && p.category !== selectedCategory) return false;
      if (selectedRegion !== ALL && p.region !== selectedRegion) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.shortDescription.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [places, selectedCategory, selectedRegion, queryInput]);

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-display text-page-title font-semibold text-strong text-balance">{title}</h1>
        <p className="mt-3 text-body leading-relaxed text-muted text-pretty">{subtitle}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={<SearchIcon className="h-4 w-4" />}
            placeholder="İsim veya şehirle ara…"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            aria-label="Yer ara"
          />
        </div>
        {!lockedCategory && (
          <Select
            value={selectedCategory}
            onChange={(e) => setParam('category', e.target.value)}
            aria-label="Kategori"
            className="sm:w-52"
          >
            <option value={ALL}>Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {tr.categories[c]}
              </option>
            ))}
          </Select>
        )}
        <Select
          value={selectedRegion}
          onChange={(e) => setParam('region', e.target.value)}
          aria-label="Bölge"
          className="sm:w-48"
        >
          <option value={ALL}>Tüm bölgeler</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <Button href="/harita" variant="secondary" icon={<MapIcon className="h-4 w-4" />} iconPosition="leading" className="shrink-0">
          Haritada gör
        </Button>
      </div>

      <p className="mt-6 text-sm text-subtle">{filtered.length} yer bulundu</p>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center py-16 text-center">
          <p className="font-display text-block-title text-strong">Bu kriterlere uyan yer yok</p>
          <p className="mt-2 max-w-sm text-body-sm text-subtle">
            Arama teriminizi veya filtrelerinizi değiştirmeyi deneyin.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((place, i) => (
            <div key={place.slug} className={i === 0 ? 'col-span-2' : ''}>
              <PlaceCard place={place} size={i === 0 ? 'lg' : 'md'} priority={i < 4} rating={ratings[place.id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DiscoveryExplorerSkeleton() {
  return (
    <div>
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-sm bg-surface-muted" />
      <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded-sm bg-surface-muted" />
      <div className="mt-8 h-11 w-full animate-pulse rounded-sm bg-surface-muted" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-md bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
