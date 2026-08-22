// app/robots.ts — robots.txt generation.

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/coming-soon'],
    },
    sitemap: 'https://cyprus-discovery.com/sitemap.xml',
  };
}
