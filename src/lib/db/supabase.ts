// lib/db/supabase.ts
// Supabase (Postgres) connection layer — replaces lib/db/mongodb.ts.
// Only ever imported by src/lib/repositories/ and by standalone Node
// scripts (scripts/*.ts) — never by application UI code.
//
// This module deliberately does NOT import the `server-only` package: that
// package throws unconditionally outside Next.js's webpack build, which
// would break the standalone seed/verify scripts that also need this
// client. The actual Client-Component safety boundary is one layer up, at
// src/lib/places.ts / src/lib/transitRoutes.ts — the only modules the rest
// of the app is supposed to import data from, and the ones that carry the
// `server-only` guard.
//
// Uses the SERVICE ROLE key, not the anon key: this app has no Supabase
// Auth / end-user sessions (the admin panel uses its own password+cookie
// session — see lib/admin/session.ts), so every read and write the app
// makes is a trusted, server-side operation that should bypass Row Level
// Security entirely. The service role key must never reach the browser —
// it is only ever read from process.env inside this server-only module.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

/**
 * Reads and validates the required Supabase environment configuration.
 * Intentionally only ever called from inside a function — throwing here
 * becomes a caught/rejected error at call time, not a synchronous crash at
 * module import time, so a missing/misconfigured env doesn't take down
 * unrelated pages or the build itself before anything actually tries to
 * use the database.
 */
function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    const missing = [!url && 'SUPABASE_URL', !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY'].filter(Boolean).join(', ');
    throw new Error(
      `Missing required Supabase configuration: ${missing}. ` +
        'Set these in .env.local (see .env.example for the expected keys, and ' +
        'docs/SUPABASE_SETUP_GUIDE.md for how to obtain them). Never commit real values.'
    );
  }

  return { url, serviceRoleKey };
}

let cachedClient: SupabaseClient | undefined;

/**
 * Returns a cached Supabase client authenticated with the service role key.
 * Unlike the MongoDB driver this replaces, supabase-js has no connection
 * pool to exhaust — it's a lightweight fetch-based REST client — so simple
 * module-scope caching (recreated harmlessly on each dev-server hot-reload)
 * is sufficient; there's no dev/production split needed here.
 */
export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const { url, serviceRoleKey } = getSupabaseConfig();
  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
