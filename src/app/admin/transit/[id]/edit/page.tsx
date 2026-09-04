// app/admin/transit/[id]/edit/page.tsx — /admin/transit/[id]/edit

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as transitRouteRepository from '@/lib/repositories/transitRouteRepository';
import { TransitRouteInput } from '@/lib/db/transitRouteSchema';
import { TransitRouteForm } from '@/components/admin/TransitRouteForm';
import { updateTransitRouteAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Otobüs Hattını Düzenle: Admin',
  robots: { index: false, follow: false },
};

export default async function EditTransitRoutePage({ params }: Props) {
  const { id } = await params;
  const route = await transitRouteRepository.findById(id);
  if (!route) notFound();

  const boundAction = updateTransitRouteAction.bind(null, id);

  // `route` is a plain Supabase row already — see the same note in
  // app/admin/places/[slug]/edit/page.tsx.
  const formInput: TransitRouteInput = JSON.parse(JSON.stringify(route));

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">
        {route.fromRegion} → {route.toRegion} Düzenle
      </h1>
      <TransitRouteForm route={formInput} action={boundAction} />
    </Container>
  );
}
