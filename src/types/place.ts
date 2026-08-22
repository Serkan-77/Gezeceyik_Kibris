// types/place.ts
// Core data model for the Cyprus Discovery platform.
// Every attraction — museum, castle, beach, monastery, viewpoint — is a Place.

export type Region =
  | 'Nicosia'
  | 'Limassol'
  | 'Larnaca'
  | 'Paphos'
  | 'Famagusta'
  | 'Kyrenia';

export type Category =
  | 'Museum'
  | 'Historical Place'
  | 'Castle'
  | 'Archaeological Site'
  | 'Monastery'
  | 'Church'
  | 'Natural Attraction'
  | 'Beach'
  | 'Viewpoint'
  | 'Cultural Site'
  | 'Family Activity';

export type VerificationStatus = 'sample' | 'unverified' | 'verified';

/** Day-keyed opening hours. null = closed that day. Omitted key = unknown. */
export interface OpeningHours {
  monday?: string | null;
  tuesday?: string | null;
  wednesday?: string | null;
  thursday?: string | null;
  friday?: string | null;
  saturday?: string | null;
  sunday?: string | null;
}

export interface Accessibility {
  wheelchairAccessible?: boolean;
  audioGuide?: boolean;
  guidedTours?: boolean;
  notes?: string;
}

export interface Admission {
  isFree: boolean;
  adultPrice?: number; // EUR
  childPrice?: number; // EUR
  currency?: 'EUR';
  notes?: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: Category;
  city: string;
  region: Region;
  /** 1–2 sentences used on cards and in meta descriptions. */
  shortDescription: string;
  /** Full introductory paragraph for the detail page. */
  description: string;
  /** Historical or cultural context. Optional — beaches / viewpoints may omit. */
  history?: string;
  /** Primary image — path relative to /public, e.g. "/images/places/slug.jpg" */
  image: string;
  gallery?: string[];
  /** Optional — open-air sites, beaches, and viewpoints may not have set hours. */
  openingHours?: OpeningHours;
  /** Optional — freely accessible attractions omit this. */
  admission?: Admission;
  phone?: string;
  website?: string;
  address: string;
  latitude: number;
  longitude: number;
  accessibility?: Accessibility;
  /** Approximate visit duration in minutes. */
  estimatedVisitMinutes?: number;
  featured: boolean;
  /** Slugs of nearby attractions shown in the "Nearby Places" section. */
  nearbyPlaceSlugs?: string[];
  /** Link to official or reference source used for this record. */
  sourceUrl?: string;
  /** ISO 8601 date when information was last checked. */
  lastVerifiedAt?: string;
  /**
   * 'sample'     — placeholder data for development. Do NOT display as fact.
   * 'unverified' — sourced from public info but not independently confirmed.
   * 'verified'   — confirmed against official sources.
   */
  verificationStatus: VerificationStatus;
}
