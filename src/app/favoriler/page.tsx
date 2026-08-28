// app/favoriler/page.tsx — Favorilerim (/favoriler)
// Server wrapper with metadata export; renders client component.

import { Metadata } from 'next';
import { FavorilerClient } from '@/components/pages/FavorilerClient';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Favorilerim — Kuzey Kıbrıs Discovery',
  description: 'Kaydettiğiniz Kuzey Kıbrıs yerleri.',
};

export default function FavorilerPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Favorilerim"
        title="Kaydettiğim Yerler"
        subtitle="Favorilerinize eklediğiniz Kuzey Kıbrıs yerleri."
      />
      <FavorilerClient />
    </Container>
  );
}
