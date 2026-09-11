// components/ui/Button.tsx
// Canonical action primitive. Renders as <Link> when `href` is given,
// otherwise a native <button>, so nav CTAs and form actions share one
// visual system instead of two hand-rolled class strings.

import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ink' | 'white' | 'outline-on-ink' | 'ghost-on-ink' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  // Clay/terracotta — the one brand action color, so every primary
  // action site-wide reads as the same brand, not a rotating palette.
  // Stamped-offset shadow that snaps flush on press, like a physical
  // button, not a soft SaaS lift.
  // brand-fill/danger-fill (not brand/danger) — those two stay
  // constant across themes, since they're paired with fixed white
  // text; --color-brand and --color-danger themselves brighten in
  // dark mode for text/border contrast and would break that pairing.
  primary:
    'border border-brand-fill bg-brand-fill text-white shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-brand-hover active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  secondary:
    'border border-ink bg-surface text-strong shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-surface-muted active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  ghost:
    'text-muted hover:text-strong hover:bg-surface-muted',
  // Flat inverted step between the shadowed primary and plain ghost —
  // solid ink, no offset shadow of its own. text-paper (not text-white)
  // because --color-ink and --color-paper are exact opposites in both
  // themes (ink flips near-black→near-white, paper flips the other
  // way), so this pairing stays high-contrast whichever theme is active.
  ink:
    'border border-ink bg-ink text-paper hover:bg-ink-soft',
  // Solid white on a photograph (hero, cards over imagery) — always a
  // photo overlay, never page chrome, so this stays fixed white/dark
  // regardless of site theme; text-neutral-900 (not text-ink) on
  // purpose, since --color-ink flips to near-white in dark mode and
  // would vanish against this always-white pill.
  white:
    'border border-white bg-white text-neutral-900 shadow-[3px_3px_0_0_rgb(255_255_255_/_0.35)] hover:bg-white/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  'outline-on-ink':
    'border border-white/40 text-white/90 hover:border-white hover:text-white',
  'ghost-on-ink':
    'text-white/70 hover:text-white hover:bg-white/10',
  // Destructive confirmation only (route/rating deletion) — never a
  // general-purpose "error" button.
  danger:
    'border border-danger-fill bg-danger-fill text-white hover:bg-danger-fill/90',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3.5 text-xs',
  md: 'h-11 gap-2 px-5 text-[13px]',
  lg: 'h-[3.25rem] gap-2 px-7 text-sm',
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

// Sharp corners, uppercase mono-tracked label — an instrument switch,
// not a rounded marketing pill.
const base =
  'inline-flex shrink-0 items-center justify-center font-mono font-semibold uppercase tracking-[0.06em] transition-[color,background-color,transform,box-shadow] duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-40';

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
