// lib/categoryIcons.tsx
// One shared category → icon mapping, reused everywhere a place is
// listed (PlaceCard, DiscoveryRow, HaritaExplorer). Category is read from
// icon + label, never hue — see the "Category" token comment in
// globals.css — so this map is the single source of truth for which
// mark represents which category, instead of each list re-deciding it.

import { ComponentType } from 'react';
import { Category } from '@/types/place';
import {
  CastleIcon,
  WavesIcon,
  ArchIcon,
  ColumnsIcon,
  RuinsIcon,
  MonasteryIcon,
  ChurchIcon,
  LeafIcon,
  PeakIcon,
  GlobeIcon,
  FamilyIcon,
  IconProps,
} from '@/components/ui/icons';

export const CATEGORY_ICONS: Record<Category, ComponentType<IconProps>> = {
  Museum: ColumnsIcon,
  Castle: CastleIcon,
  'Archaeological Site': RuinsIcon,
  Monastery: MonasteryIcon,
  Beach: WavesIcon,
  'Natural Attraction': LeafIcon,
  'Historical Place': ArchIcon,
  Viewpoint: PeakIcon,
  'Cultural Site': GlobeIcon,
  Church: ChurchIcon,
  'Family Activity': FamilyIcon,
};
