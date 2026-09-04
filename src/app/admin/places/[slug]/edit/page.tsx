// app/admin/places/[slug]/edit/page.tsx — /admin/places/[slug]/edit

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as placeRepository from '@/lib/repositories/placeRepository';
import { PlaceInput } from '@/lib/db/placeSchema';
import { PlaceForm } from '@/components/admin/PlaceForm';
import { updatePlaceAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: 'Yeri Düzenle: Admin',
  robots: { index: false, follow: false },
};

export default async function EditPlacePage({ params }: Props) {
  const { slug } = await params;
  const place = await placeRepository.findBySlugAny(slug);
  if (!place) notFound();

  const boundAction = updatePlaceAction.bind(null, slug);

  // `place` is a plain Supabase row already — this JSON round-trip is a
  // defensive habit (guarantees a plain serializable value crosses the
  // Server -> Client Component boundary) rather than a strict necessity.
  // The extra fields (id, createdAt, updatedAt) beyond PlaceInput are
  // simply ignored by PlaceForm.
  const formInput: PlaceInput = JSON.parse(JSON.stringify(place));

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">{place.name} Düzenle</h1>
      <PlaceForm place={formInput} action={boundAction} />
    </Container>
  );
}
