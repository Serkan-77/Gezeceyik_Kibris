// components/ui/Container.tsx
// Canonical page-width wrapper. Three sizes cover every layout in the product:
// default (standard page width), narrow (reading/wizard columns), full (edge-to-edge, e.g. map).

import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type ContainerSize = 'default' | 'narrow' | 'full';

const sizeClass: Record<ContainerSize, string> = {
  default: 'max-w-7xl',
  narrow: 'max-w-3xl',
  full: 'max-w-none',
};

interface ContainerOwnProps {
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

type ContainerProps<T extends ElementType> = ContainerOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps | 'as'>;

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'default',
  className = '',
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = as ?? 'div';
  return (
    <Tag
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
