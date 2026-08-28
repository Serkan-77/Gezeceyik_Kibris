// lib/leafletIcons.ts
// Leaflet's default marker icon URLs are computed from the bundler's asset
// pipeline, which breaks under Next.js. Point them at the static PNGs in
// public/leaflet/ instead. Shared by every Leaflet map component.

import L from 'leaflet';

export function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  });
}
