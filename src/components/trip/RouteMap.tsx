'use client';
// components/trip/RouteMap.tsx
// The signature "sightseeing route" visualization: accommodation start,
// numbered stops in visit order, connected by a route line that draws
// itself in on mount. On-brand markers only — same visual language as
// PlacesMap, no unrelated hues. Real data only: coordinates, order, and
// distances come straight from the generated ItineraryDay.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryDay, AccommodationLocation } from '@/lib/trip-planner/types';
import { fixLeafletIcons } from '@/lib/leafletIcons';

function startIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:32px;height:32px;border-radius:8px;
      background:var(--color-ink);border:2px solid white;
      box-shadow:0 3px 8px rgba(26,26,26,0.35);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 3v18m0-16.5h10l-2 3 2 3H6"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function stopIcon(order: number): L.DivIcon {
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:28px;height:28px;border-radius:9999px;
      background:var(--color-brand);border:2.5px solid white;
      box-shadow:0 3px 8px rgba(26,26,26,0.3);
      display:flex;align-items:center;justify-content:center;
      font:700 12px var(--font-sans);color:white;
      animation-delay:${order * 70}ms;
    ">${order}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

interface RouteMapProps {
  day: ItineraryDay;
  accommodation: AccommodationLocation;
}

export default function RouteMap({ day, accommodation }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    fixLeafletIcons();

    const points: L.LatLngExpression[] = [
      [accommodation.lat, accommodation.lng],
      ...day.stops.map((s): L.LatLngExpression => [s.place.latitude, s.place.longitude]),
    ];

    const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Route line — fades in once on mount (CSS transition on the SVG path,
    // see .leaflet-overlay-pane path in globals.css; no-ops under reduced motion).
    const line = L.polyline(points, {
      color: 'var(--color-brand)',
      weight: 3,
      opacity: 0,
      dashArray: '1 10',
      lineCap: 'round',
    }).addTo(map);
    requestAnimationFrame(() => line.setStyle({ opacity: 0.85 }));

    L.marker([accommodation.lat, accommodation.lng], { icon: startIcon() })
      .addTo(map)
      .bindPopup(`<strong>${accommodation.label}</strong><br/><span style="color:var(--color-subtle);font-size:12px">Konaklama</span>`);

    day.stops.forEach((stop, i) => {
      L.marker([stop.place.latitude, stop.place.longitude], { icon: stopIcon(i + 1) })
        .addTo(map)
        .bindPopup(
          `<strong>${i + 1}. ${stop.place.name}</strong><br/><span style="color:var(--color-subtle);font-size:12px">${stop.arrivalTime} – ${stop.departureTime}</span>`
        );
    });

    map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day.dayNumber]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`${day.dayNumber}. gün rota haritası: konaklamadan başlayarak ${day.stops.length} durak`}
    />
  );
}
