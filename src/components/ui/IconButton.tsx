// components/ui/IconButton.tsx
// Toggle variant (favorite, add-to-trip, wizard stepper) that owns its own
// active/inactive visual states so consuming components don't each
// re-implement the same class map.

import { ReactNode } from 'react';

type IconToggleTone = 'brand' | 'rose';

interface IconToggleButtonProps {
  icon: ReactNode;
  active: boolean;
  onToggle: () => void;
  'aria-label': string;
  large?: boolean;
  label?: { active: string; inactive: string };
  tone?: IconToggleTone;
  className?: string;
}

const toggleTone: Record<IconToggleTone, { activeSmall: string; activeLarge: string; inactiveLarge: string }> = {
  brand: {
    activeSmall: 'bg-white/95 text-brand hover:bg-white',
    activeLarge: 'border-brand/30 bg-brand/10 text-brand hover:bg-brand/20',
    inactiveLarge: 'border-line bg-surface text-muted hover:border-brand/30 hover:text-brand',
  },
  rose: {
    activeSmall: 'bg-white/95 text-rose-500 hover:bg-white',
    activeLarge: 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100',
    inactiveLarge: 'border-line bg-surface text-muted hover:border-rose-200 hover:text-rose-500',
  },
};

export function IconToggleButton({
  icon,
  active,
  onToggle,
  large,
  label,
  tone = 'brand',
  className = '',
  ...rest
}: IconToggleButtonProps) {
  const t = toggleTone[tone];

  const smallClass = active
    ? t.activeSmall
    : 'bg-white/75 text-subtle hover:bg-white hover:text-strong';

  const largeClass = active ? t.activeLarge : t.inactiveLarge;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      className={
        large
          ? `flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${largeClass} ${className}`
          : `flex h-8 w-8 items-center justify-center rounded-sm backdrop-blur-sm transition-colors duration-[var(--duration-fast)] ${smallClass} ${className}`
      }
      {...rest}
    >
      {icon}
      {large && label && <span>{active ? label.active : label.inactive}</span>}
    </button>
  );
}
