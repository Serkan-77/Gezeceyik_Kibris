// lib/categoryPage.ts
// Shared helper for building category landing pages.
// Each category page calls this to get data + metadata config.

import { Category } from '@/types/place';

export interface CategoryPageConfig {
  category: Category;
  title: string;
  heading: string;
  subtitle: string;
  metaDescription: string;
}

const configs: Record<string, CategoryPageConfig> = {
  museums: {
    category: 'Museum',
    title: 'Museums in Cyprus — Opening Hours, Prices & Visitor Guide',
    heading: 'Museums in Cyprus',
    subtitle:
      'Explore world-class archaeological, art, and history museums across all six regions of Cyprus — with opening hours, entrance fees, and visitor information.',
    metaDescription:
      'Find the best museums in Cyprus — archaeological collections, Byzantine art, medieval history, and more. Opening hours, ticket prices, and directions.',
  },
  castles: {
    category: 'Castle',
    title: 'Castles in Cyprus — History, Opening Hours & Visitor Guide',
    heading: 'Castles in Cyprus',
    subtitle:
      'Discover medieval fortresses, Crusader strongholds, and Byzantine castles across Cyprus — from Kyrenia\'s harbour fortress to the Limassol Medieval Castle.',
    metaDescription:
      'Visit the castles of Cyprus — Kyrenia Castle, Limassol Medieval Castle, Kolossi, and more. Opening hours, entrance fees, and visitor information.',
  },
  'historical-places': {
    category: 'Historical Place',
    title: 'Historical Places in Cyprus — Visitor Guide',
    heading: 'Historical places in Cyprus',
    subtitle:
      'Abbeys, ancient sites, and places where centuries of Cypriot history are written into stone — from Bellapais Abbey to medieval old towns.',
    metaDescription:
      'Discover the historical places of Cyprus — Gothic abbeys, Byzantine ruins, and sites spanning 10,000 years of history.',
  },
  beaches: {
    category: 'Beach',
    title: 'Beaches in Cyprus — Guide to the Best Coastal Spots',
    heading: 'Beaches in Cyprus',
    subtitle:
      'Crystal-clear turquoise water, fine white sand, and sheltered coves — discover the best beaches across Cyprus and the Famagusta coast.',
    metaDescription:
      'Explore the best beaches in Cyprus — Fig Tree Bay, Nissi Beach, and more. Water sports, accessibility info, and what to expect at each location.',
  },
};

export function getCategoryPageConfig(path: string): CategoryPageConfig | undefined {
  return configs[path];
}
