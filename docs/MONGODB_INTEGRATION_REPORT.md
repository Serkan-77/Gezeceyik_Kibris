# MongoDB Integration Report

Records what was actually implemented when migrating place-data reads from
the local static dataset (`src/data/places.ts`) to MongoDB Atlas. The
database itself was configured manually by the project owner beforehand
(see `docs/MONGODB_SETUP_GUIDE.md`); this document covers the application
side.

**Status at the end of this task: implemented and structurally validated,
but not yet live-verified against the real database, and the real seed has
not been run.** See [Known current limitations](#known-current-limitations)
for exactly why, and [Seed review](#seed-review--awaiting-approval) for what's
waiting on approval.

## Driver choice

**Official MongoDB Node.js driver (`mongodb`), not Mongoose.**

The app's read patterns are simple (find/filter/sort/aggregate over one
collection, no relational joins, no complex change-tracking), and the domain
type (`Place`) already exists and is deliberately kept separate from the
database shape (see [Domain vs. database model](#domain-vs-database-model)
below). Mongoose's main value — schema-enforced models with built-in
validation and casting — is redundant here: validation is handled by Zod
(already needed per the task's own requirements) at the exact boundary where
data enters the database (`createPlace`/`updatePlace`/the seed script), and
the mapping layer already exists to keep MongoDB's document shape out of the
UI. Adding Mongoose on top would mean maintaining two schema definitions
(Mongoose's + Zod's) for the same data, and pulling in an abstraction layer
this project doesn't need. The official driver is smaller, has no schema
DSL to learn, and is what MongoDB itself recommends for exactly this kind of
"a few well-defined queries against one collection" use case.

## Dependencies

**Added:**

| Package | Type | Why |
|---|---|---|
| `mongodb` | dependency | The database driver (see above) |
| `server-only` | dependency | Build-time guard so `src/lib/places.ts` (the data seam) can never be imported into a Client Component bundle |
| `zod` | dependency | Schema validation for data entering MongoDB (`createPlace`/`updatePlace`/seed) — the project had no existing validation library |
| `tsx` | devDependency | Runs the standalone TypeScript scripts (`db:verify`, `db:indexes`, `db:seed`) with the project's `@/` path aliases resolved, without needing a build step |

**Removed:** none.

## Files created

```
src/lib/db/mongodb.ts             Connection layer (client caching, env validation, error sanitization)
src/lib/db/placeDocument.ts       MongoDB document type + Zod validation schemas
src/lib/repositories/placeRepository.ts   All place queries/mutations against MongoDB
src/lib/repositories/placeMapper.ts       PlaceDocument <-> domain Place conversion, incl. GeoJSON
src/lib/format.ts                 formatDistance, extracted so Client Components have a data-free import
scripts/loadEnv.ts                Minimal .env/.env.local loader for standalone scripts
scripts/verify-mongodb.ts         Read-only connection/collection check (npm run db:verify)
scripts/ensure-indexes.ts         Idempotent index setup (npm run db:indexes)
scripts/seed-places.ts            Local-dataset → MongoDB migration (npm run db:seed) — NOT yet run
.env.example                      Placeholder env template
docs/MONGODB_INTEGRATION_REPORT.md   This file
```

## Files modified

```
src/lib/places.ts                 Rewritten as an async, MongoDB-backed seam with dev-only local fallback
src/lib/trip-planner/planner.ts   generateItinerary() now takes places as a parameter (see below)
src/components/trip/PlannerWizardClient.tsx   Accepts a `places` prop instead of reading them itself
src/components/pages/FavorilerClient.tsx      Accepts a `places` prop instead of reading them itself
src/components/places/PlaceCard.tsx           Imports formatDistance from lib/format.ts, not lib/places.ts
src/components/home/RegionGrid.tsx            Now an async Server Component
src/app/page.tsx                  Awaits getFeaturedPlaces(); revalidate = 3600
src/app/beaches/page.tsx          Awaits its data calls; revalidate = 3600
src/app/castles/page.tsx          Same
src/app/museums/page.tsx          Same
src/app/historical-places/page.tsx   Same
src/app/places/page.tsx           Same
src/app/harita/page.tsx           Same
src/app/gezi-planla/page.tsx      Awaits its data calls; also fetches and passes `places` to the wizard
src/app/favoriler/page.tsx        Awaits getAllPlaces(); passes `places` to FavorilerClient
src/app/places/[slug]/page.tsx    Awaits all data calls; generateStaticParams made resilient (see below)
src/app/sitemap.ts                Awaits getAllPlaceSlugs(); made resilient (see below)
.gitignore                        Added `!.env.example` — needed because the existing `.env*` rule was also swallowing the example template
package.json                      New scripts + dependencies (see above)
```

## Connection architecture

`src/lib/db/mongodb.ts` follows the standard Next.js + MongoDB pattern:

- **Production:** one `MongoClient` per server process, created once and reused.
- **Development:** the client promise is cached on `globalThis`, so Next.js's dev-server hot reload doesn't open a new connection (and exhaust the connection pool) on every file save.
- **Env validation happens lazily**, inside an async function — a missing `MONGODB_URI`/`MONGODB_DB` becomes a rejected Promise the first time something actually tries to read the database, not a crash at module-import time. This matters because it lets `src/lib/places.ts` catch that rejection and fall back to local data in development, rather than the whole app failing to even start.
- **Errors are sanitized before they're ever thrown or logged**: the connection URI string is stripped out of any error message via a literal find-and-replace, specifically so a connection failure can never leak the username/password into logs, a build's error output, or (in a default Next.js production deploy) an error page.

**Deliberate deviation from the task's suggested pattern:** the connection
layer and repository do **not** carry the `server-only` import. That package
throws unconditionally when imported outside Next.js's webpack/Turbopack
build (it relies on bundler substitution, not a runtime check) — which
would break the standalone scripts (`db:verify`/`db:indexes`/`db:seed`),
since they need to import the same repository and connection code the app
uses. The actual Client-Component safety boundary is one layer up, at
`src/lib/places.ts` — the only module the rest of the app is meant to read
place data from, and the one that does carry the `server-only` guard. A
static check (`grep` across every `'use client'` file for imports from
`lib/places`, `lib/db`, or `lib/repositories`) found zero violations.

## Environment variables

Required: `MONGODB_URI`, `MONGODB_DB` — both already set in `.env` at the
project root (the project owner named the file `.env` rather than
`.env.local`; both are covered by the repo's `.gitignore` `.env*` rule, so
this doesn't affect security, just worth noting since the original request
described it as `.env.local`). `.env.example` documents both as empty
placeholders. Neither is ever logged, and neither uses a `NEXT_PUBLIC_`
prefix, so neither is reachable from client-side code.

## Domain vs. database model

The app's existing `Place` type (`src/types/place.ts`) was **not changed**
— every UI component receives exactly the same shape it did before this
migration. A separate `PlaceDocument` type (`src/lib/db/placeDocument.ts`)
describes what's actually stored in MongoDB, and `src/lib/repositories/placeMapper.ts`
converts between the two in both directions:

| Domain (`Place`) | MongoDB (`PlaceDocument`) | Note |
|---|---|---|
| `id: string` | `_id: ObjectId` | `id = _id.toString()` |
| `image`, `gallery?` | `images: { cover, gallery }` | |
| `admission?` | `entranceFee?` | Same shape, renamed field |
| `phone?`, `website?` | `contact: { phone?, website? }` | |
| `latitude`, `longitude` | `location: GeoJSON Point` | See below |
| `estimatedVisitMinutes?` | `visitDuration?` | |
| `sourceUrl?` (single) | `sources: string[]` | `sourceUrl = sources[0]`; write side wraps a single URL into a one-item array |
| `accessibility?`, `nearbyPlaceSlugs?`, `lastVerifiedAt?`, `verificationStatus`, `featured` | same names | Carried over unchanged — not discarded just because the task's field list didn't spell them out |
| *(none)* | `published`, `archived`, `createdAt`, `updatedAt` | New, database-only concepts with no domain-type equivalent — the public repository read methods filter on these so the rest of the app never needs to know they exist |

`toDomainPlace()` (one document → `Place`) throws a clear, specific error if
a document is missing `location.coordinates` or `images.cover`, and
`toDomainPlaces()` (a list) catches that per-document and **skips the
malformed record with a console warning** rather than letting one bad
document take an entire listing page down. This was added specifically
because the manually-inserted `test-place` document's exact shape wasn't
known ahead of time — see Known current limitations.

## GeoJSON conversion

MongoDB requires `{ type: 'Point', coordinates: [longitude, latitude] }` —
the reverse axis order from the app's `latitude`/`longitude` fields.
`toGeoPoint(lat, lng)` builds that struct; `toDomainPlace` unpacks it back
via `const [longitude, latitude] = doc.location.coordinates`. This was
verified with an explicit round-trip check (source lat/lng → GeoJSON →
mapped back to a domain `Place`) against a real record from the local
dataset (Girne Kalesi, `35.3403, 33.3187`) before being deleted — the
round-tripped values matched exactly, confirming no axis swap.

## Read path (repository)

`src/lib/repositories/placeRepository.ts` exposes public read functions that
**only ever return `published: true, archived: { $ne: true }` documents**:
`findPublished`, `findBySlugPublished`, `findByCategory`, `findByRegion`,
`findFeatured`, `findBySlugs`, `findAllSlugs`, `findAllCategories`,
`findAllRegions`, `countByRegion`. Internal/unfiltered reads (`findAll`,
`findBySlugAny`) exist for future admin use but nothing in the public app
calls them.

A geospatial foundation method, `findNear(longitude, latitude,
maxDistanceMeters, limit)`, uses the existing `location` 2dsphere index via
`$near`. **Nothing in the UI calls this yet** — it's exactly the "backend
capability, not a feature" the task asked for. The existing nearby-places
feature (the "Nearby Places" section on a place-detail page) is unchanged:
it's still driven by each place's explicit `nearbyPlaceSlugs` list, now
resolved with a single `$in` query (`findBySlugs`) instead of N individual
local-array lookups.

## Mutations / CRUD foundation

`createPlace`, `updatePlace`, `publishPlace`, `unpublishPlace`,
`archivePlace` all exist on the repository, all validate input through the
same Zod schema (`placeInputSchema`/`placeUpdateSchema`) the seed script
uses. **None of these are exposed through any route handler, Server Action,
or page** — nothing in the current app calls them. This is deliberate (see
Step 28 of the task): the foundation is ready for a future admin interface
to build on, without a placeholder admin UI or unused API endpoint existing
today.

There is intentionally **no hard-delete operation**. `archivePlace` sets
`archived: true, published: false` — a soft delete. A real hard-delete would
need explicit, privileged handling that's out of scope for a
foundation-only pass.

**Route Handlers vs. Server Actions (decision, not yet implemented):** when
admin mutations are eventually built, Server Actions are the better fit for
this codebase — everything is already Next.js App Router with no separate
API consumer, Server Actions colocate cleanly with the (future) admin UI,
and they avoid standing up a parallel `/api/*` surface for functionality
only this app's own admin pages would ever call. Route Handlers would only
make sense if an external client (a separate admin app, a mobile app, a
webhook) needed to call these operations directly over HTTP — nothing like
that exists or is planned. No route handler or server action was created in
this task, per Step 17's explicit instruction not to build API endpoints
that nothing calls yet.

## Development fallback behavior

Every function in `src/lib/places.ts` tries MongoDB first. On failure:

- **Outside production** (`NODE_ENV !== 'production'`): logs a clear,
  prefixed warning to the server console (`[lib/places] MongoDB read failed
  (<which function>) — falling back to local sample data...`, including the
  sanitized error reason) and returns the equivalent result computed from
  `src/data/places.ts` instead.
- **In production:** the error is not caught here — it propagates to the
  page, which fails visibly (Next.js's built-in error handling) rather than
  silently serving local sample data as if it were live.

This was verified end-to-end by running `next dev` against the real (but
from this environment, unreachable) Atlas configuration: every route
attempted the database, logged the expected fallback warning with no
credentials in it, and rendered correctly from local data. See Known
current limitations for why "unreachable" was the actual outcome in this
session specifically.

## Validation added

`src/lib/db/placeDocument.ts` defines Zod schemas for everything entering
the database: `slug` (lowercase-hyphenated pattern), `name`,
`shortDescription`, `description`, `category`/`region` (enums matching the
existing `Category`/`Region` union types), `location` (GeoJSON `Point` with
a coordinate-range check), `images.cover`, `openingHours`, `entranceFee`,
`contact.website` (URL format), `verificationStatus` (enum), `sources`
(array of URLs), and more. `placeInputSchema` is used by `createPlace`,
`placeUpdateSchema` (a `.partial()` of the same schema) by `updatePlace`,
and both are reused by `scripts/seed-places.ts` rather than being redefined.
This is the one, single schema definition for a place document — no
duplicated schema logic between the repository and the seed script.

## Indexes

Two indexes are required and were already created manually in Atlas per
`docs/MONGODB_SETUP_GUIDE.md`: a unique index on `slug`, and a `2dsphere`
index on `location`. `scripts/ensure-indexes.ts` (`npm run db:indexes`)
provides an idempotent way to (re-)ensure both:

- It detects an existing index **by key pattern**, not by name, before
  creating anything — so it correctly recognizes indexes Atlas's UI already
  created (which auto-names them, e.g. `slug_1`) without attempting to
  create a same-pattern index under a different name (which MongoDB
  rejects as a conflict).
- It never drops, recreates, or renames an existing index.
- **Not run in this session** — see Known current limitations.

## Seed architecture

`scripts/seed-places.ts` (`npm run db:seed`) reads every record from
`src/data/places.ts`, maps each through `fromDomainPlace()` (validated
against `placeInputSchema`), and **upserts by `slug`**:

- No existing document → inserted, with `published: true` (these are the
  app's current live content) and fresh `createdAt`/`updatedAt`.
- An existing document with the same slug → compared field-by-field against
  the incoming data; only written (and only `updatedAt`-bumped) if
  something actually differs, otherwise reported as `unchanged`.
- **No `deleteMany`, no collection drop, anywhere in this script.** A
  document whose slug isn't in the local dataset (e.g. the manually-created
  `test-place` document) is never touched, because every operation is
  scoped to one specific incoming slug.
- Every record's outcome (`inserted`/`updated`/`unchanged`/`error`) is
  logged individually, plus a final count summary.
- **Not run in this session** — see Seed review below.

## Caching / revalidation strategy

Chose **time-based revalidation (`export const revalidate = 3600`)** on
every page that reads place data (homepage, all four category pages,
`/places`, `/harita`, `/gezi-planla`, `/favoriler`, `/places/[slug]`), not
`force-dynamic`. Reasoning: destination content (opening hours, prices,
descriptions) changes on the order of "someone edits a place occasionally,"
not per-request — `force-dynamic` would hit MongoDB on every single page
view for content that's essentially static most of the time, which is
wasted database load for no freshness benefit. An hour-old cache is an
acceptable staleness window for this kind of content, and once a future
admin "publish" action exists, revisiting this number (or adding on-demand
`revalidatePath`/`revalidateTag` calls from that action) is a natural next
step — not needed today.

## generateStaticParams decision

`src/app/places/[slug]/page.tsx` still uses `generateStaticParams` to
pre-render place-detail pages at build time, with `dynamicParams` left at
its default (`true`) — any slug not returned by `generateStaticParams` still
renders correctly on-demand at request time, it's just not pre-built.

**This was made deliberately resilient during this task**, based on a
concrete build failure encountered in this session: `generateStaticParams`
now wraps its database call in a `try`/`catch` and returns `[]` (with a
console warning) if the read fails, instead of letting the exception fail
the entire production build. The reasoning: which specific slugs get
*pre*-rendered at build time is a build-time optimization input, not the
actual content response — a build shouldn't hard-fail entirely just because
one enumeration query didn't succeed, especially since `dynamicParams: true`
already means every place still renders correctly (subject to the same
production fail-safe as everything else) even with zero pre-rendered pages.
`src/app/sitemap.ts` got the identical treatment for the same reason: a
sitemap missing place URLs is a degraded-but-real result, not a reason to
fail the whole build.

This is a narrower fix than it might look: it does **not** change the
production fail-safe behavior for actual page content (Step 10) — a page
request that genuinely can't reach the database still fails visibly in
production, exactly as designed. It only means "we couldn't list every slug
in advance" doesn't also take down the build.

## Error handling / security

- MongoDB connection errors are sanitized (URI stripped) before being
  thrown, logged, or surfaced in a build's error output — confirmed by
  reading the actual build failure output in this session, which showed a
  clean `MongoDB connection error: querySrv ECONNREFUSED ...` with no
  credentials.
- Malformed documents are handled without crashing an entire page (see
  Domain vs. database model above).
- `notFound()` behavior for a nonexistent slug is unchanged.
- No `NEXT_PUBLIC_` prefix is used anywhere for MongoDB config; a static
  grep across every Client Component found zero imports of the server-only
  data-access modules.
- No destructive delete operation exists anywhere in the repository or
  scripts — `archivePlace` is a soft delete, and the seed script only ever
  inserts/updates by slug.

## Known current limitations

- **The live MongoDB connection could not be verified from within this
  session's sandboxed tool environment.** Diagnosis: `mongodb+srv://`
  connection strings require a DNS SRV lookup, and this specific sandbox
  blocks raw DNS protocol queries (port 53) while still allowing normal
  outbound HTTPS traffic (confirmed directly: `dns.resolveSrv(...)` and even
  a plain `dns.resolve('mongodb.net')` both failed with `ECONNREFUSED`,
  while a direct TCP connection to an IP and a `fetch()` call both
  succeeded). This is an environment restriction, not a defect in the
  integration code — `npm run db:verify`, `npm run build`, and
  `npm run db:seed` will all need to be re-run in an environment with normal
  DNS access (the project owner's own machine, or a real CI/deploy
  pipeline) to get an actual live result.
- **`npm run build` did not complete successfully in this session**, for
  the same DNS reason: several pages that are eligible for static
  prerendering (e.g. `/beaches`) hit the same unreachable-database error
  during the build's page-data-collection step. This is the *intended*
  production fail-safe behavior for a genuinely unreachable database (Step
  10) — a build that can't reach its data source failing loudly, instead of
  silently shipping fallback content as if it were live, is correct, not a
  bug. What **was** verified in this session: `npx tsc --noEmit` (clean),
  `npx eslint .` (clean), and a full `next dev` run where every route
  correctly fell back to local data with a sanitized warning and rendered
  200 OK. `npm run build` needs to be re-run in an environment with working
  DNS before this integration can be considered fully validated end-to-end.
- **`npm run db:verify`, `npm run db:indexes`, and `npm run db:seed` were
  none of them successfully executed against the real database** — the
  first two for the same DNS reason, the seed script deliberately per the
  task's explicit hard stop (see Seed review below). All three were
  type-checked and lint-checked; the seed script's field mapping and
  GeoJSON conversion were additionally verified with a standalone round-trip
  check against a real local-dataset record (see GeoJSON conversion above).
- **The exact shape of the manually-inserted `test-place` document is
  unknown** — it was never actually read in this session (see above). If
  it's missing `location`/`images.cover`, `toDomainPlace` now handles that
  by throwing a specific error for that one document (caught and skipped
  with a warning in list reads); it doesn't crash a page. If it also lacks
  `published: true`, it simply won't appear in any public read regardless.
- **Interactive client-side behavior** (clicking through the trip planner
  wizard to actually generate an itinerary, toggling favorites, the Leaflet
  map) was not click-tested — Chrome browser automation was not available
  in this session. Server-rendered output for every route was confirmed via
  `curl` (200 OK) against the `next dev` fallback path instead.

## Seed review — awaiting approval

**Not run.** Summary for approval:

- **Local source:** `src/data/places.ts` — the single hard-coded TypeScript array that is currently the app's entire content source.
- **Record count:** 22 place records.
- **Identity / duplicate prevention:** every record is upserted by its `slug` field. A slug already present in the collection is updated (only if something actually changed) rather than duplicated; a slug not present is inserted. Nothing outside these 22 slugs is touched — the existing `test-place` document is not affected by this script under any circumstance.
- **Location conversion:** each record's `latitude`/`longitude` becomes `location: { type: 'Point', coordinates: [longitude, latitude] }` via `toGeoPoint()` — longitude first, verified correct by the round-trip check described above.
- **Fields written:** `slug`, `name`, `shortDescription`, `description`, `history`, `category`, `region`, `city`, `address`, `location`, `images` (`cover`/`gallery`), `openingHours`, `entranceFee`, `contact` (`phone`/`website`), `visitDuration`, `accessibility`, `nearbyPlaceSlugs`, `featured`, `published` (set to `true` for every seeded record), `archived` (`false`), `verificationStatus` (preserved as-is from local data — every current record is `"sample"`), `sources` (the local `sourceUrl`, wrapped in an array), `lastVerifiedAt`, plus server-assigned `createdAt`/`updatedAt`.
- **Safety confirmed:** no `deleteMany`, no collection drop, no destructive reset anywhere in the script; it is not imported or invoked by the Next.js application itself (only runnable via `npm run db:seed`); every write is scoped to one slug at a time via upsert.
- **Exact command that will execute it:** `npm run db:seed`

**Waiting for explicit approval before this command is run.**
