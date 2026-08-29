// scripts/ensure-indexes.ts
// Idempotent index setup for the `places` collection. Safe to run any
// number of times: it never drops or recreates an index, and it detects an
// existing index by its KEY PATTERN (not by name) before creating anything
// — so it correctly recognizes indexes that already exist manually from the
// Atlas UI (which names them automatically, e.g. "slug_1") without trying
// to create a conflicting duplicate under a different name.
//
// Run with: npm run db:indexes

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

type IndexKeyPattern = Record<string, 1 | -1 | '2dsphere'>;

async function ensureIndex(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection: any,
  keyPattern: IndexKeyPattern,
  options: { unique?: boolean; name: string }
): Promise<void> {
  const existing = await collection.indexes();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = existing.find((idx: any) => JSON.stringify(idx.key) === JSON.stringify(keyPattern));

  if (match) {
    console.log(`  Already present as "${match.name}" for ${JSON.stringify(keyPattern)} — skipping.`);
    return;
  }

  const createdName = await collection.createIndex(keyPattern, options);
  console.log(`  Created "${createdName}" for ${JSON.stringify(keyPattern)}.`);
}

async function main() {
  const { getDb } = await import('../src/lib/db/mongodb');
  const db = await getDb();
  const collection = db.collection('places');

  console.log('Ensuring required indexes on "places"...\n');

  await ensureIndex(collection, { slug: 1 }, { unique: true, name: 'slug_unique' });
  await ensureIndex(collection, { location: '2dsphere' }, { name: 'location_2dsphere' });

  const all = await collection.indexes();
  console.log(`\nAll indexes currently on "places" (${all.length}):`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const idx of all as any[]) {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? ' (unique)' : ''}`);
  }

  console.log('\nDone. No existing index was dropped, recreated, or renamed.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nIndex setup FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
