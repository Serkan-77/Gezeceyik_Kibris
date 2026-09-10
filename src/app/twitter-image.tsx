// app/twitter-image.tsx
// Same plate as opengraph-image.tsx — Twitter/X does not fall back to
// og:image tags reliably, so this file convention is needed separately.
// See lib/seo/ogImage.tsx for the shared layout.

import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/seo/ogImage';

export const alt = 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür';
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOgImage();
}
