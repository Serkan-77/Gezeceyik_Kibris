// app/robots.ts — robots.txt generation.

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Personal, localStorage-backed pages — empty and identical for every crawler, no SEO value.
      // /admin is also access-controlled (see src/proxy.ts) and must never be indexed.
      disallow: ['/favoriler', '/gezilerim', '/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
