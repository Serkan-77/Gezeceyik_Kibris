// app/admin/places/new/page.tsx — /admin/places/new

import { Metadata } from 'next';
import { PlaceForm } from '@/components/admin/PlaceForm';
import { createPlaceAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Yeni Yer Ekle: Admin',
  robots: { index: false, follow: false },
};

export default function NewPlacePage() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">Yeni Yer Ekle</h1>
      <PlaceForm place={null} action={createPlaceAction} />
    </Container>
  );
}
