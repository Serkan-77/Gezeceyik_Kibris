// app/harita/page.tsx — Harita (/harita)
// Server Component — renders SSR-safe Leaflet map wrapper.

import { Metadata } from 'next';
import { getAllPlaces } from '@/lib/places';
import { PlacesMapWrapper } from '@/components/map/PlacesMapWrapper';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs Haritası — Tüm Yerleri Haritada Keşfet',
  description:
    'Kuzey Kıbrıs\'taki müze, kale, plaj ve tarihi yerleri interaktif haritada görün. Konumunuza göre sıralayın.',
  openGraph: {
    title: 'Kuzey Kıbrıs Haritası | Kuzey Kıbrıs Discovery',
    description: 'KKTC\'deki tüm gezilecek yerleri interaktif haritada keşfedin.',
  },
};

export default function HaritaPage() {
  const places = getAllPlaces();

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Harita
        </p>
        <h1 className="font-display text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
          Kuzey Kıbrıs Keşif Haritası
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          {places.length} yer — bölge veya kategori seçerek filtreleyin.
        </p>
      </div>

      {/* Full-height map */}
      <div className="h-[calc(100vh-14rem)] min-h-[500px] w-full">
        <PlacesMapWrapper places={places} />
      </div>
    </div>
  );
}
