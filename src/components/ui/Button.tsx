// components/ui/Button.tsx
// Canonical action primitive. Renders as <Link> when `href` is given,
// otherwise a native <button>, so nav CTAs and form actions share one
// visual system instead of two hand-rolled class strings.

import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ink' | 'outline-on-ink' | 'ghost-on-ink';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-hover shadow-[0_1px_0_rgb(255_255_255_/_0.08)_inset]',
  secondary:
    'border border-line bg-surface text-strong hover:border-ink',
  ghost:
    'text-muted hover:text-strong hover:bg-surface-muted',
  // Solid dark action on a light surface (e.g. "Get directions") — its own
  // step between the brand-orange primary and the outlined secondary.
  ink:
    'bg-ink text-white hover:bg-brand',
  'outline-on-ink':
    'border border-white/20 text-white/80 hover:border-white/40 hover:text-white',
  'ghost-on-ink':
    'text-white/70 hover:text-white hover:bg-white/5',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3.5 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-[3.25rem] gap-2 px-6 text-[0.9375rem]',
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

const base =
  'inline-flex shrink-0 items-center justify-center rounded-sm font-semibold tracking-[-0.01em] transition-colors duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-40';

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
