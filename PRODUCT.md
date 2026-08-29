# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are pre-trip planners: tourists researching and building an itinerary for Northern Cyprus (KKTC) before they arrive, mostly on desktop during planning sessions. They are choosing what to see across museums, castles, beaches, monasteries, archaeological sites, and scenic viewpoints, and want opening hours, admission fees, and transport information alongside a personalized multi-day itinerary built around their accommodation, duration, and interests.

## Product Purpose

Cyprus Discovery is a general Northern Cyprus travel discovery platform, not a single-category guide. It lets users explore and filter attractions across all categories, view practical visitor information (hours, admission, transport), browse an interactive map, and generate a personalized multi-day trip itinerary. Success means a visitor can go from "what's in Northern Cyprus?" to a concrete, workable day-by-day plan without leaving the site.

## Positioning

The differentiator is curation and editorial quality, not raw coverage. Where Google Maps or TripAdvisor return generic, unevenly-sourced listings for the region, Cyprus Discovery offers hand-curated, well-written, categorized content built specifically for Northern Cyprus, aiming for a premium/trustworthy feel rather than a directory feel. The rule-based multi-day trip planner (interest scoring, nearest-neighbour routing, timed daily schedules) is a supporting mechanism, not the primary pitch.

## Operating Context

- All content is in Turkish (`lang="tr"`, `og:locale: tr_TR`); multilingual support (Greek, English, Russian via next-intl) is a future milestone, not current scope.
- Core entity is `Place` (`src/types/place.ts`): a single model spanning museums, castles, beaches, monasteries, archaeological sites, and viewpoints, distinguished only by a `category` field — not separate types.
- All data reads go through `src/lib/places.ts` as the single data-access layer; today it's backed by a static `src/data/places.ts` array, with a planned migration to Supabase Postgres that should only require changing that one file.
- Favorites and trip-planner selections persist client-side in `localStorage` (`useFavorites`, `useTripSelection`) — no accounts, no backend.
- The trip planner (`src/lib/trip-planner/`) scores places against user interests/distance/must-visit picks, sequences them nearest-neighbour from the traveler's accommodation, and slots them into a timed daily schedule; public transit time estimates are a rough approximation (no real KKTC transit data exists yet).
- Interactive maps (main + per-place mini map) use Leaflet/OpenStreetMap, loaded client-only (`next/dynamic`, `ssr: false`).
- No database, no auth, no automated test suite yet.

## Capabilities and Constraints

- Northern Cyprus (KKTC/TRNC) is politically sensitive territory, recognized only by Turkey. Durable constraint: stay neutral and Turkish-first — present the product strictly as a travel guide, take no political stance, and don't editorialize on status/terminology beyond the region's common Turkish usage already in the codebase.
- Site domain is environment-driven (`NEXT_PUBLIC_SITE_URL` in `src/lib/config.ts`), used for `metadataBase`, sitemap, and robots — never hardcode a domain.
- `/favoriler` is intentionally excluded from indexing (personal, localStorage-only, no SEO value).
- "Today's hours" logic must be computed post-mount (`useTodayKey`), not during render, because pages are statically pre-rendered at build time and `new Date()` at render would cause hydration mismatches against the visitor's actual day.

## Brand Commitments

Site name is "Cyprus Discovery." No further identity constraints have been confirmed beyond what's already implemented (wordmark/logo SVG in Navbar and Footer, Playfair Display + Inter typefaces, orange/charcoal/warm-white palette) — these are current implementation, not yet confirmed as binding brand law.

## Evidence on Hand

- 21 sample `Place` records in `src/data/places.ts`, all flagged `verificationStatus: 'sample'` — hours, prices, and phone numbers are illustrative and unverified against official sources.
- Images are placeholder Unsplash/Wikimedia URLs, not licensed photography.
- Public transit time estimates in the trip planner are rough approximations, not real KKTC fare/schedule data.
- No real user research, testimonials, or analytics exist yet.

## Product Principles

- One `Place` model, many categories — category is data, never a type boundary; adding a new attraction type must not require a new schema.
- The data-access layer (`lib/places.ts`) is the only seam that should change when the backend changes (e.g., Supabase migration); pages and components stay backend-agnostic.
- Curation and editorial trustworthiness are the product's reason to exist over a generic map/directory — content quality is not a secondary concern.
- Stay politically neutral on Northern Cyprus's status; the product is a travel guide, not a platform for territorial claims.
- Sample/unverified data must stay clearly marked (`verificationStatus`) and never be presented to users as confirmed fact.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond standard semantic HTML and descriptive image alt text already present in the codebase (per README SEO section).
