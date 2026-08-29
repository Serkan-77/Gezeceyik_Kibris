// lib/db/mongodb.ts
// MongoDB connection layer. Only ever imported by src/lib/repositories/ and
// by standalone Node scripts (scripts/*.ts) — never by application UI code.
//
// This module deliberately does NOT import the `server-only` package: that
// package throws unconditionally outside Next.js's webpack build (it relies
// on bundler-level substitution, not a runtime check), which would break
// the standalone seed/verify/index scripts that also need this connection
// logic. The actual Client-Component safety boundary is one layer up, at
// src/lib/places.ts — the only module the rest of the app is supposed to
// import place data from, and the one place that does carry the
// `server-only` guard.
//
// Connection caching follows the standard Next.js + MongoDB pattern: one
// client per server process in production, and a client cached on
// `globalThis` in development so the Next.js dev server's module hot-reload
// doesn't open a fresh connection (and exhaust the connection pool) on every
// file save.

import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

interface MongoConfig {
  uri: string;
  dbName: string;
}

/**
 * Reads and validates the required MongoDB environment configuration.
 * Intentionally only ever called from inside an async function — throwing
 * here becomes a rejected Promise, not a synchronous crash at module import
 * time, so a missing/misconfigured env doesn't take down unrelated pages or
 * the build itself before anything actually tries to use the database.
 */
function getMongoConfig(): MongoConfig {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    const missing = [!uri && 'MONGODB_URI', !dbName && 'MONGODB_DB'].filter(Boolean).join(', ');
    throw new Error(
      `Missing required MongoDB configuration: ${missing}. ` +
        'Set these in .env.local (see .env.example for the expected keys). ' +
        'Never commit real values.'
    );
  }

  return { uri, dbName };
}

/**
 * Strips the connection URI (which contains the username/password) out of
 * an error message before it's thrown or logged, so a connection failure
 * can never leak credentials into logs, error boundaries, or crash reports.
 */
function sanitizeMongoError(err: unknown, uri: string): Error {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const safeMessage = rawMessage.split(uri).join('<redacted>');
  // Deliberately does not set `cause` — the original error may carry the
  // raw connection options (including the URI) on its own properties.
  return new Error(`MongoDB connection error: ${safeMessage}`);
}

async function createClient(): Promise<MongoClient> {
  const { uri } = getMongoConfig();
  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    await client.connect();
    return client;
  } catch (err) {
    throw sanitizeMongoError(err, uri);
  }
}

let prodClientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'production') {
    if (!prodClientPromise) prodClientPromise = createClient();
    return prodClientPromise;
  }

  // Development: cache on globalThis so hot-reloading src files doesn't
  // re-run this module and open a new connection every time.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
  }
  return global._mongoClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}

/** Returns the app's database (MONGODB_DB), connecting/reusing the cached client. */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const { dbName } = getMongoConfig();
  return client.db(dbName);
}
