// app/robots.ts — robots.txt generation.

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Personal/session-state pages — either empty for every crawler
      // (favoriler/gezilerim are localStorage-backed) or gated behind an
      // anonymous ownership cookie a crawler will never hold (/rotam and
      // /rotam/[id] — see context/DraftRouteContext.tsx), so there is
      // nothing indexable there and no reason to expose private route ids.
      // /admin is access-controlled separately (see src/proxy.ts) but is
      // disallowed here too, and /api is JSON-only, never a page to index.
      // Each of these also carries its own `robots: noindex` metadata as
      // defense in depth, in case a URL is ever discovered via an external
      // link rather than crawled directly.
      disallow: ['/favoriler', '/gezilerim', '/rotam', '/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
