// app/admin/curated-routes/[id]/edit/page.tsx — /admin/curated-routes/[id]/edit

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as curatedRouteRepository from '@/lib/repositories/curatedRouteRepository';
import { CuratedRouteInput } from '@/lib/db/curatedRouteSchema';
import { CuratedRouteForm } from '@/components/admin/CuratedRouteForm';
import { updateCuratedRouteAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Hazır Rotayı Düzenle: Admin',
  robots: { index: false, follow: false },
};

export default async function EditCuratedRoutePage({ params }: Props) {
  const { id } = await params;
  const route = await curatedRouteRepository.findById(id);
  if (!route) notFound();

  const boundAction = updateCuratedRouteAction.bind(null, id, route.slug);

  // `route` is a plain Supabase row already — see the same note in app/admin/places/[slug]/edit/page.tsx.
  const formInput: CuratedRouteInput = JSON.parse(JSON.stringify(route));

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">{route.title} Düzenle</h1>
      <CuratedRouteForm route={formInput} action={boundAction} />
    </Container>
  );
}
