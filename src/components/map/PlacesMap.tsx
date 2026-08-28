'use client';
// components/map/PlacesMap.tsx
// Full Leaflet map — on-brand markers only (no rainbow category palette).
// Every pin shares one shape and the brand orange; category is read from a
// small glyph inside the pin, and the marker with an open popup becomes the
// "selected" ink-filled state so it's unmistakable against the rest.
// Only rendered client-side (dynamic import via PlacesMapWrapper).

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/types/place';
import { categoryGlyphSvg } from '@/lib/categoryIcons';
import { tr } from '@/lib/i18n/tr';
import { fixLeafletIcons } from '@/lib/leafletIcons';

function createMarkerIcon(category: Place['category'], selected = false): L.DivIcon {
  const fill = selected ? 'var(--color-ink)' : 'var(--color-brand)';
  const ring = selected ? '0 0 0 3px rgb(232 101 26 / 0.35)' : 'none';
  return L.divIcon({
    html: `<div style="
      width:30px;height:30px;
      background:${fill};
      border:2px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(26,26,26,0.28), ${ring};
      display:flex;align-items:center;justify-content:center;
    ">
      <span style="transform:rotate(45deg);display:flex">${categoryGlyphSvg(category)}</span>
    </div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
      maxZoom: 19,
    }).addTo(map);

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      const defaultIcon = createMarkerIcon(place.category, false);
      const selectedIcon = createMarkerIcon(place.category, true);
      const marker = L.marker([place.latitude, place.longitude], { icon: defaultIcon });

      const admissionStr = place.admission?.isFree
        ? `<span style="color:var(--color-success);font-weight:600">${tr.place.free}</span>`
        : place.admission?.adultPrice !== undefined
        ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
        : '';

      const popup = L.popup({ maxWidth: 240, className: 'kktc-popup', closeButton: true }).setContent(`
        <div style="font-family:var(--font-sans);min-width:180px">
          <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-subtle);margin:0 0 4px">
            ${tr.categories[place.category]}
          </p>
          <h3 style="margin:0 0 2px;font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--color-strong);line-height:1.25">
            ${place.name}
          </h3>
          <p style="margin:0 0 6px;font-size:12px;color:var(--color-muted)">${place.city}</p>
          ${admissionStr ? `<p style="font-size:12px;margin:0 0 8px;color:var(--color-muted)">${admissionStr}</p>` : ''}
          <a href="/places/${place.slug}"
            style="display:inline-block;background:var(--color-brand);color:white;font-size:12px;font-weight:600;
            padding:6px 12px;border-radius:4px;text-decoration:none">
            ${tr.place.viewDetails} &rarr;
          </a>
        </div>
      `);

      marker.bindPopup(popup);
      marker.on('popupopen', () => marker.setIcon(selectedIcon));
      marker.on('popupclose', () => marker.setIcon(defaultIcon));
      marker.addTo(map);
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
      role="application"
      aria-roledescription="harita"
      aria-label="Kuzey Kıbrıs interaktif haritası — yer listesi haritanın altında da mevcuttur"
    />
  );
}
