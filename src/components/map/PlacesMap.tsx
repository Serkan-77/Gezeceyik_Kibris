'use client';
// components/map/PlacesMap.tsx
// Full Leaflet map — the geographic instrument (Phase 5). Marker language
// is deliberately minimal: one shared dot communicates LOCATION, not
// category. State priority is strict and never stacks: route-added (a
// numeral replaces the dot entirely) > selected (ink fill + halo) >
// favorite (a quiet ring) > default (a small blue dot). Selecting a
// marker opens a custom-styled preview — Leaflet's own Popup positioning/
// autopan is kept (it's the right tool for anchoring to a moving map),
// but every bit of its default chrome is stripped and rebuilt as the
// site's own editorial language (see .harita-preview in globals.css).
//
// Clustering (leaflet.markercluster) exists because the dataset is dense
// enough that unclustered markers overlap heavily at the default zoom.
//
// Selection is shared with a results list one level up (HaritaExplorer):
// clicking a marker reports its slug via onSelect; the parent driving
// `selectedSlug` back in (e.g. a list-row click) is handled here by flying
// through the cluster group via zoomToShowLayer, which correctly zooms out
// of a cluster to reveal an individual marker before opening its preview.
//
// Only rendered client-side (dynamic import via PlacesMapWrapper).

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { Place } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { fixLeafletIcons } from '@/lib/leafletIcons';
import { isImageRepresentative } from '@/lib/format';
import { DAY_KEYS } from '@/hooks/useTodayKey';

type MarkerState = 'default' | 'favorite' | 'selected';

function dotIcon(state: MarkerState): L.DivIcon {
  if (state === 'selected') {
    return L.divIcon({
      html: `<div style="
        width:18px;height:18px;border-radius:9999px;
        background:var(--color-ink);border:2px solid white;
        box-shadow:0 0 0 5px rgb(3 137 190 / 0.28), 0 2px 6px rgb(23 25 28 / 0.35);
      "></div>`,
      className: '',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  }
  if (state === 'favorite') {
    return L.divIcon({
      html: `<div style="
        width:10px;height:10px;border-radius:9999px;
        background:var(--color-brand);border:1.5px solid white;
        box-shadow:0 0 0 2.5px var(--color-brand);
      "></div>`,
      className: '',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -6],
    });
  }
  return L.divIcon({
    html: `<div style="
      width:10px;height:10px;border-radius:9999px;
      background:var(--color-brand);border:1.5px solid white;
      box-shadow:0 1px 3px rgb(23 25 28 / 0.35);
    "></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -6],
  });
}

function routeIcon(order: number): L.DivIcon {
  return L.divIcon({
    html: `<div data-marker-enter style="
      width:24px;height:24px;border-radius:9999px;
      background:var(--color-ink);border:2px solid white;
      box-shadow:0 2px 6px rgb(23 25 28 / 0.35);
      display:flex;align-items:center;justify-content:center;
      font:700 11px var(--font-sans);color:white;
    ">${order}</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

/** Soft translucent mass, not a hard badge — "a gathering of points." */
function clusterIcon(count: number): L.DivIcon {
  const size = count < 10 ? 34 : count < 30 ? 42 : 50;
  const fontSize = count < 10 ? 12 : count < 30 ? 13 : 14;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:rgb(3 137 190 / 0.22);border:1.5px solid rgb(3 137 190 / 0.5);
      display:flex;align-items:center;justify-content:center;
      font:700 ${fontSize}px var(--font-mono);color:var(--color-coastal, var(--color-brand-strong));
    ">${count}</div>`,
    className: '',
    iconSize: [size, size],
  });
}

function buildPreviewNode(
  place: Place,
  opts: {
    isFavorite: boolean;
    isRouteAdded: boolean;
    onToggleFavorite: () => void;
    onToggleRoute: () => void;
  }
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'harita-preview-content';

  const representative = isImageRepresentative(place.verificationStatus);
  const todayKey = DAY_KEYS[new Date().getDay()];
  const todayVal = place.openingHours?.[todayKey];
  const admissionStr = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
    : null;

  root.innerHTML = `
    ${
      place.image
        ? `<div class="harita-preview-photo">
             <img src="${place.image}" alt="" />
             ${representative ? '<span class="harita-preview-tag">Temsili görsel</span>' : ''}
           </div>`
        : ''
    }
    <p class="harita-preview-meta">${tr.categories[place.category]} · ${place.city}</p>
    <p class="harita-preview-name">${place.name}</p>
    ${
      todayVal !== undefined
        ? `<p class="harita-preview-fact ${todayVal ? 'is-open' : ''}">${todayVal === null ? tr.place.closedToday : `${tr.place.openToday} · ${todayVal}`}</p>`
        : admissionStr
        ? `<p class="harita-preview-fact">${admissionStr}</p>`
        : ''
    }
    <div class="harita-preview-actions">
      <a href="/places/${place.slug}" class="harita-preview-link">${tr.place.viewDetails} →</a>
      <span class="harita-preview-buttons">
        <button type="button" data-action="favorite" aria-pressed="${opts.isFavorite}">${opts.isFavorite ? '♥' : '♡'}</button>
        <button type="button" data-action="route" aria-pressed="${opts.isRouteAdded}">${opts.isRouteAdded ? '✓ Rotanda' : '+ Rotama ekle'}</button>
      </span>
    </div>
  `;

  root.querySelector('[data-action="favorite"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    opts.onToggleFavorite();
  });
  root.querySelector('[data-action="route"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    opts.onToggleRoute();
  });

  return root;
}

interface PlacesMapProps {
  /** Full, stable place list — markers are built once from this and never recreated. */
  places: Place[];
  /** Slugs currently allowed to show, post-filter. Toggling membership is cheap; markers aren't rebuilt. */
  visibleSlugs: Set<string>;
  selectedSlug?: string | null;
  onSelect?: (slug: string | null) => void;
  onUserMovedBounds?: (bounds: L.LatLngBounds) => void;
  visible?: boolean;
  favoriteSlugs?: Set<string>;
  /** Ordered — the order places were added to the route, for numbering. */
  routeSlugs?: string[];
  onToggleFavorite?: (slug: string) => void;
  onToggleRoute?: (slug: string) => void;
}

const KKTC_CENTER: [number, number] = [35.25, 33.55];
const KKTC_ZOOM = 10;

type Basemap = 'street' | 'satellite';

const BASEMAPS: Record<Basemap, { url: string; attribution: string; maxZoom: number }> = {
  street: {
    // CARTO Voyager — a warm, muted basemap (not raw OSM's saturated
    // green/orange default) so the map reads as this product's own
    // surface, not a generic developer-tool embed.
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
};

export default function PlacesMap({
  places,
  visibleSlugs,
  selectedSlug,
  onSelect,
  onUserMovedBounds,
  visible = true,
  favoriteSlugs,
  routeSlugs,
  onToggleFavorite,
  onToggleRoute,
}: PlacesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemap, setBasemap] = useState<Basemap>('street');
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLineRef = useRef<L.Polyline | null>(null);
  const openSlugRef = useRef<string | null>(null);
  const prevSelectedRef = useRef<string | null | undefined>(undefined);
  const programmaticMoveRef = useRef(true);

  const onSelectRef = useRef(onSelect);
  const onUserMovedBoundsRef = useRef(onUserMovedBounds);
  const favoriteSlugsRef = useRef(favoriteSlugs);
  const routeSlugsRef = useRef(routeSlugs);
  const onToggleFavoriteRef = useRef(onToggleFavorite);
  const onToggleRouteRef = useRef(onToggleRoute);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onUserMovedBoundsRef.current = onUserMovedBounds; }, [onUserMovedBounds]);
  useEffect(() => { favoriteSlugsRef.current = favoriteSlugs; }, [favoriteSlugs]);
  useEffect(() => { routeSlugsRef.current = routeSlugs; }, [routeSlugs]);
  useEffect(() => { onToggleFavoriteRef.current = onToggleFavorite; }, [onToggleFavorite]);
  useEffect(() => { onToggleRouteRef.current = onToggleRoute; }, [onToggleRoute]);

  /** Recompute a marker's icon from current state priority: route > selected > favorite > default. */
  function refreshMarkerIcon(slug: string) {
    const marker = markersRef.current.get(slug);
    if (!marker) return;
    const routeIdx = routeSlugsRef.current?.indexOf(slug) ?? -1;
    if (routeIdx >= 0) {
      marker.setIcon(routeIcon(routeIdx + 1));
      return;
    }
    if (openSlugRef.current === slug) {
      marker.setIcon(dotIcon('selected'));
      return;
    }
    if (favoriteSlugsRef.current?.has(slug)) {
      marker.setIcon(dotIcon('favorite'));
      return;
    }
    marker.setIcon(dotIcon('default'));
  }

  // Build the map + every marker once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    fixLeafletIcons();

    const markers = markersRef.current;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const map = L.map(containerRef.current, {
      center: KKTC_CENTER,
      zoom: KKTC_ZOOM,
      scrollWheelZoom: true,
      zoomAnimation: !prefersReducedMotion,
      markerZoomAnimation: !prefersReducedMotion,
      fadeAnimation: !prefersReducedMotion,
      zoomControl: false,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(BASEMAPS.street.url, {
      attribution: BASEMAPS.street.attribution,
      maxZoom: BASEMAPS.street.maxZoom,
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      iconCreateFunction: (c) => clusterIcon(c.getChildCount()),
    });

    places.forEach((place) => {
      if (
        typeof place.latitude !== 'number' ||
        typeof place.longitude !== 'number' ||
        !Number.isFinite(place.latitude) ||
        !Number.isFinite(place.longitude)
      ) {
        return; // no valid coordinates — stays list-only, never crashes the map
      }

      const marker = L.marker([place.latitude, place.longitude], { icon: dotIcon('default') });

      marker.bindTooltip(place.name, { direction: 'top', offset: [0, -8], className: 'harita-hover-tag', opacity: 1 });

      // Local optimistic mirror of favorite/route state for this one card —
      // flips synchronously on tap rather than waiting on the parent's async
      // state round-trip (toggle -> setState -> effect -> ref), which is too
      // slow to feel like feedback. The real state (refs) still drives the
      // marker icon itself and both stay in sync (a toggle is deterministic).
      let previewFavorite = favoriteSlugsRef.current?.has(place.slug) ?? false;
      let previewRouteAdded = (routeSlugsRef.current?.indexOf(place.slug) ?? -1) >= 0;

      function renderPreview() {
        const node = buildPreviewNode(place, {
          isFavorite: previewFavorite,
          isRouteAdded: previewRouteAdded,
          onToggleFavorite: () => {
            previewFavorite = !previewFavorite;
            onToggleFavoriteRef.current?.(place.slug);
            renderPreview();
          },
          onToggleRoute: () => {
            previewRouteAdded = !previewRouteAdded;
            onToggleRouteRef.current?.(place.slug);
            renderPreview();
          },
        });
        if (marker.isPopupOpen()) marker.setPopupContent(node);
        else marker.bindPopup(node, { maxWidth: 260, className: 'harita-preview', closeButton: true, autoPanPadding: [24, 24] });
      }

      marker.on('click', () => {
        previewFavorite = favoriteSlugsRef.current?.has(place.slug) ?? false;
        previewRouteAdded = (routeSlugsRef.current?.indexOf(place.slug) ?? -1) >= 0;
        renderPreview();
        marker.openPopup();
      });

      marker.on('popupopen', () => {
        openSlugRef.current = place.slug;
        prevSelectedRef.current = place.slug;
        refreshMarkerIcon(place.slug);
        onSelectRef.current?.(place.slug);
      });
      marker.on('popupclose', () => {
        if (openSlugRef.current === place.slug) {
          openSlugRef.current = null;
          prevSelectedRef.current = null;
          refreshMarkerIcon(place.slug);
          onSelectRef.current?.(null);
        }
      });

      markers.set(place.slug, marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;
    mapRef.current = map;

    map.on('moveend', () => {
      if (programmaticMoveRef.current) {
        programmaticMoveRef.current = false;
        return;
      }
      onUserMovedBoundsRef.current?.(map.getBounds());
    });

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markers.clear();
    };
  }, [places]);

  // Toggle which markers are in the cluster group. Cheap membership change.
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    const toShow: L.Marker[] = [];
    visibleSlugs.forEach((slug) => {
      const marker = markersRef.current.get(slug);
      if (marker) toShow.push(marker);
    });
    cluster.addLayers(toShow);
  }, [visibleSlugs]);

  // Favorite state changed — refresh icons for anything not selected/route-added.
  useEffect(() => {
    places.forEach((place) => refreshMarkerIcon(place.slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteSlugs]);

  // Route selection changed — refresh numbered icons and redraw the honest,
  // explicitly abstract connector (never implies real road geometry).
  useEffect(() => {
    const map = mapRef.current;
    places.forEach((place) => refreshMarkerIcon(place.slug));

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    if (map && routeSlugs && routeSlugs.length >= 2) {
      const points = routeSlugs
        .map((slug) => places.find((p) => p.slug === slug))
        .filter((p): p is Place => Boolean(p))
        .map((p): L.LatLngExpression => [p.latitude, p.longitude]);
      const line = L.polyline(points, {
        color: 'var(--color-brand)',
        weight: 2.5,
        opacity: 0.85,
        dashArray: '1 9',
        lineCap: 'round',
      }).addTo(map);
      routeLineRef.current = line;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlugs]);

  // Parent-driven selection (e.g. a results-list row click): fly/zoom to the
  // marker through the cluster group so it un-clusters correctly, then open
  // its preview.
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    if (selectedSlug === prevSelectedRef.current) return;
    prevSelectedRef.current = selectedSlug ?? null;

    if (!selectedSlug) {
      if (openSlugRef.current) {
        markersRef.current.get(openSlugRef.current)?.closePopup();
      }
      return;
    }
    const marker = markersRef.current.get(selectedSlug);
    if (!marker || marker.isPopupOpen()) return;

    programmaticMoveRef.current = true;
    cluster.zoomToShowLayer(marker, () => {
      marker.fire('click');
    });
  }, [selectedSlug]);

  useEffect(() => {
    if (visible) mapRef.current?.invalidateSize();
  }, [visible]);

  const isFirstBasemapRender = useRef(true);
  useEffect(() => {
    if (isFirstBasemapRender.current) {
      isFirstBasemapRender.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const { url, attribution, maxZoom } = BASEMAPS[basemap];
    tileLayerRef.current = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
  }, [basemap]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
        role="application"
        aria-roledescription="harita"
        aria-label="Kuzey Kıbrıs interaktif haritası, sonuç listesi haritanın yanında/altında da mevcuttur"
      />
      <div className="absolute left-3 top-3 z-[var(--z-map-controls)] flex items-center gap-3 text-xs font-medium">
        {(['street', 'satellite'] as const).map((mode, i) => (
          <span key={mode} className="flex items-center gap-3">
            {i > 0 && <span className="h-3 w-px bg-line" aria-hidden="true" />}
            <button
              type="button"
              onClick={() => setBasemap(mode)}
              className={`pb-0.5 transition-colors ${
                basemap === mode ? 'border-b border-brand text-brand' : 'border-b border-transparent text-strong/80 hover:text-strong'
              }`}
              style={{ textShadow: '0 1px 2px rgb(255 255 255 / 0.6)' }}
            >
              {mode === 'street' ? 'Harita' : 'Uydu'}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
