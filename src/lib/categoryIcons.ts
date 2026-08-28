// lib/categoryIcons.ts
// Category glyph path data for the map's marker pins. Leaflet's divIcon
// needs a raw HTML string (React components can't render there), so these
// are plain SVG path strings — drawn in the same stroke-icon language as
// CategoryGrid's icons so the map doesn't introduce a second visual system.

import { Category } from '@/types/place';

const CATEGORY_ICON_PATHS: Record<Category, string[]> = {
  Museum: ['M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z'],
  Castle: ['M3 21V9l9-6 9 6v12M9 21v-6h6v6M3 9h18M9 9V3m6 6V3'],
  'Archaeological Site': [
    'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  ],
  Monastery: [
    'M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z',
  ],
  Church: ['M12 2v4m-2-2h4M12 22v-9m-5 9h10M9 13h6v9H9v-9zM12 6l4 4H8l4-4z'],
  Beach: [
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  ],
  'Natural Attraction': ['M5 3l7 14 7-14M5 3l7 7 7-7'],
  'Historical Place': ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
  Viewpoint: [
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  ],
  'Cultural Site': [
    'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
  ],
  'Family Activity': ['M12 2l2.6 6.6L21 9.3l-5 4.6 1.4 7.1L12 17.6 6.6 21l1.4-7.1-5-4.6 6.4-.7L12 2z'],
};

/** Inline-SVG string for Leaflet's divIcon (which needs raw HTML, not React). */
export function categoryGlyphSvg(category: Category, color = 'white'): string {
  const paths = CATEGORY_ICON_PATHS[category]
    .map((d) => `<path d="${d}" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`)
    .join('');
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">${paths}</svg>`;
}
