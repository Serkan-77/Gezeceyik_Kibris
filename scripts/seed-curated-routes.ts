// scripts/seed-curated-routes.ts
// Seeds two real, editorial "hazır rota" itineraries into the Supabase
// `curatedRoutes` table so the homepage CuratedRoutesBand (and /rotalar)
// have something to show — mirrors seed-transit-routes.ts's shape
// (upsert-only on the natural key, here `slug`; no delete/truncate;
// Zod-validated; never run by the app itself).
//
// Run with: npm run db:seed:routes

import { loadLocalEnv } from './loadEnv';
loadLocalEnv();

const ROUTES = [
  {
    slug: 'girnede-bir-gun',
    title: "Girne'de Bir Gün",
    summary:
      'Girne Kalesi, Bellapais Manastırı ve St. Hilarion Kalesi — kuzey kıyısının en bilinen üç durağını tek günde gezen klasik rota.',
    accommodation: { label: 'Girne Merkez', city: 'Girne', region: 'Girne' as const, lat: 35.3406, lng: 33.3193 },
    transport: 'car' as const,
    days: [['girne-kalesi', 'bellapais-manastiri', 'st-hilarion-kalesi']],
    published: true,
    displayOrder: 0,
  },
  {
    slug: 'gazimagusa-tarih-rotasi',
    title: 'Gazimağusa Tarih Rotası',
    summary:
      'Venedik surlarının içindeki gotik kilise ve kalelerden Salamis ile St. Barnabas\'ın antik kalıntılarına — iki günde Gazimağusa\'nın katmanlı tarihi.',
    accommodation: { label: 'Gazimağusa Merkez', city: 'Gazimağusa', region: 'Gazimağusa' as const, lat: 35.1264, lng: 33.9391 },
    transport: 'car' as const,
    days: [
      ['gazimagusa-surlari', 'lala-mustafa-pasa-camii', 'othello-kalesi'],
      ['salamis-antik-kenti', 'st-barnabas-manastiri'],
    ],
    published: true,
    displayOrder: 1,
  },
];

async function main() {
  const { curatedRouteInputSchema } = await import('../src/lib/db/curatedRouteSchema');
  const { getSupabaseClient } = await import('../src/lib/db/supabase');

  console.log(`Seeding ${ROUTES.length} curated route(s).\n`);

  const supabase = getSupabaseClient();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  const errors: { slug: string; message: string }[] = [];

  for (const route of ROUTES) {
    try {
      const input = curatedRouteInputSchema.parse(route);

      const { data: existing, error: findError } = await supabase
        .from('curatedRoutes')
        .select('*')
        .eq('slug', input.slug)
        .maybeSingle();
      if (findError) throw new Error(findError.message);

      if (!existing) {
        const { error: insertError } = await supabase.from('curatedRoutes').insert(input);
        if (insertError) throw new Error(insertError.message);
        inserted++;
        console.log(`  [inserted]  ${route.slug}`);
        continue;
      }

      const inputKeys = Object.keys(input) as (keyof typeof input)[];
      const comparable = Object.fromEntries(inputKeys.map((key) => [key, existing[key]]));
      const isSame = JSON.stringify(comparable) === JSON.stringify(input);

      if (isSame) {
        unchanged++;
        console.log(`  [unchanged] ${route.slug}`);
      } else {
        const { error: updateError } = await supabase
          .from('curatedRoutes')
          .update({ ...input, updatedAt: new Date().toISOString() })
          .eq('id', existing.id);
        if (updateError) throw new Error(updateError.message);
        updated++;
        console.log(`  [updated]   ${route.slug}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ slug: route.slug, message });
      console.log(`  [ERROR]     ${route.slug} — ${message}`);
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

  const { count } = await supabase.from('curatedRoutes').select('*', { count: 'exact', head: true });
  console.log(`\nTotal rows now in "curatedRoutes": ${count ?? 'unknown'}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeed FAILED.');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
