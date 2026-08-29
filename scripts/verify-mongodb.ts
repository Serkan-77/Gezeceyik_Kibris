// scripts/verify-mongodb.ts
// Connects to MongoDB using the app's real env config and confirms the
// `places` collection is reachable — without ever printing the connection
// string or password. Read-only: does not insert, update, or delete
// anything.
//
// Run with: npm run db:verify

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

async function main() {
  // Imported after loadLocalEnv() so process.env is populated first.
  const { getDb } = await import('../src/lib/db/mongodb');

  console.log('Connecting to MongoDB...');
  const db = await getDb();
  console.log(`Connected. Database: "${db.databaseName}"`);

  const collection = db.collection('places');
  const count = await collection.countDocuments();
  console.log(`"places" collection: ${count} document(s)`);

  const testDoc = await collection.findOne(
    { slug: 'test-place' },
    { projection: { _id: 1, slug: 1, name: 1 } }
  );

  if (testDoc) {
    console.log(`Found expected test document: slug="${testDoc.slug}"${testDoc.name ? `, name="${testDoc.name}"` : ' (no name field set)'}`);
  } else {
    console.log('No document with slug "test-place" found (it may have already been removed, or was never inserted).');
  }

  console.log('\nVerification succeeded.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nVerification FAILED.');
    // err.message is already sanitized by lib/db/mongodb.ts for connection
    // errors — never print the raw error object, which could carry the URI
    // on internal (non-message) properties.
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
