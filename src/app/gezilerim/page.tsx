// app/gezilerim/page.tsx — Gezilerim (/gezilerim)
// Server wrapper with metadata export; both sections below are fully
// client-side (saved routes live in Supabase behind an anon cookie —
// SavedRoutesClient fetches /api/routes; the auto-planner's saved
// itineraries still live in localStorage — GezilerimClient), so there's
// nothing to fetch here.

import { Metadata } from 'next';
import { GezilerimClient } from '@/components/pages/GezilerimClient';
import { SavedRoutesClient } from '@/components/pages/SavedRoutesClient';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';

export const metadata: Metadata = {
  title: 'Gezilerim',
  description: 'Kaydettiğiniz Kuzey Kıbrıs gezi planları ve rotalar.',
  // Personal state (localStorage itineraries + this visitor's own
  // anonymous-cookie-owned routes) — nothing here is the same page twice,
  // and already excluded via robots.txt. Defense in depth, same reasoning
  // as app/favoriler/page.tsx.
  robots: { index: false, follow: false },
};

export default function GezilerimPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-page-title font-semibold text-strong text-balance">Gezilerim</h1>
      <p className="mt-3 max-w-xl text-body leading-relaxed text-muted">
        Kendi oluşturduğun rotalar ve Gezi Planla ile kaydettiğin programlar.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-section-title font-semibold text-strong">{tr.route.savedRoutesTitle}</h2>
        <div className="mt-5">
          <SavedRoutesClient />
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-12">
        <h2 className="font-display text-section-title font-semibold text-strong">Oluşturduğum Planlar</h2>
        <div className="mt-5">
          <GezilerimClient />
        </div>
      </section>
    </Container>
  );
}
