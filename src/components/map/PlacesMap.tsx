'use client';
// components/map/PlacesMap.tsx
// Full Leaflet map with Turkish category-colored markers and popups.
// Only rendered client-side (dynamic import via PlacesMapWrapper).

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/types/place';

// Fix Leaflet's default icon path (broken in webpack/Next.js environments)
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function getCategoryColor(category: Place['category']): string {
  const map: Partial<Record<Place['category'], string>> = {
    Museum: '#e8651a',
    Castle: '#7c3aed',
    Beach: '#0284c7',
    'Archaeological Site': '#d97706',
    Monastery: '#16a34a',
    'Historical Place': '#dc2626',
    'Natural Attraction': '#15803d',
    Viewpoint: '#9333ea',
    'Cultural Site': '#d946ef',
  };
  return map[category] ?? '#6b7280';
}

function createMarkerIcon(category: Place['category']): L.DivIcon {
  const color = getCategoryColor(category);
  return L.divIcon({
    html: `<div style="
      width:28px;height:28px;
      background:${color};
      border:2px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

interface PlacesMapProps {
  places: Place[];
}

// KKTC geographic center
const KKTC_CENTER: [number, number] = [35.25, 33.55];
const KKTC_ZOOM = 10;

export default function PlacesMap({ places }: PlacesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    fixLeafletIcons();

    const map = L.map(containerRef.current, {
      center: KKTC_CENTER,
      zoom: KKTC_ZOOM,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
      maxZoom: 19,
    }).addTo(map);

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      const icon = createMarkerIcon(place.category);
      const marker = L.marker([place.latitude, place.longitude], { icon });

      const admissionStr = place.admission?.isFree
        ? '<span style="color:#16a34a;font-weight:600">Ücretsiz Giriş</span>'
        : place.admission?.adultPrice !== undefined
        ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
        : '';

      const popup = L.popup({ maxWidth: 240, className: 'kktc-popup' }).setContent(`
        <div style="font-family:system-ui,sans-serif;min-width:180px">
          <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin:0 0 4px">
            ${place.category}
          </p>
          <h3 style="margin:0 0 2px;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.2">
            ${place.name}
          </h3>
          <p style="margin:0 0 6px;font-size:12px;color:#6b7280">${place.city}</p>
          ${admissionStr ? `<p style="font-size:12px;margin:0 0 8px;color:#4b5563">${admissionStr}</p>` : ''}
          <a href="/places/${place.slug}"
            style="display:inline-block;background:#e8651a;color:white;font-size:12px;font-weight:600;
            padding:6px 12px;border-radius:3px;text-decoration:none">
            Detayları Gör →
          </a>
        </div>
      `);

      marker.bindPopup(popup).addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [places]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-label="Kuzey Kıbrıs interaktif haritası"
    />
  );
}
