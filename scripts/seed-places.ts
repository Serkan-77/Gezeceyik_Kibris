// scripts/seed-places.ts
// Migrates the local sample dataset (src/data/places.ts) into the MongoDB
// `places` collection, upserted by `slug`.
//
// Safety properties (all deliberate, do not remove):
//   - No deleteMany, no drop, no collection reset — this script only ever
//     inserts or updates documents whose slug matches a local record.
//   - Upsert-by-slug means running this multiple times is safe: a place
//     already in the database with a matching slug is updated in place,
//     never duplicated.
//   - Documents whose slug is NOT in the local dataset (e.g. the "test-place"
//     document inserted manually while setting up Atlas) are never touched.
//   - Every record is validated with the same Zod schema
//     (placeInputSchema) the repository's createPlace/updatePlace use,
//     before being written.
//   - This script is never imported or run by the Next.js application
//     itself — it only runs when invoked directly via `npm run db:seed`.
//
// Run with: npm run db:seed

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

async function main() {
  const { places: localPlaces } = await import('../src/data/places');
  const { fromDomainPlace } = await import('../src/lib/repositories/placeMapper');
  const { placeInputSchema } = await import('../src/lib/db/placeDocument');
  const { getDb } = await import('../src/lib/db/mongodb');

  console.log(`Read ${localPlaces.length} place record(s) from src/data/places.ts.\n`);

  const db = await getDb();
  const collection = db.collection('places');

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  const errors: { slug: string; message: string }[] = [];

  for (const place of localPlaces) {
    try {
      const input = placeInputSchema.parse(fromDomainPlace(place, { published: true }));
      const existing = await collection.findOne({ slug: input.slug });
      const now = new Date();

      if (!existing) {
        await collection.insertOne({ ...input, createdAt: now, updatedAt: now });
        inserted++;
        console.log(`  [inserted]  ${input.slug}`);
        continue;
      }

      // Compare against the incoming shape only (ignore _id/createdAt/updatedAt)
      // so re-running the seed with no real changes reports "unchanged"
      // rather than bumping updatedAt on every run.
      const inputKeys = Object.keys(input) as (keyof typeof input)[];
      const comparable = Object.fromEntries(inputKeys.map((key) => [key, existing[key]]));
      const isSame = JSON.stringify(comparable) === JSON.stringify(input);

      if (isSame) {
        unchanged++;
        console.log(`  [unchanged] ${input.slug}`);
      } else {
        await collection.updateOne({ slug: input.slug }, { $set: { ...input, updatedAt: now } });
        updated++;
        console.log(`  [updated]   ${input.slug}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ slug: place.slug, message });
      console.log(`  [ERROR]     ${place.slug} — ${message}`);
    }
  }

  console.log('\n--- Seed summary ---');
  console.log(`Inserted:  ${inserted}`);
  console.log(`Updated:   ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Errors:    ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nRecords that failed validation/write:');
    for (const e of errors) console.log(`  - ${e.slug}: ${e.message}`);
  }

  const total = await collection.countDocuments();
  console.log(`\nTotal documents now in "places": ${total}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeed FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
