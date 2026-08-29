// app/gezi-planla/page.tsx — Gezi Planla (/gezi-planla)
// Server Component wrapper — actual wizard is client-side. Container stays
// full-width so the itinerary result (and its route map) has room; the
// wizard card itself constrains to a narrow, focused column internally.

import { Metadata } from 'next';
import { PlannerWizardClient } from '@/components/trip/PlannerWizardClient';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Container } from '@/components/ui/Container';
import { getAllCategories, getAllPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Gezi Planla — Kuzey Kıbrıs Discovery',
  description:
    'Kuzey Kıbrıs için kişiselleştirilmiş çok günlük gezi programı oluşturun. Konaklama yerinizi, sürenizi ve ilgi alanlarınızı girin.',
  openGraph: {
    title: 'Gezi Planla | Kuzey Kıbrıs Discovery',
    description: 'Kuzey Kıbrıs için akıllı, optimize edilmiş gezi programı.',
  },
};

export const revalidate = 3600;

export default async function GeziPlanlaPage() {
  const [categories, places] = await Promise.all([getAllCategories(), getAllPlaces()]);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 text-center">
        <SectionHeader
          as="h1"
          size="page"
          align="center"
          eyebrow="Gezi Planlayıcı"
          title="Kuzey Kıbrıs Gezi Planı"
          subtitle="Bilgilerinizi girin, sizin için optimize edilmiş bir program oluşturalım."
        />
      </div>

      <PlannerWizardClient categories={categories} places={places} />
    </Container>
  );
}
