// components/seo/Breadcrumbs.tsx
// A single component renders both the visible trail and its
// BreadcrumbList JSON-LD from the exact same `items` array, so the two
// can never drift apart (the structured data must match real navigation).
// Deliberately subtle — small caption-sized text, no card/background — so
// it doesn't compete with a cinematic hero.

import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { breadcrumbSchema, BreadcrumbItem } from '@/lib/seo/structuredData';
import { SITE_URL } from '@/lib/config';

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const withAbsoluteUrls = items.map((item) => ({ ...item, url: `${SITE_URL}${item.url}` }));

  return (
    <>
      <nav aria-label="Sayfa yolu" className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-caption text-subtle">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={item.url} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-faint">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="text-muted">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="transition-colors hover:text-brand">
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
      <JsonLd data={breadcrumbSchema(withAbsoluteUrls)} />
    </>
  );
}
