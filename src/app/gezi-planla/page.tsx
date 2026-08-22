// app/gezi-planla/page.tsx — Gezi Planla (/gezi-planla)
// Server Component wrapper — actual wizard is client-side.

import { Metadata } from 'next';
import { PlannerWizardClient } from '@/components/trip/PlannerWizardClient';
import { getAllPlaces, getAllCategories } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Gezi Planla — Kuzey Kıbrıs Discovery',
  description:
    'Kuzey Kıbrıs için kişiselleştirilmiş çok günlük gezi programı oluşturun. Konaklama yerinizi, sürenizi ve ilgi alanlarınızı girin.',
  openGraph: {
    title: 'Gezi Planla | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs için akıllı, optimize edilmiş gezi programı.',
  },
};

export default function GeziPlanlaPage() {
  const allPlaces = getAllPlaces();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
          Gezi Planlayıcı
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
          Kuzey Kıbrıs Gezi Planı
        </h1>
        <p className="mt-3 text-[#6b7280]">
          Bilgilerinizi girin, sizin için optimize edilmiş bir program oluşturalım.
        </p>
      </header>

      <PlannerWizardClient allPlaces={allPlaces} categories={categories} />
    </div>
  );
}
