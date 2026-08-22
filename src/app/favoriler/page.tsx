// app/favoriler/page.tsx — Favorilerim (/favoriler)
// Server wrapper with metadata export; renders client component.

import { Metadata } from 'next';
import { FavorilerClient } from '@/components/pages/FavorilerClient';

export const metadata: Metadata = {
  title: 'Favorilerim — Kuzey Kıbrıs Discovery',
  description: 'Kaydettiğiniz Kuzey Kıbrıs yerleri.',
};

export default function FavorilerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-[#f5f2ee] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Favorilerim
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kaydettiğim Yerler
        </h1>
        <p className="mt-2 max-w-2xl text-[#6b7280]">
          Favorilerinize eklediğiniz Kuzey Kıbrıs yerleri.
        </p>
      </header>
      <FavorilerClient />
    </div>
  );
}
