// lib/seo/ogImage.tsx
// Shared generator behind app/opengraph-image.tsx and app/twitter-image.tsx —
// both social platforms want the same 1200x630 plate, so one Satori tree
// backs both file conventions instead of duplicating the layout.
//
// The background illustration already reserves its own left-hand paper
// band (a survey-plate coastline scene, castle + compass rose), so this
// only lays text into that band rather than compositing a separate paper
// fill underneath.

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

async function loadAssets() {
  const dir = join(process.cwd(), 'src/assets/og');
  const [background, anton, jbmBold, jbmSemiBold] = await Promise.all([
    readFile(join(dir, 'og-background.png')),
    readFile(join(dir, 'Anton-Regular.ttf')),
    readFile(join(dir, 'JetBrainsMono-Bold.ttf')),
    readFile(join(dir, 'JetBrainsMono-SemiBold.ttf')),
  ]);
  return { background, anton, jbmBold, jbmSemiBold };
}

// CSS `text-transform: uppercase` uses locale-unaware case folding, which
// turns Turkish 'i' into plain 'I' instead of the dotted 'İ' the
// language needs — so headline/eyebrow copy is upper-cased here with the
// 'tr' locale instead, and rendered as already-uppercase text.
const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR');

export async function renderOgImage(): Promise<ImageResponse> {
  const { background, anton, jbmBold, jbmSemiBold } = await loadAssets();
  const backgroundSrc = `data:image/png;base64,${background.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#FAFAFA',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          width={OG_IMAGE_SIZE.width}
          height={OG_IMAGE_SIZE.height}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />

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
              color: '#1D5C82',
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
              color: '#141414',
            }}
          >
            <span>{trUpper('Gezeceyik')}</span>
            <span>{trUpper('Kıbrıs')}</span>
          </div>

          <div style={{ display: 'flex', width: 160, height: 3, background: '#B3811E', marginTop: 28 }} />

          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontFamily: 'JetBrains Mono',
              fontWeight: 600,
              fontSize: 21,
              lineHeight: 1.5,
              color: '#4C4C4C',
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
