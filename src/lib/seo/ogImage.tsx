// lib/seo/ogImage.tsx
// Shared generator behind app/opengraph-image.tsx and app/twitter-image.tsx —
// both social platforms want the same 1200x630 plate, so one Satori tree
// backs both file conventions instead of duplicating the layout.
//
// Third rebuild, 2026-09-13: the old background was a baked PNG (survey-
// plate illustration, castle + compass rose) drawn for the earlier "Kıbrıs
// Atlas" cold-palette system — recoloring a raster asset isn't possible,
// so the coastline is now drawn procedurally instead, straight from the
// same real geometry (lib/geo/cyprusOutline.ts) the Hero signature moment
// and GeographyBand use. This also means the social card can never drift
// out of sync with the live palette again — it's tokens-in-code, not a
// static export.

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CYPRUS_PATH, CYPRUS_VIEWBOX } from '@/lib/geo/cyprusOutline';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

async function loadAssets() {
  const dir = join(process.cwd(), 'src/assets/og');
  const [anton, jbmBold, jbmSemiBold] = await Promise.all([
    readFile(join(dir, 'Anton-Regular.ttf')),
    readFile(join(dir, 'JetBrainsMono-Bold.ttf')),
    readFile(join(dir, 'JetBrainsMono-SemiBold.ttf')),
  ]);
  return { anton, jbmBold, jbmSemiBold };
}

// CSS `text-transform: uppercase` uses locale-unaware case folding, which
// turns Turkish 'i' into plain 'I' instead of the dotted 'İ' the
// language needs — so headline/eyebrow copy is upper-cased here with the
// 'tr' locale instead, and rendered as already-uppercase text.
const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR');

export async function renderOgImage(): Promise<ImageResponse> {
  const { anton, jbmBold, jbmSemiBold } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#F7F3EA',
        }}
      >
        {/* Right-hand panel: the real coastline on the site's deep-evening
            ground, the same recipe as the homepage Hero — so the social
            card and the site it links to feel like the same object. */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 620, display: 'flex', background: '#12222E' }}>
          <svg
            viewBox={CYPRUS_VIEWBOX}
            width={620}
            height={630}
            style={{ position: 'absolute', top: 40, left: -40 }}
          >
            <path d={CYPRUS_PATH} fill="none" stroke="#F4F0E6" strokeWidth={3} strokeOpacity={0.9} />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 620,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 0 0 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 3,
              color: '#1C5470',
            }}
          >
            {trUpper('Kuzey Kıbrıs Gezi Rehberi')}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 20,
              fontFamily: 'Anton',
              fontSize: 100,
              lineHeight: 0.92,
              letterSpacing: -1,
              color: '#1B1712',
            }}
          >
            <span>{trUpper('Gezeceyik')}</span>
            <span>{trUpper('Kıbrıs')}</span>
          </div>

          <div style={{ display: 'flex', width: 160, height: 3, background: '#AD7A17', marginTop: 28 }} />

          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontFamily: 'JetBrains Mono',
              fontWeight: 600,
              fontSize: 21,
              lineHeight: 1.5,
              color: '#55524A',
              maxWidth: 480,
            }}
          >
            Müzeler, kaleler, plajlar ve tarihi yerler — tüm altı bölgede keşfedin.
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: 'Anton', data: anton, style: 'normal', weight: 400 },
        { name: 'JetBrains Mono', data: jbmSemiBold, style: 'normal', weight: 600 },
        { name: 'JetBrains Mono', data: jbmBold, style: 'normal', weight: 700 },
      ],
    }
  );
}
