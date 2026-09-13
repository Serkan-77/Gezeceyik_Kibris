'use client';
// components/places/DiscoveryExplorer.tsx
// Ground-up rebuild. Search + region/category filters, URL-synced (so a
// filtered view is shareable and back-button safe) driving a photo-first
// grid — the first result runs large, the rest settle into a standard
// grid, so 122 places never read as an identical card wall.
//
// Crawlability: this component deliberately does NOT call
// `useSearchParams()`. That hook forces Next.js to skip this component
// during static prerendering and ship only the Suspense fallback in the
// initial HTML (see node_modules/next/dist/docs/01-app/03-api-reference/
// 04-functions/use-search-params.md, "Prerendering") — which is exactly
// why a non-JS crawler used to see nothing here but a skeleton. Filter
// state instead starts from plain defaults (so the full, real place grid
// is what actually ships in the static HTML) and is synced from the
// browser's own `window.location.search` in an effect, which only runs
// post-hydration and has no effect on what gets prerendered. The
// canonical URL for every page that renders this (see each page's
// `alternates.canonical`) never carries query params anyway — filtered
// views are shareable, just not separately indexed.
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Category, Place, Region } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { PlaceCard } from './PlaceCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SearchIcon, MapIcon } from '@/components/ui/icons';

const ALL = '__all__';
type SortBy = 'default' | 'rating';

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
  const [, startTransition] = useTransition();
  const [queryInput, setQueryInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | typeof ALL>(lockedCategory ?? ALL);
  const [selectedRegion, setSelectedRegion] = useState<Region | typeof ALL>(ALL);
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [ratings, setRatings] = useState<Record<string, { average: number; count: number }>>({});

  // One-time sync from the real URL, post-hydration only — restores a
  // shared filtered link (e.g. /castles?region=Girne) for real visitors
  // without ever touching what gets prerendered for crawlers. `window` is
  // an external system React can't know about during render/SSR, so this
  // read (and the state it seeds) can only happen inside an effect —
  // there's no async boundary to defer it through the way the ratings
  // fetch below does.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQueryInput(q);
    if (!lockedCategory) {
      const category = params.get('category');
      if (category) setSelectedCategory(category as Category);
    }
    const region = params.get('region');
    if (region) setSelectedRegion(region as Region);
    const sort = params.get('sort');
    if (sort === 'rating') setSortBy('rating');
    // Intentionally runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const setParam = useCallback(
    (key: 'category' | 'region' | 'sort', value: string) => {
      const nextCategory = key === 'category' ? (value as Category | typeof ALL) : selectedCategory;
      const nextRegion = key === 'region' ? (value as Region | typeof ALL) : selectedRegion;
      const nextSort = key === 'sort' ? (value as SortBy) : sortBy;
      if (key === 'category') setSelectedCategory(nextCategory);
      else if (key === 'region') setSelectedRegion(nextRegion);
      else setSortBy(nextSort);

      const params = new URLSearchParams();
      if (queryInput.trim()) params.set('q', queryInput.trim());
      if (!lockedCategory && nextCategory !== ALL) params.set('category', nextCategory);
      if (nextRegion !== ALL) params.set('region', nextRegion);
      if (nextSort === 'rating') params.set('sort', nextSort);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, queryInput, selectedCategory, selectedRegion, sortBy, lockedCategory]
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

  // Unrated places sort to the bottom (average -1) rather than being
  // treated as a 0 — a genuine 0-star average would otherwise be
  // indistinguishable from "nobody has voted yet".
  const sorted = useMemo(() => {
    if (sortBy !== 'rating') return filtered;
    return [...filtered].sort((a, b) => {
      const ra = ratings[a.id];
      const rb = ratings[b.id];
      const diff = (rb?.average ?? -1) - (ra?.average ?? -1);
      return diff !== 0 ? diff : (rb?.count ?? 0) - (ra?.count ?? 0);
    });
  }, [filtered, sortBy, ratings]);

  // Three tile sizes on a repeating 9-item cycle, not two — so scrolling
  // through 122 places reads as a recurring lead/wide/standard cadence
  // (Top-Design: "unexpected scale shifts create rhythm") instead of one
  // moment of drama up top followed by a wall of identical squares.
  // grid-flow-dense (below) auto-fills the gaps the larger tiles leave
  // behind, so this needs no manual row/column placement per item.
  const CYCLE = 9;
  type TileSpan = 'lead' | 'wide' | 'standard';
  const tileSpan = (i: number): TileSpan => {
    const pos = i % CYCLE;
    if (pos === 0) return 'lead'; // 2x2
    if (pos === 4) return 'wide'; // 2x1
    return 'standard';
  };

  return (
    <div>
      {/* Header as architecture: the count becomes an oversized numeral the
          title runs alongside, not a small caption beneath it — an
          asymmetric two-column mast instead of a centered stacked block. */}
      <div className="grid gap-6 border-b border-line pb-8 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-10">
        <p className="font-display text-display leading-[0.8] text-strong tabular-nums">
          {String(places.length).padStart(3, '0')}
        </p>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§01 — Keşfet</p>
          <h1 className="mt-1 font-display text-page-title leading-[0.94] text-strong text-balance pt-[0.2em] pb-[0.1em]">{title}</h1>
          <p className="mt-2 max-w-lg font-serif text-body leading-relaxed text-muted text-pretty">{subtitle}</p>
        </div>
      </div>

      {/* Filter instrument strip — mono labels over hairline-divided
          fields, the same cartographic register as WeatherBand/CategoryNav,
          not a generic form row of boxed inputs. */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-b border-line pb-6 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-end sm:gap-x-6">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="discovery-q" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">Ara</label>
          <Input
            id="discovery-q"
            icon={<SearchIcon className="h-4 w-4" />}
            placeholder="İsim veya şehir…"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </div>
        {!lockedCategory && (
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">Kategori</label>
            <Select value={selectedCategory} onChange={(e) => setParam('category', e.target.value)} aria-label="Kategori">
              <option value={ALL}>Tümü</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {tr.categories[c]}
                </option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">Bölge</label>
          <Select value={selectedRegion} onChange={(e) => setParam('region', e.target.value)} aria-label="Bölge">
            <option value={ALL}>Tümü</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">Sırala</label>
          <Select value={sortBy} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sıralama">
            <option value="default">Öne çıkanlar</option>
            <option value="rating">Puana göre</option>
          </Select>
        </div>
        <Button href="/harita" variant="secondary" icon={<MapIcon className="h-4 w-4" />} iconPosition="leading" className="col-span-2 sm:col-span-1">
          Haritada gör
        </Button>
      </div>

      <p className="mt-5 font-mono text-xs uppercase tracking-[0.05em] text-subtle">{filtered.length} yer bulundu</p>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center border border-line py-16 text-center">
          <p className="font-display text-block-title text-strong">Bu kriterlere uyan yer yok</p>
          <p className="mt-2 max-w-sm font-serif text-body-sm text-subtle">
            Arama teriminizi veya filtrelerinizi değiştirmeyi deneyin.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-flow-row-dense grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {sorted.map((place, i) => {
            const span = tileSpan(i);
            return (
              <div key={place.slug} className={span === 'lead' ? 'col-span-2 lg:row-span-2' : span === 'wide' ? 'col-span-2' : ''}>
                <PlaceCard
                  place={place}
                  size={span === 'standard' ? 'md' : 'lg'}
                  aspectClassName={span === 'wide' ? 'aspect-[21/9]' : undefined}
                  priority={i < 4}
                  rating={ratings[place.id]}
                  fillHeight={span === 'lead'}
                  index={i}
                />
              </div>
            );
          })}
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
