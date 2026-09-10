// app/opengraph-image.tsx
// Site-wide default OG image — applies to any route segment that doesn't
// define its own (see Next's file-convention fallback: nearest segment
// wins, root is the last resort). See lib/seo/ogImage.tsx for the shared
// layout also used by twitter-image.tsx.

import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/seo/ogImage';

export const alt = 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür';
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOgImage();
}
