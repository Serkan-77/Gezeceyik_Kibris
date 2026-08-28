// components/ui/EmptyState.tsx
// Shared empty-state composition (icon + message + optional action).
// Used by favorites, filtered results, and the trip planner.

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-faint">
          {icon}
        </div>
      )}
      <h2 className="font-display text-block-title font-semibold text-strong">{title}</h2>
      {description && (
        <p className="mt-2 max-w-sm text-body-sm leading-relaxed text-subtle">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
