// scripts/verify-supabase.ts
// Connects to Supabase using the app's real env config and confirms the
// `places` table is reachable — without ever printing the connection
// credentials. Read-only: does not insert, update, or delete anything.
//
// Run with: npm run db:verify

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

async function main() {
  // Imported after loadLocalEnv() so process.env is populated first.
  const { getSupabaseClient } = await import('../src/lib/db/supabase');

  console.log('Connecting to Supabase...');
  const supabase = getSupabaseClient();

  const { count, error: countError } = await supabase.from('places').select('*', { count: 'exact', head: true });
  if (countError) throw new Error(countError.message);
  console.log(`Connected. "places" table: ${count ?? 0} row(s)`);

  const { data: testRow, error: findError } = await supabase
    .from('places')
    .select('id, slug, name')
    .eq('slug', 'test-place')
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  if (testRow) {
    console.log(`Found expected test row: slug="${testRow.slug}"${testRow.name ? `, name="${testRow.name}"` : ' (no name field set)'}`);
  } else {
    console.log('No row with slug "test-place" found (it may have already been removed, or was never inserted).');
  }

  console.log('\nVerification succeeded.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nVerification FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
