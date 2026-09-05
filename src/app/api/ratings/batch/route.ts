// app/api/ratings/batch/route.ts
// Batched aggregate lookup for discovery/listing grids (DiscoveryExplorer)
// — one request for every visible place's average/count instead of one
// per card. Not visitor-specific (no cookie involved), so this is plain
// public data — POST only because a list of up to ~121 place ids is
// friendlier as a JSON body than a query string.

import { NextRequest, NextResponse } from 'next/server';
import { getRatingAggregates } from '@/lib/repositories/ratingRepository';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const placeIds = Array.isArray(body?.placeIds) ? body.placeIds.filter((id: unknown) => typeof id === 'string') : null;
  if (!placeIds) return NextResponse.json({ error: 'placeIds must be a string array' }, { status: 400 });

  try {
    const aggregates = await getRatingAggregates(placeIds);
    return NextResponse.json({ ratings: Object.fromEntries(aggregates) });
  } catch (err) {
    console.error('[api/ratings/batch] failed:', err);
    return NextResponse.json({ ratings: {}, error: 'Yüklenemedi.' }, { status: 500 });
  }
}
