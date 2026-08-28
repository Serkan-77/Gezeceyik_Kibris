'use client';
// components/map/PlaceMiniMap.tsx
// Single-marker Leaflet map for a place detail page — same on-brand pin as
// the main map, not Leaflet's default blue marker.
// Only rendered client-side (dynamic import via PlaceMiniMapWrapper).

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from '@/lib/leafletIcons';

const pinIcon = L.divIcon({
  html: `<div style="
    width:26px;height:26px;
    background:var(--color-brand);
    border:2px solid white;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(26,26,26,0.28);
  "></div>`,
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

interface PlaceMiniMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const ZOOM = 14;

export default function PlaceMiniMap({ latitude, longitude, name }: PlaceMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    fixLeafletIcons();

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: ZOOM,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
      maxZoom: 19,
    }).addTo(map);

    L.marker([latitude, longitude], { icon: pinIcon }).addTo(map).bindPopup(name);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, name]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`${name} konum haritası`}
    />
  );
}
