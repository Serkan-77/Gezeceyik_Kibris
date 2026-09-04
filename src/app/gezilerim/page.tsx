// app/gezilerim/page.tsx — Gezilerim (/gezilerim)
// Server wrapper with metadata export; the list itself is fully client-side
// since saved trips live in localStorage (see hooks/useSavedTrips.ts) — each
// saved record already carries its own place data, so there's nothing to
// fetch here.

import { Metadata } from 'next';
import { GezilerimClient } from '@/components/pages/GezilerimClient';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Gezilerim: Gezeceyik Kıbrıs',
  description: 'Kaydettiğiniz Kuzey Kıbrıs gezi planları.',
};

export default function GezilerimPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-page-title font-semibold text-strong text-balance">Kaydettiğim Gezi Planları</h1>
      <p className="mt-3 max-w-xl text-body leading-relaxed text-muted">Gezi Planla ile oluşturup kaydettiğiniz programlar.</p>
      <div className="mt-8">
        <GezilerimClient />
      </div>
    </Container>
  );
}
