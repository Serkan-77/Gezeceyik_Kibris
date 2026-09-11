'use client';
// components/route/RouteBuilderMap.tsx
// Shows the manually-built route's stops on the real map, numbered in
// order. Modeled on components/trip/RouteMap.tsx's numbered-marker +
// dashed-connector device, but with no accommodation/start marker (a
// manual route has no accommodation concept) and an explicit "abstract
// connector" honesty note — see Section 5 of the route-builder spec: this
// app has no real road-routing geometry, so the dashed line must never
// read as a driving route, only as a stop-order connector.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteStop } from '@/types/route';
import { fixLeafletIcons } from '@/lib/leafletIcons';

// Fixed outer box at the focused size — the unfocused state is drawn at
// full size and visually shrunk with transform:scale, not by animating
// width/height, so the 150ms transition is a compositor-only transform
// instead of a relayout on every focus toggle.
const STOP_ICON_SIZE = 32;
const STOP_ICON_UNFOCUSED_SCALE = 26 / STOP_ICON_SIZE;

function stopIcon(order: number, focused: boolean): L.DivIcon {
  // A white-ringed pin over map tiles, not page chrome — fixed ink/brand
  // hexes (not the var() tokens, which flip near-white/bright in dark
  // mode) so it doesn't wash out against its own white ring/number.
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:${STOP_ICON_SIZE}px;height:${STOP_ICON_SIZE}px;border-radius:9999px;
      background:${focused ? '#141414' : '#1D5C82'};border:2.5px solid white;
      box-shadow:0 3px 8px rgba(23,25,28,0.3)${focused ? ', 0 0 0 4px rgba(29,92,130,0.25)' : ''};
      display:flex;align-items:center;justify-content:center;
      font:700 12px var(--font-sans);color:white;
      transform:scale(${focused ? 1 : STOP_ICON_UNFOCUSED_SCALE});
      transition:transform 150ms;
    ">${order}</div>`,
    className: '',
    iconSize: [STOP_ICON_SIZE, STOP_ICON_SIZE],
    iconAnchor: [STOP_ICON_SIZE / 2, STOP_ICON_SIZE / 2],
  });
}

interface RouteBuilderMapProps {
  stops: RouteStop[];
  focusedSlug?: string | null;
  onSelectStop?: (slug: string) => void;
}

export default function RouteBuilderMap({ stops, focusedSlug, onSelectStop }: RouteBuilderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const lineRef = useRef<L.Polyline | null>(null);
  const onSelectStopRef = useRef(onSelectStop);
  useEffect(() => {
    onSelectStopRef.current = onSelectStop;
  }, [onSelectStop]);

  useEffect(() => {
    if (!containerRef.current) return;
    fixLeafletIcons();

    if (!mapRef.current) {
      const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
    }
    const map = mapRef.current;

    // Rebuild markers/line from scratch on every stop-list change (add/
    // remove/reorder) — simplest correct behavior for a list that's
    // usually under a dozen items.
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();
    lineRef.current?.remove();
    lineRef.current = null;

    if (stops.length === 0) return;

    if (stops.length > 1) {
      const points: L.LatLngExpression[] = stops.map((s): L.LatLngExpression => [s.place.latitude, s.place.longitude]);
      lineRef.current = L.polyline(points, {
        color: 'var(--color-brand)',
        weight: 3,
        opacity: 0.85,
        dashArray: '1 10',
        lineCap: 'round',
      }).addTo(map);
    }

    stops.forEach((stop, i) => {
      const marker = L.marker([stop.place.latitude, stop.place.longitude], { icon: stopIcon(i + 1, stop.place.slug === focusedSlug) });
      marker.bindPopup(`<strong>${i + 1}. ${stop.place.name}</strong>`, { className: 'gk-map-popup' });
      marker.on('click', () => onSelectStopRef.current?.(stop.place.slug));
      marker.addTo(map);
      markersRef.current.set(stop.place.slug, marker);
    });

    const points: L.LatLngExpression[] = stops.map((s): L.LatLngExpression => [s.place.latitude, s.place.longitude]);
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);

  useEffect(() => {
    stops.forEach((stop, i) => {
      markersRef.current.get(stop.place.slug)?.setIcon(stopIcon(i + 1, stop.place.slug === focusedSlug));
    });
  }, [focusedSlug, stops]);

  useEffect(() => {
    const map = mapRef.current;
    return () => {
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`Rota haritası: ${stops.length} durak, sıraya göre numaralandırılmış`}
    />
  );
}
