// components/ui/Badge.tsx
// Small pill badge for category, region, or status labels.

import { Category } from '@/types/place';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'orange' | 'green' | 'muted' | 'overlay';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-[#f5f2ee] text-[#4b5563]',
    orange:  'bg-[#e8651a]/10 text-[#c9540e]',
    green:   'bg-emerald-50 text-emerald-700',
    muted:   'bg-[#f5f2ee] text-[#9ca3af]',
    // Used when rendered on top of an image
    overlay: 'bg-white/90 text-[#1a1a1a] backdrop-blur-sm shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}

/** Maps a Category to a display-friendly label and badge variant. */
export function CategoryBadge({
  category,
  overlay = false,
}: {
  category: Category;
  overlay?: boolean;
}) {
  if (overlay) {
    return <Badge label={category} variant="overlay" />;
  }

  const variantMap: Record<Category, BadgeProps['variant']> = {
    Museum:               'orange',
    'Historical Place':   'default',
    Castle:               'default',
    'Archaeological Site':'default',
    Monastery:            'muted',
    Church:               'muted',
    'Natural Attraction': 'green',
    Beach:                'green',
    Viewpoint:            'green',
    'Cultural Site':      'default',
    'Family Activity':    'default',
  };

  return <Badge label={category} variant={variantMap[category] ?? 'default'} />;
}
