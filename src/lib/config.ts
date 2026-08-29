// lib/config.ts
// Site-wide configuration derived from environment.

/**
 * Canonical site URL used for metadataBase, sitemap.xml, and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL before a production build/deploy — a production
 * build without it would otherwise silently ship metadata/sitemap/robots
 * pointing at localhost, which is a silent SEO defect rather than a crash.
 * Development/test builds fall back to localhost so `next dev` keeps working
 * without any env setup.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing required NEXT_PUBLIC_SITE_URL environment variable. ' +
        'Set it to the canonical production URL (e.g. https://cyprusdiscovery.com) ' +
        'before building/deploying — see .env.example.'
    );
  }

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
