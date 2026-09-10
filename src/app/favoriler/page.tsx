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
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§06 — Favorilerim</p>
      <h1 className="mt-1 font-display text-page-title leading-[0.9] text-strong text-balance pt-[0.5em] pb-[0.22em]">Kaydettiğim Yerler</h1>
      <p className="mt-3 max-w-xl font-serif text-body leading-relaxed text-muted">Favorilerinize eklediğiniz Kuzey Kıbrıs yerleri.</p>
      <div className="mt-8">
        <FavorilerClient places={places} />
      </div>
    </Container>
  );
}
