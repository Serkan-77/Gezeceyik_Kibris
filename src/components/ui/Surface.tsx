// components/ui/Surface.tsx
// The one "boxed content" primitive. Used deliberately, not by default —
// most information should live in typographic rhythm and spacing, not a
// bordered rectangle. Reach for Surface when a block needs real visual
// containment (cards, panels, the wizard shell), not for every list row.

import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type SurfaceTone = 'surface' | 'muted' | 'ink';
type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

const toneClass: Record<SurfaceTone, string> = {
  surface: 'bg-surface border border-line',
  muted: 'bg-surface-muted',
  ink: 'bg-ink text-white',
};

const paddingClass: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

interface SurfaceOwnProps {
  tone?: SurfaceTone;
  padding?: SurfacePadding;
  radius?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

type SurfaceProps<T extends ElementType> = SurfaceOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof SurfaceOwnProps | 'as'>;

export function Surface<T extends ElementType = 'div'>({
  as,
  tone = 'surface',
  padding = 'none',
  radius = 'md',
  interactive = false,
  className = '',
  children,
  ...rest
}: SurfaceProps<T>) {
  const Tag = as ?? 'div';
  const radiusClass = radius === 'sm' ? 'rounded-sm' : radius === 'lg' ? 'rounded-lg' : 'rounded-md';
  const interactiveClass = interactive
    ? 'shadow-[var(--shadow-card)] transition-shadow duration-[var(--duration-base)] hover:shadow-[var(--shadow-lift)]'
    : '';

  return (
    <Tag
      className={`${toneClass[tone]} ${paddingClass[padding]} ${radiusClass} ${interactiveClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
