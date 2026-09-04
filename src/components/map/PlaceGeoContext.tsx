'use client';
// components/map/PlaceGeoContext.tsx
// Place Detail's geographic section — the place itself as the prominent
// marker, real nearby places (from nearbyPlaceSlugs) as smaller secondary
// markers, at real coordinates. This is what makes "add this to my
// journey" feel natural (Phase 4) — no fake road geometry, just an honest
// view of where this place sits in the region.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from '@/lib/leafletIcons';

export interface GeoContextPoint {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

interface PlaceGeoContextProps {
  place: GeoContextPoint;
  nearby: GeoContextPoint[];
}

function mainIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:30px;height:30px;border-radius:9999px;
      background:var(--color-ink);border:3px solid white;
      box-shadow:0 3px 10px rgba(23,25,28,0.4);
    "></div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function nearbyIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:16px;height:16px;border-radius:9999px;
      background:var(--color-brand);border:2px solid white;
      box-shadow:0 2px 6px rgba(23,25,28,0.3);
    "></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function PlaceGeoContext({ place, nearby }: PlaceGeoContextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    fixLeafletIcons();

    const map = L.map(containerRef.current, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
      maxZoom: 19,
    }).addTo(map);

    L.marker([place.lat, place.lng], { icon: mainIcon() }).addTo(map).bindPopup(`<strong>${place.name}</strong>`);
    nearby.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: nearbyIcon() })
        .addTo(map)
        .bindPopup(`<a href="/places/${p.slug}" style="font-weight:600">${p.name}</a>`);
    });

    const points: L.LatLngExpression[] = [[place.lat, place.lng], ...nearby.map((p): L.LatLngExpression => [p.lat, p.lng])];
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } else {
      map.setView([place.lat, place.lng], 14);
    }
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
      aria-label={`${place.name} ve çevresindeki yerlerin haritası`}
    />
  );
}
