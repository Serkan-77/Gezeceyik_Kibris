// app/robots.ts — robots.txt generation.

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Personal, localStorage-backed page — empty and identical for every crawler, no SEO value.
      disallow: ['/favoriler'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
