'use client';
// components/ui/Reveal.tsx
// Thin scroll-reveal wrapper: fades/lifts content in once as it enters
// the viewport. transform + opacity only; no-ops under
// prefers-reduced-motion (see globals.css). Keep usage sparing — this
// communicates arrival for a section's first appearance, not a
// decoration to apply everywhere.

import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface RevealOwnProps {
  variant?: 'fade-up' | 'fade';
  delayMs?: number;
  className?: string;
  children: ReactNode;
}

type RevealProps = RevealOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof RevealOwnProps>;

export function Reveal({ variant = 'fade-up', delayMs = 0, className = '', children, ...rest }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-motion={variant}
      data-enter={inView}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}
