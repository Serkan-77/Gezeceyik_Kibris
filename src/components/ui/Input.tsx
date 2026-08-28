// components/ui/Input.tsx
// Consistent text input, with an optional leading icon slot (used by search fields).

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, className = '', ...rest },
  ref
) {
  if (!icon) {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-sm border border-line bg-surface px-3.5 text-sm text-strong transition-colors placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
        {...rest}
      />
    );
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-subtle" aria-hidden="true">
        {icon}
      </span>
      <input
        ref={ref}
        className={`h-11 w-full rounded-sm border border-line bg-surface pl-10 pr-3.5 text-sm text-strong transition-colors placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
        {...rest}
      />
    </div>
  );
});
