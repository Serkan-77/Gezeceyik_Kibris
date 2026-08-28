// lib/config.ts
// Site-wide configuration derived from environment.

/**
 * Canonical site URL used for metadataBase, sitemap.xml, and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL before a production build/deploy.
 * Falls back to localhost so dev/build never silently ships a fake domain.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
