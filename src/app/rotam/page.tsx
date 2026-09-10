// app/rotam/page.tsx — Rotam (/rotam)
// The manual route builder for the visitor's current draft (Sections 1-6
// of the route-builder spec). The draft's actual stop data comes from the
// client-side DraftRouteContext (see that file's comment for why this
// page doesn't fetch it server-side) — this Server Component only
// supplies the lightweight place list "add more places" searches over,
// which is genuinely fine to fetch here (it's the same published-places
// read every other page already does, not visitor-specific).

import { Metadata } from 'next';
import { getAllPlaces } from '@/lib/places';
import { RouteBuilderClient } from '@/components/route/RouteBuilderClient';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';

export const metadata: Metadata = {
  title: tr.route.builderTitle,
  description: tr.route.draftSubtitle,
  // The visitor's own in-progress draft, resolved from an anonymous
  // ownership cookie a crawler never holds — there is no shared, public
  // content here to index. Already excluded via robots.txt.
  robots: { index: false, follow: false },
};

export default async function RotamPage() {
  const places = await getAllPlaces();
  const placesLite = places.map(({ id, slug, name, image, city, region, category, latitude, longitude, verificationStatus }) => ({
    id,
    slug,
    name,
    image,
    city,
    region,
    category,
    latitude,
    longitude,
    verificationStatus,
  }));

  return (
    <Container className="py-10 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§04 — Rotam</p>
      <h1 className="mt-1 font-display text-page-title leading-[0.9] text-strong text-balance pt-[0.5em] pb-[0.22em]">{tr.route.builderTitle}</h1>
      <p className="mt-3 max-w-xl font-serif text-body leading-relaxed text-muted">{tr.route.draftSubtitle}</p>
      <div className="mt-8">
        <RouteBuilderClient mode="draft" places={placesLite} />
      </div>
    </Container>
  );
}
