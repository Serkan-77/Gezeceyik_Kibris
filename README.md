# Kuzey Kıbrıs Discovery

A Turkish-language travel and cultural discovery web app for Northern Cyprus (KKTC). It lets visitors browse museums, castles, beaches, and historical sites, view practical visitor information for each one, find them on an interactive map, generate a multi-day trip itinerary, save it for later, and — for the site operator — manage the underlying place data through a small admin panel.

## About

Kuzey Kıbrıs Discovery is a content and planning tool for people visiting Northern Cyprus. It helps someone decide what's worth visiting (browsable, filterable, searchable destination listings with real visitor detail — hours, admission, location) and turn that into an actual day-by-day plan (a wizard that generates a scheduled, mapped itinerary from a handful of preferences, which can then be saved and revisited).

The app's content is a dataset of 21 places across all six KKTC regions (Lefkoşa, Girne, Gazimağusa, İskele, Güzelyurt, Lefke), stored in MongoDB. Every record carries a `verificationStatus` — see [Data Verification](#data-verification) for what that means and the current state of each record.

## Features

- **Destination discovery** — browse all places, or category-locked listings for museums, castles, beaches, and historical places
- **Place detail pages** — hero image, editorial description, historical background, and a visitor-info panel
- **Opening hours** — per-day hours with a live "open now / closed today" status
- **Entrance fees** — free/paid status with adult and child pricing where available
- **Contact information** — phone, address, and an optional link to an official source
- **Region and category filtering** — filter listings by KKTC region and place category
- **Search** — free-text search across name, city, and description
- **URL-synced filters** — search/category/region/free-only state lives in the URL query string, so filtered views are shareable and back-button safe
- **Interactive map** — all places plotted on a Leaflet/OpenStreetMap map with custom on-brand markers and popups, plus a plain-list fallback for keyboard/screen-reader users
- **Directions** — a "get directions" action opens the place in Google Maps in a new tab (external; the app does not do its own turn-by-turn navigation)
- **Favorites** — save places to a personal list, persisted in the browser's `localStorage`
- **Trip selection** — mark places to prioritize in a generated trip plan, also `localStorage`-backed
- **Multi-step trip planner** — a wizard collects accommodation city, trip length, transport mode, category interests, and pace
- **Generated itineraries** — a day-by-day schedule with arrival/departure times, per-day cost and distance totals
- **Transport-aware feasibility** — a place physically out of range for the chosen transport mode (e.g. a castle 60km away when "walking" is selected) is never suggested, regardless of how well it otherwise matches
- **Saved trips ("Gezilerim")** — save a generated itinerary and revisit it later from `/gezilerim`, `localStorage`-backed like Favorites
- **Sightseeing route visualization** — each planned day is drawn on a Leaflet map as a numbered route from accommodation to each stop
- **Responsive interface** — mobile navigation drawer and a mobile-only sticky action bar (favorite / add to trip / directions) on place detail pages
- **Verification status** — every place carries a `sample` / `unverified` / `verified` badge, shown on its detail page
- **Admin panel** — a password-gated `/admin` area to publish/unpublish, archive, edit, and add places, backed by the same MongoDB collection the public site reads from

## Tech Stack

- **[Next.js](https://nextjs.org) 16** — App Router, Server Components, Server Actions, ISR (`revalidate`), static generation for place-detail pages, `proxy.ts` (the v16 replacement for `middleware.ts`)
- **[React](https://react.dev) 19** — including `useActionState` for the admin forms
- **[TypeScript](https://www.typescriptlang.org) 5** (strict mode)
- **[Tailwind CSS](https://tailwindcss.com) v4** — design tokens in `src/app/globals.css`
- **[Leaflet](https://leafletjs.com) 1.9** + **[OpenStreetMap](https://www.openstreetmap.org)** tiles — used directly, no React wrapper
- **[MongoDB](https://www.mongodb.com) (official Node.js driver)** + **MongoDB Atlas** — primary place-content database
- **[Zod](https://zod.dev)** — validates every write to MongoDB, from both the seed script and the admin panel
- **`server-only`** — build-time guard on the data-access seam
- **[Vitest](https://vitest.dev)** — unit tests for the trip-planner engine and the MongoDB ⇄ domain mapping layer
- **`tsx`** (dev) — runs the database scripts
- **ESLint 9** (`eslint-config-next`)
- **Node's built-in `crypto`** — HMAC-based admin session token, no auth library dependency

## Architecture

```
Public UI (Server Components for pages/listings, Client Components for
interactive bits — filters, map, favorites, planner wizard, saved trips)
        ↓
src/lib/places.ts        the public data seam — every public read goes through here
        ↓
src/lib/repositories/    placeRepository.ts (MongoDB queries/mutations)
                         placeMapper.ts (MongoDB document ⇄ domain Place)
        ↓
src/lib/db/mongodb.ts    connection layer
        ↓
MongoDB Atlas — cyprus_discovery.places

Admin UI (src/app/admin/**, Server Components + Server Actions)
        ↓ reads/writes placeRepository directly — raw PlaceDocument/PlaceInput,
        ↓ not the public, filtered, mapped domain shape
        ↓ every route gated by src/proxy.ts; every Server Action re-checks
        ↓ the session itself (a Proxy matcher does not protect Server Actions)
src/lib/admin/session.ts  password check + HMAC session-token verification
```

`src/lib/places.ts` is `server-only` — a Client Component cannot import it (this is enforced at build time). Client Components that need place data (the favorites page, the trip planner wizard) receive it as a prop from a Server Component parent instead. The admin panel is a separate, parallel path: it talks to `placeRepository` directly since it needs the raw document shape (including unpublished/archived records) that the public seam deliberately filters out.

**Development fallback:** every function in `src/lib/places.ts` tries MongoDB first. Outside production, if that read fails (e.g. the database is unreachable), it logs a clear server warning and falls back to a local static dataset (`src/data/places.ts`) instead, so `npm run dev` stays usable without a live database connection. **In production, that fallback does not happen** — a failed read is left to fail visibly rather than silently serving local sample data as if it were real content. A malformed individual document (missing required fields) is handled the same way at both layers: skipped with a console warning rather than crashing the page or the build.

## Project Structure

```
src/
  proxy.ts                 Next.js 16 Proxy — gates every /admin/* route (see Admin Panel)
  app/                     Next.js App Router routes (see Routes below)
    admin/                 Password-gated admin panel (dashboard, place form, Server Actions)
    places/[slug]/         Place detail route (SSG + on-demand rendering)
    globals.css             Design tokens + base styles (Tailwind v4 @theme)
    layout.tsx, sitemap.ts, robots.ts, not-found.tsx
  components/
    admin/                 Admin-only form/login components (Client Components)
    home/                  Homepage sections (Hero, FeaturedRail, CategoryGrid, RegionGrid, ...)
    layout/                Navbar, Footer
    map/                   Leaflet map components + their client-only wrappers
    places/                Place cards, filters, listing header, detail-page info panel
    trip/                  Planner wizard, generated itinerary view, route map
    ui/                    Design-system primitives (Button, Input, Select, Badge, Surface, icons, ...)
    pages/                 Client wrapper components for specific routes (Favoriler, Gezilerim)
  data/
    places.ts              The local dataset — seed source and dev fallback (21 places)
  hooks/                   useFavorites, useTripSelection, useSavedTrips, useLocalStorageSet, useTodayKey, useInView
  lib/
    places.ts               Public data-access seam (MongoDB-first, dev fallback) — server-only
    admin/
      session.ts             Single-password admin session: password check + HMAC token verify
    db/
      mongodb.ts             Connection layer
      placeDocument.ts        MongoDB document type + Zod validation schemas
    repositories/
      placeRepository.ts      Queries/mutations against the `places` collection
      placeMapper.ts           MongoDB document ⇄ domain Place conversion, incl. GeoJSON
    trip-planner/            Itinerary scoring, scheduling, distance math, shared types (+ *.test.ts)
    format.ts                Pure display formatters (client-importable)
    i18n/tr.ts                Turkish UI string catalogue
    config.ts, categoryIcons.ts, leafletIcons.ts
  types/
    place.ts                 Place/Region/Category/Admission/etc. domain types
scripts/
  loadEnv.ts                 .env loader for the scripts below
  verify-mongodb.ts           npm run db:verify
  ensure-indexes.ts           npm run db:indexes
  seed-places.ts              npm run db:seed
public/
  leaflet/                   Marker icon assets used by every map component
docs/
  CODEBASE_CLEANUP_REPORT.md
  MONGODB_SETUP_GUIDE.md
  MONGODB_INTEGRATION_REPORT.md
vitest.config.mts            Vitest config (native tsconfig path resolution)
```

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured places, a short history section, category and region grids, and a planner call-to-action |
| `/places` | All places, with search/category/region/free-only filtering |
| `/museums`, `/castles`, `/beaches`, `/historical-places` | Category-locked listings (same filter UI, category pre-selected) |
| `/places/[slug]` | Individual place detail page — statically pre-rendered where possible, rendered on-demand otherwise |
| `/harita` | Full interactive map of every place, with an accessible list fallback below it |
| `/favoriler` | The `localStorage`-backed favorites list (excluded from `robots.txt`/sitemap — it's per-browser and empty on first load for every crawler) |
| `/gezi-planla` | The trip planner wizard and, once generated, the resulting itinerary (with a "save this trip" action) |
| `/gezilerim` | Saved trip itineraries, `localStorage`-backed (also excluded from `robots.txt`/sitemap) |
| `/admin`, `/admin/login`, `/admin/places/new`, `/admin/places/[slug]/edit` | Password-gated admin panel — see [Admin Panel](#admin-panel) (excluded from `robots.txt`) |
| `/sitemap.xml`, `/robots.txt` | Generated from `src/app/sitemap.ts` / `robots.ts` |

## MongoDB

The place-content database. Configured on MongoDB Atlas (see
`docs/MONGODB_SETUP_GUIDE.md` for the Atlas-side setup); this section covers
how the app talks to it.

- **Connection**: `src/lib/db/mongodb.ts` — one cached client per server process in production, cached on `globalThis` across dev-server hot reloads in development. Env config (`MONGODB_URI`, `MONGODB_DB`) is validated lazily, and connection errors are stripped of the connection string before ever being thrown or logged.
- **Repository**: `src/lib/repositories/placeRepository.ts` — every query/mutation against the `places` collection. Public reads only ever return `published: true, archived: { $ne: true }` documents; the admin panel is the one caller of the unfiltered `findAll`/`findBySlugAny` and of the mutation functions (`createPlace`, `updatePlace`, `publishPlace`, `unpublishPlace`, `archivePlace`).
- **Mapping**: `src/lib/repositories/placeMapper.ts` converts between the MongoDB document shape and the app's `Place` type for public reads — the public UI never sees a raw MongoDB document or an `ObjectId`. The admin panel works with the raw document/input shape directly instead, since it needs to edit fields (like `published`/`archived`) the public shape doesn't expose.
- **GeoJSON**: place coordinates are stored as `location: { type: 'Point', coordinates: [longitude, latitude] }` — longitude first, per the GeoJSON spec (the reverse of the app's own `latitude`/`longitude` field order). The mapper handles this conversion in both directions.
- **Collection**: `cyprus_discovery.places` — 21 documents, unique index on `slug`, `2dsphere` index on `location`.
- **Fallback**: see Architecture above — MongoDB-first with a development-only local fallback, no fallback in production.

## Environment Variables

```
MONGODB_URI=
MONGODB_DB=
NEXT_PUBLIC_SITE_URL=
ADMIN_PASSWORD=
```

- `MONGODB_URI` / `MONGODB_DB` — required for MongoDB-backed reads (the app still runs in development without them, via the local fallback described above).
- `NEXT_PUBLIC_SITE_URL` — the canonical production URL, used for `metadataBase`, `sitemap.xml`, and `robots.txt`. Falls back to `http://localhost:3000` in development, but **`src/lib/config.ts` throws if it's unset when `NODE_ENV=production`** — a production build can't silently ship metadata pointing at localhost.
- `ADMIN_PASSWORD` — the single shared password for `/admin` (see [Admin Panel](#admin-panel)). Required for any `/admin` route to work at all; there is no default.

Real values belong in `.env.local` at the project root — never commit them. `.env.example` documents all four as empty placeholders.

## Installation

```bash
git clone https://github.com/Serkan-77/Cyprus-Travel-.git
cd Cyprus-Travel-
npm install
cp .env.example .env.local   # then fill in MONGODB_URI, MONGODB_DB, NEXT_PUBLIC_SITE_URL, ADMIN_PASSWORD
npm run dev
```

The app is served at `http://localhost:3000`. Without a valid `.env.local`, `npm run dev` still works for the public site — it falls back to local sample data with a console warning (see Architecture above) — but `/admin` requires `ADMIN_PASSWORD` to be set to work at all.

## Available Scripts

From `package.json`:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server (Turbopack) |
| `npm run build` | Production build, including static generation of place-detail pages |
| `npm run start` | Serves the production build created by `npm run build` |
| `npm run lint` | Runs ESLint over the project |
| `npm test` | Runs the Vitest suite once (`vitest run`) |
| `npm run test:watch` | Runs Vitest in watch mode |
| `npm run db:verify` | Read-only check that the app can connect to MongoDB and see the `places` collection |
| `npm run db:indexes` | Idempotently ensures the required indexes exist (never drops/recreates existing ones) |
| `npm run db:seed` | Migrates `src/data/places.ts` into MongoDB, upserted by slug |

## Testing

`npm test` runs the Vitest suite — unit tests for the parts of the codebase that are pure logic and worth pinning down with real assertions, rather than an end-to-end or UI test suite:

- `src/lib/repositories/placeMapper.test.ts` — MongoDB document ⇄ domain `Place` conversion, GeoJSON coordinate order, and that a malformed document is skipped rather than crashing a listing
- `src/lib/trip-planner/distance.test.ts` — haversine distance and travel-time estimates
- `src/lib/trip-planner/scoring.test.ts` — place scoring, including the hard transport-mode distance cutoff
- `src/lib/trip-planner/scheduleDay.test.ts` — daily schedule construction (arrival times, lunch break, cost totals)
- `src/lib/trip-planner/planner.test.ts` — full itinerary generation (candidate selection, must-visit guarantee, day chunking)

There is no test coverage for UI components, the admin panel's Server Actions, or the MongoDB repository layer itself (the latter would need an integration test against a real or in-memory MongoDB instance, which doesn't exist yet) — see `docs/MONGODB_INTEGRATION_REPORT.md` for other known gaps.

## Database Seed

`scripts/seed-places.ts` (`npm run db:seed`) reads every record from `src/data/places.ts` (21 records) and upserts each into the `places` collection by its `slug`:

- A slug not already present is **inserted**, published (`published: true`).
- A slug already present is compared field-by-field and only **updated** (with a fresh `updatedAt`) if something actually changed — otherwise reported as **unchanged**.
- Coordinates are converted from the local dataset's `latitude`/`longitude` into `location: { type: 'Point', coordinates: [longitude, latitude] }`.
- There is no `deleteMany` and no collection reset anywhere in the script — every write is scoped to one slug at a time, and documents with slugs outside the local dataset (if any) are never touched.
- The script prints an inserted/updated/unchanged/error count when it finishes.

This has been run against the live database — the `places` collection currently holds all 21 records from the local dataset. Editing a place afterwards through the [admin panel](#admin-panel) is the intended way to keep MongoDB up to date going forward; re-running the seed script will overwrite fields that differ from `src/data/places.ts`, so the two can drift if both are used to edit the same record.

## Maps

Every map in the app is built directly on **Leaflet** with **OpenStreetMap** tiles — there is no Google Maps SDK, no paid map provider, and no `react-leaflet` wrapper; the map components call the `leaflet` package's API directly.

- `PlacesMap` (`/harita`) — every place plotted as a custom on-brand marker, with a popup showing category, name, city, admission, and a link to the detail page.
- `PlaceMiniMap` — a single-marker map embedded in each place's detail-page info panel.
- `RouteMap` — used for a generated itinerary day: draws the accommodation as a start marker, each stop as a numbered marker in visit order, and connects them with a polyline that fades in on mount.

"Directions" is a link to Google Maps' web search for the place's name and address, opened in a new tab — the app does not implement its own routing or turn-by-turn navigation, and the route lines drawn on `RouteMap` are straight lines between coordinates (in visit order), not road-following paths.

## Trip Planner

The planner (`/gezi-planla`) is a client-side, rule-based engine — not an external routing or optimization service. The server page fetches the full place catalog and passes it into the wizard as a prop; the wizard itself still runs entirely in the browser.

**Inputs**, collected by a 5-step wizard:
1. Accommodation — one of six preset KKTC town-center locations
2. Trip length — 1 to 14 full days
3. Transport mode — car, walking, or public transit
4. Interests — any number of preferred categories, plus an "only free places" toggle
5. Pace — relaxed (2 places/day), balanced (3/day), or intensive (4/day)

**How it generates a plan** (`src/lib/trip-planner/`):
- Every place is given a 0–100 score for the given input — a base score adjusted for category match, distance from accommodation, free/paid status, and a manual "must-visit" override for anything the user had already added to their trip selection.
- **Before any of that**, a place beyond a hard, transport-mode-specific distance ceiling from the accommodation scores exactly `0` and is never selected — **walking**: 3km, **public transit**: 80km, **car**: 120km (roughly the island's own span, so effectively a sanity ceiling rather than a real constraint for driving). This applies even to a "must-visit" place: physical reachability wins over preference, so a place a visitor can't actually walk to is silently dropped from a walking-mode plan rather than shown as if it were included.
- The top-scoring places are selected, then ordered with a simple **greedy nearest-neighbour** walk starting from the accommodation — not a true traveling-salesman solver, and distances are straight-line haversine, not road distance.
- Selected places are chunked into days and scheduled: a fixed 09:00 start, a 60-minute lunch break inserted around midday, each stop's visit duration from its data (or a 60-minute default), and travel time estimated from a fixed average speed per transport mode.

**Output**: a day-by-day schedule with arrival/departure times, travel time and distance to the next stop, admission cost, and day/trip totals — rendered with each day's route drawn on a `RouteMap`. From the result screen, the itinerary can be saved to `/gezilerim` (see below). The whole calculation runs synchronously in the browser; there is no server request involved in generating a plan.

## Saved Trips ("Gezilerim")

`/gezilerim` lists trip itineraries the visitor has saved from the planner's result screen, via `useSavedTrips` (`src/hooks/useSavedTrips.ts`) — the same `localStorage`-backed pattern as Favorites, but storing a full `TripItinerary` object per entry (not just a slug) so a saved trip can be rendered standalone, with no re-fetch or re-generation needed. Each entry can be expanded (reusing the same `ItineraryView` the planner's result screen uses, route map included) or removed. Like Favorites, this is per-browser: there is no account system, so a saved trip does not follow a visitor across devices.

## Admin Panel

A small, password-gated `/admin` area for maintaining the `places` collection directly — publish/unpublish a place, archive one, edit any field (including opening hours and admission fees), or add a new place — without touching the database by hand.

**Access model**: there is exactly one shared password (`ADMIN_PASSWORD`), no user accounts, no per-user permissions. This is intentionally minimal — appropriate for a single-operator internal tool, not a multi-admin CMS.

- **`src/proxy.ts`** — Next.js 16's Proxy (the renamed `middleware.ts`) redirects any `/admin/*` request without a valid session cookie to `/admin/login`, before the page ever renders.
- **`src/lib/admin/session.ts`** — the session cookie's value is an HMAC of a fixed string keyed by `ADMIN_PASSWORD`, not the password itself, so the secret never round-trips to the browser. Verification uses a timing-safe comparison.
- **`src/app/admin/actions.ts`** — every mutation (login, logout, create/update/publish/unpublish/archive a place) is a Server Action, and **every one of them re-verifies the session independently** — a Proxy-level redirect controls which *pages* render, but a Server Action is a separately POST-able endpoint and Next.js's own guidance is not to rely on Proxy alone to protect it.
- The admin UI is intentionally plain (a table, a form) rather than styled to the same level as the public site — it's an internal tool, not visitor-facing.
- `/admin/*` is excluded from `robots.txt` and never appears in the sitemap.

**Setup**: set `ADMIN_PASSWORD` in `.env.local` to a long random value before using the panel — there is no default, and the panel does not function without it.

## Data Verification

Every place carries a `verificationStatus`: `sample`, `unverified`, or `verified`.

- **`verified`** (7 places) — a straightforward, well-corroborated fact (e.g. a beach or open urban space genuinely has no admission/fixed hours), or a fact confirmed directly against an official source.
- **`unverified`** (14 places) — sourced from a credible reference (chiefly the KKTC Department of Antiquities and Museums' official visiting-hours/tariff page, `eemd.gov.ct.tr`) but not fully re-confirmed, or subject to real uncertainty the record's `notes` field spells out (seasonal hour changes, Turkish Lira price inflation, conflicting secondary sources on a closed day).
- **`sample`** — none currently. Every record has been checked against at least one external source; none are placeholder/invented data.

This is shown to visitors as a status badge on each place's detail page. It is not a guarantee: opening hours and prices in Northern Cyprus change often (particularly admission fees, given Turkish Lira inflation), and a handful of fields (e.g. individual phone numbers or exact mosque visiting windows) could not be confirmed from any public source and were deliberately left blank rather than invented. Notably, **Othello Kalesi is currently marked closed for restoration** with no announced reopening date, based on a real news source cited in that record's `sourceUrl` — check before planning a visit around it.

## Documentation

- **`docs/CODEBASE_CLEANUP_REPORT.md`** — a prior dead-code, duplicate-logic, and unused-dependency cleanup pass on this repository.
- **`docs/MONGODB_SETUP_GUIDE.md`** — step-by-step MongoDB Atlas setup walkthrough (account, cluster, database user, network access, indexes).
- **`docs/MONGODB_INTEGRATION_REPORT.md`** — what was actually implemented when wiring the app up to MongoDB: architecture, file-by-file changes, validation, and known limitations.
