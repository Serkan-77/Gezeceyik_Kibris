# Codebase Cleanup Report

Scope: `src/`, `public/`, and project config. The app was mid-redesign when this
pass started (many files already modified/added/deleted, uncommitted). That
in-progress redesign was treated as the current baseline and left untouched —
this cleanup only removes code/assets that are dead *in that current state*,
and consolidates verbatim-duplicated logic. No product behavior, routing,
design, or architecture was changed.

## Files removed

- **`src/hooks/useGeolocation.ts`** — a complete, self-contained Geolocation
  API hook, never imported anywhere in the app. The "distance from me"
  feature it belonged to (see `getPlacesNearCoordinates` / `haversineMeters`
  below) was never wired into any page or component.
- **`public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`** —
  leftover `create-next-app` boilerplate icons. Grepped for every filename
  across `src/`; none are referenced. (`public/leaflet/*.png` and
  `favicon.ico` *are* used and were kept — see Preserved section.)

## Code removed

All of the following were confirmed unused via `eslint`'s `no-unused-vars`,
a full `knip` unused-exports/files/deps scan, and manual grep verification
that nothing outside the declaring file imports them.

- **`src/lib/places.ts`**: removed `getPlacesByRegion`, `filterPlaces` +
  `PlaceFilterOptions`, `haversineMeters`, `getPlacesNearCoordinates` +
  `PlaceWithDistance`, `formatAdmission`, `formatDay`, `getTodayHours`,
  `isOpenNow`, `formatDuration`, `getPlaceCountByCategory`. These were an
  older implementation layer — `PlaceInfoPanel.tsx` now computes admission
  text and today's-hours status inline (via `useTodayKey`), `PlaceFilters.tsx`
  now filters inline against URL search params, and `ItineraryView.tsx` has
  its own duration formatter. None of the old versions had any remaining
  caller.
- **`src/components/ui/IconButton.tsx`**: removed the unused `IconButton`
  component (plain icon button) along with its now-unused `sizeClass` /
  `toneClass` maps. Only `IconToggleButton` (favorite/add-to-trip toggles) is
  actually used anywhere in the app.
- **`src/lib/i18n/tr.ts`**: removed unused `TrKeys` type alias (`typeof tr`),
  never referenced.
- **`src/lib/trip-planner/types.ts`**: removed unused `TripCostSummary`
  interface — described a trip cost-breakdown feature that was never
  implemented or referenced anywhere.

## Refactors made

- **Consolidated `fixLeafletIcons()`**: this exact function (patches
  Leaflet's default marker icon URLs for Next.js) was duplicated verbatim in
  `PlacesMap.tsx`, `PlaceMiniMap.tsx`, and `RouteMap.tsx`. Extracted to a new
  `src/lib/leafletIcons.ts`, all three now import it. Removes ~39 lines of
  triplicated code, zero behavior change.
- **Consolidated favorites/trip-selection localStorage logic**: `useFavorites`
  and `useTripSelection` each independently implemented an identical
  "persist a string array to localStorage, hydrate on mount, toggle/add/
  remove/clear" pattern. Extracted the shared plumbing into
  `src/hooks/useLocalStorageSet.ts`; both hooks now call it with their own
  storage key and re-export under their original field names
  (`favorites`/`isFavorite` vs. `selected`/`isSelected`/`count`), so every
  consumer (`FavoriteButton`, `AddToTripButton`, `FavorilerClient`,
  `PlannerWizardClient`) is unaffected.
- **`PlaceCard.tsx`**: had its own local one-line `formatDistance`, duplicating
  the (until-then-unused) one in `lib/places.ts`. Now imports the shared
  version instead — same output, one implementation.
- **`lib/categoryIcons.ts`**: `CATEGORY_ICON_PATHS` was exported but only
  ever used inside the same file (by `categoryGlyphSvg`); made module-private.
- **`IconButton.tsx`**: `IconToggleTone` was exported but only used inside the
  same file; made module-private (alongside the `IconButton` removal above).
- **`MobileActionBar.tsx`**: removed an unnecessary `'use client'` directive.
  The component uses no hooks or browser APIs — it only composes
  `FavoriteButton` / `AddToTripButton` / `Button` (which are already Client
  Components) and does a plain string `encodeURIComponent` call. It's now a
  Server Component, and Next can render it on the server for the place-detail
  page. Verified via server-rendered HTML that its markup is unchanged.
- **`RouteMap.tsx`**: merged two separate `import { X } from '@/lib/trip-planner/types'` statements into one.
- **`eslint.config.mjs`**: added `.claude/**` to `globalIgnores`. The vendored
  Claude Code skill tooling under `.claude/skills/` was being linted as if it
  were app source, producing 146 irrelevant warnings on every `npm run lint`
  run. Lint now only reports on the app itself (0 warnings).

## Dependencies removed

- **`react-leaflet`** (`package.json` dependency) — not imported anywhere;
  every map component (`PlacesMap`, `PlaceMiniMap`, `RouteMap`) uses the raw
  `leaflet` package directly. Ran `npm uninstall react-leaflet` to remove it
  from `node_modules` and sync `package-lock.json`.

## Files intentionally preserved

- **`BadgeVariant`, `ButtonVariant`, `ButtonSize`, `VerificationStatus`,
  `Accessibility`, `Admission`, `Pace`** (type-only exports in `Badge.tsx`,
  `Button.tsx`, `types/place.ts`, `trip-planner/types.ts`) — flagged by
  `knip` as "unused exports" because nothing outside the declaring file
  imports them, but each is used internally in its own file (as a prop type
  or field type) and exporting it is normal design-system/API surface for a
  UI primitive or domain type. Type-only exports have zero runtime/bundle
  cost, so there's no benefit to removing them, and doing so would narrow a
  reasonable public API for no reason.
- **`public/leaflet/marker-icon.png`, `marker-icon-2x.png`, `marker-shadow.png`** —
  looked like leftover Leaflet defaults at a glance, but all three are
  actively referenced (via `fixLeafletIcons`, now shared) by every map
  component. Kept.
- **`.claude/`, `PRODUCT.md`, `skills-lock.json`** — untracked
  tooling/product-notes files outside the application source tree. Out of
  scope for an app codebase cleanup; left untouched.
- **107 files under `.claude/skills/impeccable/scripts/`** — `knip` reports
  these as "unused files" because nothing in `src/` imports them, but they're
  vendored Claude Code skill scripts invoked by the Claude Code CLI itself,
  not application code. Not touched.
- **`PlaceCard.tsx`'s `distanceMeters` optional prop** — currently never
  passed by any caller (`PlaceGrid` always renders without it), but it's a
  small, reasonable extension point for a "sort by distance" feature and its
  formatting now goes through the shared `formatDistance`. Left as-is rather
  than stripped, since removing it would shrink `PlaceCard`'s public API for
  a prop that costs nothing to keep.

## Validation

- **TypeScript** (`tsc --noEmit`): clean, 0 errors (before and after).
- **Lint** (`eslint .`): clean, 0 warnings/errors (was 146 warnings, all from
  vendored `.claude/` tooling — see eslint config fix above; app source was
  already 0 before and after).
- **Production build** (`next build`): succeeds. Same 35-route output
  (9 static app pages, 21 SSG place-detail pages, `/robots.txt`,
  `/sitemap.xml`, `/_not-found`) before and after.
- **Dev server smoke test**: started `next dev`, confirmed `/`, `/places`,
  `/places/[slug]`, `/harita`, `/favoriler`, `/gezi-planla` all return HTTP
  200 with no server-side errors in the dev log, and verified via raw HTML
  that the now-server-rendered `MobileActionBar` still emits its expected
  markup (favorite button, add-to-trip button, directions link).
- **Not verified**: interactive client-side behavior (favorite/add-to-trip
  toggling, Leaflet map rendering and pin interaction, the trip-planner
  wizard flow) could not be click-tested — the Chrome browser automation
  tool was unavailable in this session ("browser extension is not
  connected"). The consolidated hooks and map-icon logic are behavior-
  preserving by construction (same code, same output, just de-duplicated),
  but a manual click-through of favorites, the map, and the planner wizard
  is recommended before shipping.

## Remaining technical debt

- `ItineraryView.tsx`'s inline duration formatter (`${h}sa ${m}dk`, no
  spaces) and `lib/places.ts`'s old `formatDuration` (which had spaces,
  `${h} sa ${m} dk`) formatted the same kind of value slightly differently.
  The old one was deleted as dead code rather than reconciled with the new
  one, since picking a single canonical format would change visible text —
  out of scope for a behavior-preserving cleanup.
- No automated test suite exists in this project. This cleanup was validated
  via `tsc`/`eslint`/`next build`/server-render smoke checks only; there are
  no unit or integration tests to run.
- The design-system components (`Badge`, `Button`, `IconButton`, etc.)
  inconsistently export their variant/size union types — some do, some
  don't. Harmless today (see Preserved section) but a future pass could
  standardize whether UI primitives always export their variant types.
- `knip` and `eslint` were run only against the current working tree; no
  `knip.json` was added to the repo, so a future contributor re-running
  `npx knip` will need to re-exclude `.claude/` manually (already excluded
  from `eslint`, not from `knip`).
