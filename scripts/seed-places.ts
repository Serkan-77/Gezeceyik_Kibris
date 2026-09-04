// scripts/seed-places.ts
// Migrates the local sample dataset (src/data/places.ts) into the Supabase
// `places` table, upserted by `slug`.
//
// Safety properties (all deliberate, do not remove):
//   - No delete/truncate — this script only ever inserts or updates rows
//     whose slug matches a local record.
//   - Upsert-by-slug means running this multiple times is safe: a place
//     already in the database with a matching slug is updated in place,
//     never duplicated.
//   - Rows whose slug is NOT in the local dataset are never touched.
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
  const { placeInputSchema } = await import('../src/lib/db/placeSchema');
  const { getSupabaseClient } = await import('../src/lib/db/supabase');

  console.log(`Read ${localPlaces.length} place record(s) from src/data/places.ts.\n`);

  const supabase = getSupabaseClient();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  const errors: { slug: string; message: string }[] = [];

  for (const place of localPlaces) {
    try {
      const input = placeInputSchema.parse(fromDomainPlace(place, { published: true }));
      const { data: existing, error: findError } = await supabase
        .from('places')
        .select('*')
        .eq('slug', input.slug)
        .maybeSingle();
      if (findError) throw new Error(findError.message);

      if (!existing) {
        const { error: insertError } = await supabase.from('places').insert(input);
        if (insertError) throw new Error(insertError.message);
        inserted++;
        console.log(`  [inserted]  ${input.slug}`);
        continue;
      }

      // Compare against the incoming shape only (ignore id/createdAt/updatedAt)
      // so re-running the seed with no real changes reports "unchanged"
      // rather than bumping updatedAt on every run.
      const inputKeys = Object.keys(input) as (keyof typeof input)[];
      const comparable = Object.fromEntries(inputKeys.map((key) => [key, existing[key]]));
      const isSame = JSON.stringify(comparable) === JSON.stringify(input);

      if (isSame) {
        unchanged++;
        console.log(`  [unchanged] ${input.slug}`);
      } else {
        const { error: updateError } = await supabase
          .from('places')
          .update({ ...input, updatedAt: new Date().toISOString() })
          .eq('slug', input.slug);
        if (updateError) throw new Error(updateError.message);
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

  const { count } = await supabase.from('places').select('*', { count: 'exact', head: true });
  console.log(`\nTotal rows now in "places": ${count ?? 'unknown'}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeed FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
