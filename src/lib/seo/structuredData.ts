// lib/seo/structuredData.ts
// JSON-LD builders. Every field here is either a site-wide constant (name,
// url, logo — all real, existing assets) or read directly from a real
// place record. Nothing is invented: no fabricated address components, no
// price, no rating that isn't already visible on the page. See
// components/seo/JsonLd.tsx for how these get rendered.

import { Place } from '@/types/place';
import { classifyDayHours } from '@/lib/format/openingHours';
import { SITE_URL } from '@/lib/config';

const SCHEMA_DAY_NAMES: Record<string, string> = {
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
};
const WEEK_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gezeceyik Kıbrıs',
    url: SITE_URL,
    inLanguage: 'tr',
    // Real, working target — /places already supports ?q= (see
    // DiscoveryExplorer.tsx). Not a guarantee of a Google Sitelinks
    // Searchbox rich result, just an accurate description of real
    // on-site behavior.
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/places?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gezeceyik Kıbrıs',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`, // real existing asset (512×512) — see src/app/icon.png
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Only returns a spec when EVERY day of the week is safely classified as
 * either a confirmed time range or explicitly closed (reusing the exact
 * same lib/format/openingHours.ts logic the visible weekly-hours widget
 * uses) — a partially-known or free-text schedule is omitted entirely
 * rather than emitting a half-guessed one.
 */
function openingHoursSpecification(place: Place): object[] | undefined {
  if (!place.openingHours) return undefined;
  const spec: object[] = [];

  for (const day of WEEK_ORDER) {
    const classification = classifyDayHours(place.openingHours[day]);
    if (classification.kind === 'unknown' || classification.kind === 'unstructured') return undefined;
    if (classification.kind === 'confirmed') {
      const [opens, closes] = classification.raw!.split(/[-–—]/).map((s) => s.trim());
      if (!opens || !closes) return undefined;
      spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: SCHEMA_DAY_NAMES[day], opens, closes });
    }
    // 'closed' days are simply omitted from the spec — standard practice, not a gap.
  }

  return spec.length > 0 ? spec : undefined;
}

export interface RatingForSchema {
  average: number | undefined;
  count: number;
}

/**
 * A general-purpose TouristAttraction — deliberately one consistent type
 * across museums/castles/beaches/archaeological sites rather than
 * guessing at more specific (and easy to misapply) schema.org types.
 */
export function touristAttractionSchema(place: Place, rating?: RatingForSchema) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.shortDescription,
    url: `${SITE_URL}/places/${place.slug}`,
    // Plain string, not a structured PostalAddress — schema.org accepts
    // either. A structured PostalAddress would need an addressCountry
    // ISO code, and Northern Cyprus's status is contested (no ISO 3166-1
    // code of its own); guessing one would take a position this app
    // doesn't take anywhere else in its copy. The plain address text is
    // exactly what's already stored and already true.
    address: place.address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.latitude,
      longitude: place.longitude,
    },
  };

  if (place.image) data.image = place.image;
  if (place.admission) data.isAccessibleForFree = place.admission.isFree;

  const hours = openingHoursSpecification(place);
  if (hours) data.openingHoursSpecification = hours;

  // Only when real, visible-on-page votes exist — never fabricated, and
  // must match the average/count the PlaceRatingWidget actually shows.
  if (rating && rating.average !== undefined && rating.count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.average,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}
