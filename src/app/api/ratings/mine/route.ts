// app/api/ratings/mine/route.ts
// Read-only endpoint the rating widget calls once on mount to learn the
// current visitor's own rating for a place. Kept out of the place-detail
// Server Component itself for the same reason as
// app/api/route/draft/route.ts: that page is statically generated
// (generateStaticParams + revalidate=3600) for all 121 places, and a
// cookies() read there would force it dynamic for everyone. The public
// average/count, which is NOT visitor-specific, is still fetched at
// render time in the page itself.
//
// Never creates the anon-id cookie — a passive read must not identify an
// anonymous visitor; only submitting a rating does that.

import { NextRequest, NextResponse } from 'next/server';
import { getAnonId } from '@/lib/identity/anon';
import { getRatingSummary } from '@/lib/repositories/ratingRepository';

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get('placeId');
  if (!placeId) return NextResponse.json({ error: 'placeId is required' }, { status: 400 });

  const voterId = await getAnonId();
  if (!voterId) return NextResponse.json({ rating: null });

  try {
    const summary = await getRatingSummary(placeId, voterId);
    return NextResponse.json({ rating: summary.myRating });
  } catch (err) {
    console.error('[api/ratings/mine] failed:', err);
    return NextResponse.json({ rating: null, error: 'Yüklenemedi.' }, { status: 500 });
  }
}
