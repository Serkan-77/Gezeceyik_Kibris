-- supabase/schema.sql
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New
-- query → paste → Run) against a fresh project. Safe to re-run — every
-- statement is idempotent (IF NOT EXISTS / OR REPLACE) and nothing here
-- ever drops or truncates a table.
--
-- Column names are camelCase and double-quoted throughout, matching this
-- app's existing domain-shape conventions (see src/lib/db/placeSchema.ts
-- and src/lib/repositories/placeMapper.ts) instead of the Postgres
-- convention of snake_case. If you ever query these tables directly in
-- the SQL Editor, remember to double-quote camelCase identifiers
-- (e.g. select "verificationStatus" from places) — Postgres silently
-- lowercases unquoted identifiers, which will not match these columns.

create extension if not exists pgcrypto;

-- ─── places ─────────────────────────────────────────────────────

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  "shortDescription" text not null,
  description text not null,
  history text,
  category text not null,
  region text not null,
  city text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  image text not null,
  gallery text[] not null default array[]::text[],
  "openingHours" jsonb,
  admission jsonb,
  phone text,
  website text,
  "estimatedVisitMinutes" integer,
  accessibility jsonb,
  "nearbyPlaceSlugs" text[] not null default array[]::text[],
  featured boolean not null default false,
  published boolean not null default false,
  archived boolean not null default false,
  "verificationStatus" text not null,
  "sourceUrl" text,
  "lastVerifiedAt" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists places_category_idx on places (category);
create index if not exists places_region_idx on places (region);
create index if not exists places_published_archived_idx on places (published, archived);
create index if not exists places_featured_idx on places (featured);

-- RLS is enabled with no policies defined: this app only ever accesses
-- these tables using the service role key (server-side only — see
-- src/lib/db/supabase.ts), which bypasses RLS entirely. Enabling it with
-- no policies is a defense-in-depth safeguard against the anon/public key
-- ever being misconfigured to reach these tables directly — the app does
-- not depend on it functionally.
alter table places enable row level security;

-- ─── transitRoutes ──────────────────────────────────────────────

create table if not exists "transitRoutes" (
  id uuid primary key default gen_random_uuid(),
  operator text not null,
  "fromRegion" text not null,
  "toRegion" text not null,
  "fromStop" jsonb not null,
  "toStop" jsonb not null,
  "durationMinutes" integer not null,
  "fareTRY" numeric,
  schedule jsonb not null,
  phone text[] not null default array[]::text[],
  notes text,
  "sourceUrl" text not null,
  "lastVerifiedAt" text not null,
  "verificationStatus" text not null,
  active boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists "transitRoutes_region_active_idx" on "transitRoutes" ("fromRegion", "toRegion", active);

alter table "transitRoutes" enable row level security;
