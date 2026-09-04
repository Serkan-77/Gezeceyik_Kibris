// scripts/seed-transit-routes.ts
// Migrates the local sample dataset (src/data/transitRoutes.ts) into the
// Supabase `transitRoutes` table. Mirrors seed-places.ts field for field —
// see that file's header comment for the safety properties this script
// shares (upsert-only, no delete/truncate, Zod-validated, never run by
// the app itself).
//
// Run with: npm run db:seed:transit

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

async function main() {
  const { transitRoutes: localRoutes } = await import('../src/data/transitRoutes');
  const { fromDomainBusRoute } = await import('../src/lib/repositories/transitRouteMapper');
  const { transitRouteInputSchema } = await import('../src/lib/db/transitRouteSchema');
  const { getSupabaseClient } = await import('../src/lib/db/supabase');

  console.log(`Read ${localRoutes.length} transit route record(s) from src/data/transitRoutes.ts.\n`);

  const supabase = getSupabaseClient();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  const errors: { id: string; message: string }[] = [];

  for (const route of localRoutes) {
    try {
      const input = transitRouteInputSchema.parse(fromDomainBusRoute(route, { active: true }));
      // Routes have no natural unique key like a place's slug, so upsert on
      // the (operator, fromRegion, toRegion) triple instead — the local
      // dataset's `id` field (e.g. "itimat-magusa-lefkosa") is a good proxy
      // but isn't stored on the row, so match on the real fields.
      const { data: existing, error: findError } = await supabase
        .from('transitRoutes')
        .select('*')
        .eq('operator', input.operator)
        .eq('fromRegion', input.fromRegion)
        .eq('toRegion', input.toRegion)
        .maybeSingle();
      if (findError) throw new Error(findError.message);

      if (!existing) {
        const { error: insertError } = await supabase.from('transitRoutes').insert(input);
        if (insertError) throw new Error(insertError.message);
        inserted++;
        console.log(`  [inserted]  ${route.id}`);
        continue;
      }

      const inputKeys = Object.keys(input) as (keyof typeof input)[];
      const comparable = Object.fromEntries(inputKeys.map((key) => [key, existing[key]]));
      const isSame = JSON.stringify(comparable) === JSON.stringify(input);

      if (isSame) {
        unchanged++;
        console.log(`  [unchanged] ${route.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('transitRoutes')
          .update({ ...input, updatedAt: new Date().toISOString() })
          .eq('id', existing.id);
        if (updateError) throw new Error(updateError.message);
        updated++;
        console.log(`  [updated]   ${route.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ id: route.id, message });
      console.log(`  [ERROR]     ${route.id} — ${message}`);
    }
  }

  console.log('\n--- Seed summary ---');
  console.log(`Inserted:  ${inserted}`);
  console.log(`Updated:   ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Errors:    ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nRecords that failed validation/write:');
    for (const e of errors) console.log(`  - ${e.id}: ${e.message}`);
  }

  const { count } = await supabase.from('transitRoutes').select('*', { count: 'exact', head: true });
  console.log(`\nTotal rows now in "transitRoutes": ${count ?? 'unknown'}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeed FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
