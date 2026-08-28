// components/ui/Badge.tsx
// Small pill for status/category labels. Color communicates *state*
// (free entry, open now, verification) — category identity does not
// get its own arbitrary hue; every category badge shares one neutral
// treatment so the taxonomy reads as structure, not decoration.

import { Category } from '@/types/place';
import { tr } from '@/lib/i18n/tr';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'overlay';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-muted text-muted',
  brand: 'bg-brand/10 text-brand-strong',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  // Rendered on top of a photograph — needs its own contrast strategy.
  overlay: 'bg-white/90 text-strong backdrop-blur-sm shadow-[var(--shadow-card)]',
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-meta font-medium ${variantClass[variant]}`}
    >
      {label}
    </span>
  );
}

/** Every category renders identically — the label carries the meaning, not a color code. */
export function CategoryBadge({
  category,
  overlay = false,
}: {
  category: Category;
  overlay?: boolean;
}) {
  return <Badge label={tr.categories[category]} variant={overlay ? 'overlay' : 'neutral'} />;
}
