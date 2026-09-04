// components/home/IslandPinMap.tsx
// The real Cyprus coastline (see lib/geo/cyprusOutline.ts — derived from
// Natural Earth data, not a decorative squiggle) with every real place
// plotted at its real coordinate. Purely illustrative/background — the
// interactive instrument is /harita; this is the "121 places, one
// island" idea made visible at a glance.

import { CYPRUS_PATH, CYPRUS_VIEWBOX, projectLonLat } from '@/lib/geo/cyprusOutline';
import { Place } from '@/types/place';

interface IslandPinMapProps {
  places: Place[];
  className?: string;
}

export function IslandPinMap({ places, className = '' }: IslandPinMapProps) {
  const points = places.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));

  return (
    <svg viewBox={CYPRUS_VIEWBOX} className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path d={CYPRUS_PATH} stroke="rgb(255 255 255 / 0.28)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p) => {
        const [x, y] = projectLonLat(p.longitude, p.latitude);
        const r = p.featured ? 5 : 3;
        return (
          <g key={p.slug}>
            {p.featured && <circle cx={x} cy={y} r={r + 5} fill="var(--color-brand-bright)" opacity={0.16} />}
            <circle cx={x} cy={y} r={r} fill="var(--color-brand-bright)" opacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
}
