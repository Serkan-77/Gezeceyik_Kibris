// app/favoriler/page.tsx — Favorilerim (/favoriler)
// Server wrapper with metadata export; renders client component.

import { Metadata } from 'next';
import { FavorilerClient } from '@/components/pages/FavorilerClient';
import { Container } from '@/components/ui/Container';
import { getAllPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Favorilerim',
  description: 'Kaydettiğiniz Kuzey Kıbrıs yerleri.',
  // Personal, localStorage-backed state — identical/empty for every
  // crawler, and already excluded via robots.txt (src/app/robots.ts).
  // This tag is the defense-in-depth layer for a URL discovered via an
  // external link rather than crawled directly.
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function FavorilerPage() {
  const places = await getAllPlaces();

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-page-title font-semibold text-strong text-balance">Kaydettiğim Yerler</h1>
      <p className="mt-3 max-w-xl text-body leading-relaxed text-muted">Favorilerinize eklediğiniz Kuzey Kıbrıs yerleri.</p>
      <div className="mt-8">
        <FavorilerClient places={places} />
      </div>
    </Container>
  );
}
