// app/api/route/draft/route.ts
// Read-only endpoint the client-side DraftRouteProvider calls once on
// mount to hydrate the canonical current-route state (see
// context/DraftRouteContext.tsx). Deliberately a Route Handler rather
// than data fetched in the root layout: the root layout renders every
// page including the 121 statically-generated place pages
// (generateStaticParams + revalidate=3600 in app/places/[slug]/page.tsx),
// and calling cookies() there would force the entire site into per-request
// dynamic rendering. An API route the client fetches keeps that static
// generation intact.
//
// Never creates the anon-id cookie — a passive read must not turn an
// anonymous visitor into an "identified" one; only a mutation does that
// (see lib/identity/anon.ts).

import { NextResponse } from 'next/server';
import { getAnonId } from '@/lib/identity/anon';
import { getDraftRouteForOwner } from '@/lib/repositories/routeRepository';

export async function GET() {
  const ownerId = await getAnonId();
  if (!ownerId) return NextResponse.json({ route: null });

  try {
    const route = await getDraftRouteForOwner(ownerId);
    return NextResponse.json({ route });
  } catch (err) {
    console.error('[api/route/draft] failed to load draft route:', err);
    return NextResponse.json({ route: null, error: 'Rota yüklenemedi.' }, { status: 500 });
  }
}
