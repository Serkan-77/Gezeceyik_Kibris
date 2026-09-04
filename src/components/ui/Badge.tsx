// components/ui/Badge.tsx
// Small pill for status/category labels. Status badges (free entry, open
// now, verification) use the semantic state colors. Category badges are
// deliberately kept OUT of the blue system — blue means geographic/
// interactive on this site (Phase 8 §1), so a category's identity comes
// from its icon (CategoryIcon) plus its label, sharing one neutral ink
// pair, not a fixed hue.

import { Category } from '@/types/place';
import { tr } from '@/lib/i18n/tr';
import { CategoryIcon } from './CategoryIcon';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'overlay';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-muted text-muted',
  brand: 'bg-brand/10 text-brand-strong',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  // Rendered on top of a photograph — needs its own contrast strategy.
  overlay: 'bg-white/90 text-strong backdrop-blur-sm shadow-[var(--shadow-card)]',
};

export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-meta font-medium ${variantClass[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

/** One shared gray pair for every category (see globals.css) — kept as a
 * lookup (rather than inlined) so call sites that need alpha/JS math
 * (gradients, canvas, SVG) still have a single source to read from. */
const categoryHex: Record<Category, { fg: string; bg: string }> = {
  Museum: { fg: '#17191C', bg: '#ECE7DC' },
  Castle: { fg: '#17191C', bg: '#ECE7DC' },
  'Archaeological Site': { fg: '#17191C', bg: '#ECE7DC' },
  Monastery: { fg: '#17191C', bg: '#ECE7DC' },
  Beach: { fg: '#17191C', bg: '#ECE7DC' },
  'Natural Attraction': { fg: '#17191C', bg: '#ECE7DC' },
  'Historical Place': { fg: '#17191C', bg: '#ECE7DC' },
  Viewpoint: { fg: '#17191C', bg: '#ECE7DC' },
  'Cultural Site': { fg: '#17191C', bg: '#ECE7DC' },
  Church: { fg: '#17191C', bg: '#ECE7DC' },
  'Family Activity': { fg: '#17191C', bg: '#ECE7DC' },
};

const categoryColorVar: Record<Category, string> = {
  Museum: 'cat-museum',
  Castle: 'cat-castle',
  'Archaeological Site': 'cat-archaeological',
  Monastery: 'cat-monastery',
  Beach: 'cat-beach',
  'Natural Attraction': 'cat-nature',
  'Historical Place': 'cat-historical',
  Viewpoint: 'cat-viewpoint',
  'Cultural Site': 'cat-cultural',
  Church: 'cat-church',
  'Family Activity': 'cat-family',
};

/** CSS-variable version — preferred inside Tailwind/inline styles that don't
 * need alpha math, since it stays in sync with globals.css automatically. */
export function categoryColor(category: Category) {
  const token = categoryColorVar[category];
  return { fg: `var(--color-${token})`, bg: `var(--color-${token}-soft)` };
}

/** Raw hex version — use when you need to build an rgba()/hex+alpha string
 * (gradients, canvas, SVG) rather than just setting a CSS property. */
export function categoryColorHex(category: Category) {
  return categoryHex[category];
}

export function CategoryBadge({
  category,
  overlay = false,
}: {
  category: Category;
  overlay?: boolean;
}) {
  const { fg, bg } = categoryColor(category);
  if (overlay) {
    // On top of a photograph — solid white chip so it reads clearly
    // regardless of the image underneath.
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-meta font-medium text-strong shadow-[var(--shadow-card)] backdrop-blur-sm"
      >
        <CategoryIcon category={category} className="h-3 w-3 shrink-0" />
        {tr.categories[category]}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-meta font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      <CategoryIcon category={category} className="h-3 w-3 shrink-0" />
      {tr.categories[category]}
    </span>
  );
}
