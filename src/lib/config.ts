// lib/config.ts
// Site-wide configuration derived from environment.

/**
 * Canonical site URL used for metadataBase, sitemap.xml, robots.txt, and
 * every `alternates.canonical` in the app. This is the ONE place that
 * needs to change when a custom domain is connected later — set
 * NEXT_PUBLIC_SITE_URL to the new domain and every page's canonical/OG/
 * sitemap URL follows automatically, with no per-page edits.
 *
 * Falls back to Vercel's own production-domain env var
 * (VERCEL_PROJECT_PRODUCTION_URL — the stable production domain, distinct
 * from VERCEL_URL which changes per preview deployment) so a production
 * build deployed on Vercel without NEXT_PUBLIC_SITE_URL explicitly set
 * still gets a correct, real origin instead of silently pointing at
 * localhost. Still throws if neither is available in production — a
 * build genuinely has no way to know its own public URL at that point,
 * and shipping metadata/sitemap/robots pointing at localhost would be a
 * silent SEO defect rather than a loud, fixable error.
 *
 * Development/test builds fall back to localhost so `next dev` keeps
 * working without any env setup.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured;

  const vercelProductionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionDomain) return `https://${vercelProductionDomain}`;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing required NEXT_PUBLIC_SITE_URL environment variable (and no ' +
        'VERCEL_PROJECT_PRODUCTION_URL fallback was available either). ' +
        'Set NEXT_PUBLIC_SITE_URL to the canonical production URL before ' +
        'building/deploying — see .env.example.'
    );
  }

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
