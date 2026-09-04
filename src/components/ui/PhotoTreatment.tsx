// components/ui/PhotoTreatment.tsx
// Three distinct, deliberately different image states — never blurred
// together, and cartographic line art is never a substitute for an actual
// (even unverified) photograph:
//
//   verified    — full color, no treatment.
//   unverified  — also full color (photography is the site's strongest
//                 visual asset and most records carry this status — a
//                 desaturation wash here previously flattened almost every
//                 photo on the site). Marked, not hidden, via an explicit
//                 "Temsili görsel" caption chip instead of a color treatment.
//   none        — no image field at all. Falls back to a quiet island
//                 contour on stone, purely as a placeholder texture.
//
// See lib/format.ts `isImageRepresentative` — this reuses that same
// record-level trust signal rather than inventing a parallel one.

import Image from 'next/image';
import { VerificationStatus } from '@/types/place';
import { isImageRepresentative } from '@/lib/format';
import { IslandLineArt } from '@/components/graphics/IslandLineArt';

interface PhotoTreatmentProps {
  src?: string;
  alt: string;
  verificationStatus: VerificationStatus;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function PhotoTreatment({ src, alt, verificationStatus, className = '', sizes, priority }: PhotoTreatmentProps) {
  if (!src) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-surface-muted ${className}`}>
        <IslandLineArt className="h-[70%] w-[70%] text-line" strokeWidth={3} />
      </div>
    );
  }

  const representative = isImageRepresentative(verificationStatus);

  return (
    <div className={`relative overflow-hidden bg-surface-muted ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {representative && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-medium text-ink-soft shadow-[var(--shadow-card)] backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
          Temsili görsel
        </span>
      )}
    </div>
  );
}
