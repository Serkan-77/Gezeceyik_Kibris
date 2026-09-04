'use client';
// components/trip/RouteMap.tsx
// The signature "sightseeing route" visualization (Phase 7, corrected).
// Accommodation is shown as a known reference point in its own marker
// family — it is never connected by a route line, because scheduleDay
// never computes a real travel value for that specific hop (the planner
// builds one continuous nearest-neighbour chain from accommodation, then
// just chunks it into days — day 2+ doesn't restart from accommodation).
// The dashed connector — the site's one honest abstract route-line
// device — only ever spans real consecutive stops, where a real
// distanceToNextKm/travelToNextMin exists. No return-to-accommodation
// leg is ever drawn.
//
// Passive scroll only highlights a stop's marker (no camera movement);
// the camera only recenters on an explicit stop-row click (panToken).

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryDay, AccommodationLocation } from '@/lib/trip-planner/types';
import { fixLeafletIcons } from '@/lib/leafletIcons';

function startIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:28px;height:28px;border-radius:8px;
      background:var(--color-ink);border:2px solid white;
      box-shadow:0 3px 8px rgba(23,25,28,0.35);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 3v18m0-16.5h10l-2 3 2 3H6"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function stopIcon(order: number, focused: boolean): L.DivIcon {
  const size = focused ? 32 : 26;
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${focused ? 'var(--color-ink)' : 'var(--color-brand)'};border:2.5px solid white;
      box-shadow:0 3px 8px rgba(23,25,28,0.3)${focused ? ', 0 0 0 4px rgb(3 137 190 / 0.25)' : ''};
      display:flex;align-items:center;justify-content:center;
      font:700 12px var(--font-sans);color:white;
      animation-delay:${order * 70}ms;
      transition:width 150ms,height 150ms;
    ">${order}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface RouteMapProps {
  day: ItineraryDay;
  accommodation: AccommodationLocation;
  focusedSlug?: string | null;
  onSelectStop?: (slug: string) => void;
  /** Bump to request an explicit camera recenter onto panSlug. */
  panToken?: number;
  panSlug?: string | null;
}

export default function RouteMap({ day, accommodation, focusedSlug, onSelectStop, panToken, panSlug }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectStopRef = useRef(onSelectStop);
  useEffect(() => { onSelectStopRef.current = onSelectStop; }, [onSelectStop]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    fixLeafletIcons();

    const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    if (day.stops.length > 1) {
      const points: L.LatLngExpression[] = day.stops.map((s): L.LatLngExpression => [s.place.latitude, s.place.longitude]);
      const line = L.polyline(points, {
        color: 'var(--color-brand)',
        weight: 3,
        opacity: 0,
        dashArray: '1 10',
        lineCap: 'round',
      }).addTo(map);
      requestAnimationFrame(() => line.setStyle({ opacity: 0.85 }));
    }

    L.marker([accommodation.lat, accommodation.lng], { icon: startIcon() })
      .addTo(map)
      .bindPopup(`<strong>${accommodation.label}</strong><br/><span style="color:var(--color-subtle);font-size:12px">Başlangıç noktası</span>`);

    day.stops.forEach((stop, i) => {
      const marker = L.marker([stop.place.latitude, stop.place.longitude], { icon: stopIcon(i + 1, false) });
      marker.bindPopup(
        `<strong>${i + 1}. ${stop.place.name}</strong><br/><span style="color:var(--color-subtle);font-size:12px">${stop.arrivalTime} – ${stop.departureTime}</span>`
      );
      marker.on('click', () => onSelectStopRef.current?.(stop.place.slug));
      marker.addTo(map);
      markersRef.current.set(stop.place.slug, marker);
    });

    const allPoints: L.LatLngExpression[] = [
      [accommodation.lat, accommodation.lng],
      ...day.stops.map((s): L.LatLngExpression => [s.place.latitude, s.place.longitude]),
    ];
    map.fitBounds(L.latLngBounds(allPoints), { padding: [32, 32] });
    mapRef.current = map;
    const markers = markersRef.current;

    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day.dayNumber]);

  // Passive focus — highlight only, never moves the camera.
  useEffect(() => {
    day.stops.forEach((stop, i) => {
      markersRef.current.get(stop.place.slug)?.setIcon(stopIcon(i + 1, stop.place.slug === focusedSlug));
    });
  }, [focusedSlug, day.stops]);

  // Explicit pan request (a stop row was clicked) — the only camera move.
  useEffect(() => {
    if (!panSlug || !panToken) return;
    const map = mapRef.current;
    const marker = markersRef.current.get(panSlug);
    if (map && marker) {
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 13), { duration: 0.6 });
      marker.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panToken]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`${day.dayNumber}. gün rota haritası: konaklama ayrı gösterilir, ${day.stops.length} durak birbirine bağlıdır`}
    />
  );
}
