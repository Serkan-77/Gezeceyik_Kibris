// components/graphics/IslandLineArt.tsx
// The site's one recurring line motif: Cyprus's real coastline (see
// lib/geo/cyprusOutline.ts), drawn as a single contour stroke. Reused across
// the hero, the map preview and the history section so the whole homepage
// visually rhymes with "journey" instead of each section inventing its own
// decoration. Never a stand-in for photography — see PhotoTreatment.

import { CYPRUS_PATH, CYPRUS_VIEWBOX, projectLonLat } from '@/lib/geo/cyprusOutline';

export interface IslandMarker {
  lon: number;
  lat: number;
  /** Visually emphasized marker (larger, filled) vs. a quiet dot. */
  emphasis?: boolean;
  label?: string;
}

interface IslandLineArtProps {
  className?: string;
  /** Stroke color — defaults to currentColor so it inherits text color. */
  strokeWidth?: number;
  markers?: IslandMarker[];
  markerColor?: string;
  /** Renders the coordinate-grid hairlines behind the coastline (hero use). */
  showGraticule?: boolean;
}

export function IslandLineArt({
  className,
  strokeWidth = 2.5,
  markers,
  markerColor = 'var(--color-brand)',
  showGraticule = false,
}: IslandLineArtProps) {
  return (
    <svg
      viewBox={CYPRUS_VIEWBOX}
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {showGraticule && (
        <g stroke="currentColor" strokeWidth={1} opacity={0.5}>
          <line x1="0" y1="150.65" x2="1000" y2="150.65" />
          <line x1="0" y1="301.3" x2="1000" y2="301.3" />
          <line x1="0" y1="451.95" x2="1000" y2="451.95" />
          <line x1="250" y1="0" x2="250" y2="602.6" />
          <line x1="500" y1="0" x2="500" y2="602.6" />
          <line x1="750" y1="0" x2="750" y2="602.6" />
        </g>
      )}
      <path d={CYPRUS_PATH} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {markers?.map((m, i) => {
        const [x, y] = projectLonLat(m.lon, m.lat);
        const r = m.emphasis ? 6 : 3.5;
        return (
          <g key={`${m.lon}-${m.lat}-${i}`}>
            <circle cx={x} cy={y} r={r} fill={markerColor} />
            {m.emphasis && <circle cx={x} cy={y} r={r + 5} stroke={markerColor} strokeWidth={1.25} opacity={0.5} />}
          </g>
        );
      })}
    </svg>
  );
}
