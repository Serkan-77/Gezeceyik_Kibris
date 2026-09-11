// components/home/CategoryNav.tsx
// Second beat, right after the hero photograph: a real wayfinding moment,
// not decoration. Four categories that each have their own dedicated
// page, counted from the real catalogue — no invented numbers.

import { ComponentType } from 'react';
import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { CastleIcon, WavesIcon, ArchIcon, ColumnsIcon, CompassIcon, IconProps } from '@/components/ui/icons';

const CATEGORY_LINKS: { href: string; label: string; category: Place['category']; Icon: ComponentType<IconProps> }[] = [
  { href: '/castles', label: 'Kaleler', category: 'Castle', Icon: CastleIcon },
  { href: '/beaches', label: 'Plajlar', category: 'Beach', Icon: WavesIcon },
  { href: '/historical-places', label: 'Tarihi Yerler', category: 'Historical Place', Icon: ArchIcon },
  { href: '/museums', label: 'Müzeler', category: 'Museum', Icon: ColumnsIcon },
];

interface CategoryNavProps {
  places: Place[];
}

export function CategoryNav({ places }: CategoryNavProps) {
  // The four categories above each have their own dedicated landing page,
  // but the catalogue has eleven categories total (arkeolojik alanlar,
  // manastırlar, kiliseler, doğa, seyir noktaları, kültürel alanlar, ...)
  // that only live on /places. Without this tile those places were
  // reachable but never surfaced here, so the bar undercounted the
  // catalogue by roughly a quarter of its places.
  const allPlacesTile = { href: '/places', label: 'Tüm Yerler', count: places.length, Icon: CompassIcon };

  return (
    <nav className="border-b border-line bg-paper" aria-label="Kategoriye göre keşfet">
      <Container>
        <ul className="grid grid-cols-2 sm:grid-cols-5">
          {CATEGORY_LINKS.map(({ href, label, category, Icon }, i) => {
            const count = places.filter((p) => p.category === category).length;
            return (
              <li key={href} className={i > 0 ? 'border-l border-line' : ''}>
                <Reveal delayMs={i * 60}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 px-4 py-6 transition-colors hover:bg-surface-muted sm:justify-center sm:px-3"
                  >
                    <Icon className="h-6 w-6 shrink-0 text-brand transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
                    <span>
                      <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-strong">{label}</span>
                      <span className="block font-mono text-[11px] tabular-nums text-subtle">{count} yer</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
          <li className="col-span-2 border-t border-line sm:col-span-1 sm:border-t-0 sm:border-l">
            <Reveal delayMs={CATEGORY_LINKS.length * 60}>
              <Link
                href={allPlacesTile.href}
                className="group flex items-center gap-3 px-4 py-6 transition-colors hover:bg-surface-muted sm:justify-center sm:px-3"
              >
                <allPlacesTile.Icon className="h-6 w-6 shrink-0 text-brand transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
                <span>
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-strong">{allPlacesTile.label}</span>
                  <span className="block font-mono text-[11px] tabular-nums text-subtle">{allPlacesTile.count} yer</span>
                </span>
              </Link>
            </Reveal>
          </li>
        </ul>
      </Container>
    </nav>
  );
}
