// app/harita/page.tsx — Harita (/harita)
// Server Component — fetches places, renders the full-viewport map
// instrument (Phase 5). No hero, no section below: the map is the
// dominant surface from the moment the page loads, not something you
// scroll down to reach.

import { Metadata } from 'next';
import { getAllPlaces, getAllCategories, getAllRegions } from '@/lib/places';
import { HaritaExplorer } from '@/components/map/HaritaExplorer';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Haritası: Tüm Yerleri Haritada Keşfet',
  description:
    'Kuzey Kıbrıs\'taki müze, kale, plaj ve tarihi yerleri interaktif haritada görün. Kategoriye ve bölgeye göre filtreleyin.',
  openGraph: {
    title: 'Kuzey Kıbrıs Haritası | Gezeceyik Kıbrıs',
    description: 'KKTC\'deki tüm gezilecek yerleri interaktif haritada keşfedin.',
  },
};

export const revalidate = 3600;

export default async function HaritaPage() {
  const [places, categories, regions] = await Promise.all([
    getAllPlaces(),
    getAllCategories(),
    getAllRegions(),
  ]);

  return <HaritaExplorer places={places} categories={categories} regions={regions} />;
}
