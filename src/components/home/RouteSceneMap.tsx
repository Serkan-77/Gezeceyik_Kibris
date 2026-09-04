'use client';
// components/home/RouteSceneMap.tsx
// The real payoff of Scene 5 — real stop coordinates, connected by the
// site's one honest route-line device: an abstract dashed connector,
// never a road-following line. There is no real driving-geometry engine
// behind this product, so the line never claims more precision than a
// straight-line relationship between two real points (see distance.ts).
// Each stop is labeled directly on the map (a permanent Leaflet tooltip,
// custom-styled — not a click-to-open popup) rather than in a separate
// list, so sequence and geography read in one glance.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from '@/lib/leafletIcons';

export interface RouteSceneStop {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  arrivalTime: string;
}

interface RouteSceneMapProps {
  stops: RouteSceneStop[];
}

function stopIcon(order: number): L.DivIcon {
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:26px;height:26px;border-radius:9999px;
      background:var(--color-ink);border:2.5px solid white;
      box-shadow:0 3px 8px rgba(23,25,28,0.35);
      display:flex;align-items:center;justify-content:center;
      font:700 11px var(--font-sans);color:white;
      animation-delay:${order * 90}ms;
    ">${order}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function RouteSceneMap({ stops }: RouteSceneMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || stops.length < 2) return;
    fixLeafletIcons();

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: !prefersReducedMotion,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    const points: L.LatLngExpression[] = stops.map((s) => [s.lat, s.lng]);

    const line = L.polyline(points, {
      color: 'var(--color-brand)',
      weight: 3,
      opacity: 0,
      dashArray: '1 10',
      lineCap: 'round',
    }).addTo(map);
    requestAnimationFrame(() => line.setStyle({ opacity: 0.9 }));

    stops.forEach((stop, i) => {
      L.marker([stop.lat, stop.lng], { icon: stopIcon(i + 1) })
        .addTo(map)
        .bindTooltip(`<strong>${stop.name}</strong><br/><span style="opacity:.65">${stop.arrivalTime}</span>`, {
          permanent: true,
          direction: 'right',
          offset: [10, 0],
          className: 'route-scene-tooltip',
        });
    });

    map.fitBounds(L.latLngBounds(points), { padding: [56, 44] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`Örnek rota haritası: ${stops.map((s) => s.name).join(', ')}`}
    />
  );
}
