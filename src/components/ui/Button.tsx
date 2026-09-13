// components/ui/Button.tsx
// Canonical action primitive. Renders as <Link> when `href` is given,
// otherwise a native <button>, so nav CTAs and form actions share one
// visual system instead of two hand-rolled class strings.

import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ink' | 'white' | 'outline-on-ink' | 'ghost-on-ink' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  // Coastal-blue fill — the one brand action color, so every primary
  // action site-wide reads as the same brand. Soft floating elevation
  // that blooms into a gentle aqua glow on hover/focus and eases down
  // on press, like a physical surface lifting toward you — not a
  // stamped offset that snaps flush.
  // brand-fill/danger-fill (not brand/danger) — those two stay
  // constant across themes, since they're paired with fixed white
  // text; --color-brand and --color-danger themselves brighten in
  // dark mode for text/border contrast and would break that pairing.
  primary:
    'bg-brand-fill text-white shadow-[var(--shadow-lift)] hover:bg-brand-hover hover:shadow-[var(--shadow-glow)] active:scale-[0.97]',
  secondary:
    'border border-line bg-surface text-strong shadow-[var(--shadow-card)] hover:border-brand/40 hover:bg-white active:scale-[0.97]',
  ghost:
    'text-muted hover:text-strong hover:bg-surface-muted active:scale-[0.97]',
  // Flat inverted step between the shadowed primary and plain ghost —
  // solid ink, no glow of its own. text-paper (not text-white) because
  // --color-ink and --color-paper are exact opposites in both themes
  // (ink flips near-black→near-white, paper flips the other way), so
  // this pairing stays high-contrast whichever theme is active.
  ink:
    'bg-ink text-paper shadow-[var(--shadow-card)] hover:bg-ink-soft active:scale-[0.97]',
  // Solid white on a photograph (hero, cards over imagery) — always a
  // photo overlay, never page chrome, so this stays fixed white/dark
  // regardless of site theme; text-neutral-900 (not text-ink) on
  // purpose, since --color-ink flips to near-white in dark mode and
  // would vanish against this always-white pill.
  white:
    'bg-white text-neutral-900 shadow-[var(--shadow-lift)] hover:bg-white/95 active:scale-[0.97]',
  'outline-on-ink':
    'border border-white/35 text-white/90 backdrop-blur-sm hover:border-white/70 hover:bg-white/10 hover:text-white active:scale-[0.97]',
  'ghost-on-ink':
    'text-white/70 hover:text-white hover:bg-white/10 active:scale-[0.97]',
  // Destructive confirmation only (route/rating deletion) — never a
  // general-purpose "error" button.
  danger:
    'bg-danger-fill text-white shadow-[var(--shadow-card)] hover:bg-danger-fill/90 active:scale-[0.97]',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-4 text-[13px] rounded-full',
  md: 'h-11 gap-2 px-6 text-sm rounded-full',
  lg: 'h-[3.25rem] gap-2 px-8 text-[15px] rounded-full',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

// Soft full-round pill, clean sans label — a smooth, premium touch
// target, not an instrument switch.
const base =
  'inline-flex shrink-0 items-center justify-center font-sans font-semibold tracking-[-0.005em] transition-[color,background-color,transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40';

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'trailing',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`;
  const content = (
    <>
      {icon && iconPosition === 'leading' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'trailing' && icon}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
