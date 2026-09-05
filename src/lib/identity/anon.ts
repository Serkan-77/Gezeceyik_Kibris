import 'server-only';
// lib/identity/anon.ts
// Per-browser anonymous identity for routes and ratings. This app has no
// Supabase Auth (see lib/db/supabase.ts) and does not want to force an
// account just to save a route or leave a rating, so ownership is a random
// id issued once per browser in an httpOnly cookie — never readable or
// forgeable from client-side JS, but not tied to a real account either.
//
// The cookie is only ever created from a Server Action or Route Handler
// (the only places Next.js allows `cookies().set()` — see
// node_modules/next/dist/docs/.../functions/cookies.md) and only lazily,
// the first time a visitor actually mutates something (adds a stop,
// submits a rating). A passive page view never sets it.

import { cookies } from 'next/headers';

export const ANON_ID_COOKIE = 'gk_anon_id';

const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2;

/**
 * Reads the visitor's anonymous id if one already exists. Safe to call from
 * a Server Component (read-only) as well as Server Actions / Route
 * Handlers. Returns null if the visitor has never mutated a route/rating
 * yet — callers should treat that as "no draft route / no vote", not
 * create an id just to check.
 */
export async function getAnonId(): Promise<string | null> {
  const store = await cookies();
  return store.get(ANON_ID_COOKIE)?.value ?? null;
}

/**
 * Returns the visitor's anonymous id, creating and persisting one via an
 * httpOnly cookie if this is their first mutation. Only callable from a
 * Server Action or Route Handler (cookie writes are rejected elsewhere by
 * the framework itself).
 */
export async function getOrCreateAnonId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(ANON_ID_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(ANON_ID_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TWO_YEARS_SECONDS,
  });
  return id;
}
