// components/ui/Select.tsx
// Native <select> with consistent chrome and a matching chevron
// (native arrows render inconsistently across browsers/OSes).

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDownIcon } from './icons';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...rest }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`h-11 w-full appearance-none rounded-sm border border-line bg-surface pl-3.5 pr-9 text-sm text-strong transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      </div>
    );
  }
);
