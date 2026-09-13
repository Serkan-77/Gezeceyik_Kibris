'use client';
// components/ui/SafeImage.tsx
// A next/image that degrades honestly when the remote source fails to
// load — e.g. eemd.gov.ct.tr (the official antiquities-department source
// for some place photos) intermittently times out. Without this, a failed
// image just leaves a blank hole in a card; with it, the same branded
// "Gezeceyik" dark plate used everywhere else for a genuinely missing
// image appears, with an honest "Görsel yüklenemedi" label — never a
// silently swapped-in unrelated photo.

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export function SafeImage({ className = '', alt, fill, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1.5 bg-deep ${fill ? 'absolute inset-0' : 'h-full w-full'}`}
      >
        <span className="font-display text-lg text-white/25">Gezeceyik</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-white/35">Görsel yüklenemedi</span>
      </div>
    );
  }

  return <Image alt={alt} className={className} fill={fill} onError={() => setFailed(true)} {...rest} />;
}
