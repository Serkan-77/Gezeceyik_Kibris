// app/api/routes/route.ts
// Read-only endpoint for the visitor's saved routes (Gezilerim → Rotalarım).
// See app/api/route/draft/route.ts for why this is a Route Handler the
// client fetches, rather than a server-rendered prop.

import { NextResponse } from 'next/server';
import { getAnonId } from '@/lib/identity/anon';
import { listSavedRoutesForOwner } from '@/lib/repositories/routeRepository';

export async function GET() {
  const ownerId = await getAnonId();
  if (!ownerId) return NextResponse.json({ routes: [] });

  try {
    const routes = await listSavedRoutesForOwner(ownerId);
    return NextResponse.json({ routes });
  } catch (err) {
    console.error('[api/routes] failed to list saved routes:', err);
    return NextResponse.json({ routes: [], error: 'Rotalar yüklenemedi.' }, { status: 500 });
  }
}
