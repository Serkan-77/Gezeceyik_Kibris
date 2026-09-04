// app/favoriler/page.tsx — Favorilerim (/favoriler)
// Server wrapper with metadata export; renders client component.

import { Metadata } from 'next';
import { FavorilerClient } from '@/components/pages/FavorilerClient';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';
import { getAllPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Favorilerim: Gezeceyik Kıbrıs',
  description: 'Kaydettiğiniz Kuzey Kıbrıs yerleri.',
};

export const revalidate = 3600;

export default async function FavorilerPage() {
  const places = await getAllPlaces();

  return (
    <Container className="py-10 sm:py-14">
      <PlaceListingHeader
        eyebrow="Favorilerim"
        title="Kaydettiğim Yerler"
        subtitle="Favorilerinize eklediğiniz Kuzey Kıbrıs yerleri."
      />
      <FavorilerClient places={places} />
    </Container>
  );
}
