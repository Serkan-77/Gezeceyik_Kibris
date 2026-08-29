// app/gezilerim/page.tsx — Gezilerim (/gezilerim)
// Server wrapper with metadata export; the list itself is fully client-side
// since saved trips live in localStorage (see hooks/useSavedTrips.ts) — each
// saved record already carries its own place data, so there's nothing to
// fetch here.

import { Metadata } from 'next';
import { GezilerimClient } from '@/components/pages/GezilerimClient';
import { PlaceListingHeader } from '@/components/places/PlaceListingHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Gezilerim — Kuzey Kıbrıs Discovery',
  description: 'Kaydettiğiniz Kuzey Kıbrıs gezi planları.',
};

export default function GezilerimPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PlaceListingHeader
        eyebrow="Gezilerim"
        title="Kaydettiğim Gezi Planları"
        subtitle="Gezi Planla ile oluşturup kaydettiğiniz programlar."
      />
      <GezilerimClient />
    </Container>
  );
}
