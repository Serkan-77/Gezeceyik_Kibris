// app/gezi-planla/page.tsx — Gezi Planla (/gezi-planla)
// Server Component wrapper — the planner experience itself is client-side
// (Phase 6: a living map + a growing sentence, not a boxed wizard).

import { Metadata } from 'next';
import { PlannerExperience } from '@/components/trip/PlannerExperience';
import { Container } from '@/components/ui/Container';
import { getAllCategories, getAllPlaces } from '@/lib/places';
import { getActiveTransitRoutes } from '@/lib/transitRoutes';

export const metadata: Metadata = {
  title: 'Gezi Planla: Gezeceyik Kıbrıs',
  description:
    'Kuzey Kıbrıs için kişiselleştirilmiş çok günlük gezi programı oluşturun. Konaklama yerinizi, sürenizi ve ilgi alanlarınızı girin.',
  openGraph: {
    title: 'Gezi Planla | Gezeceyik Kıbrıs',
    description: 'Kuzey Kıbrıs için akıllı, optimize edilmiş gezi programı.',
  },
};

export const revalidate = 3600;

export default async function GeziPlanlaPage() {
  const [categories, places, transitRoutes] = await Promise.all([
    getAllCategories(),
    getAllPlaces(),
    getActiveTransitRoutes(),
  ]);

  return (
    <Container className="py-10 sm:py-14">
      <PlannerExperience categories={categories} places={places} transitRoutes={transitRoutes} />
    </Container>
  );
}
