/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Radius = 'lg' | 'xl' | '2xl' | '3xl';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  radius?: Radius;
  hover?: boolean;
  padded?: boolean;
  className?: string;
  children?: ReactNode;
}

const RADIUS: Record<Radius, string> = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

/** White surface with the standard natural border. Replaces the repeated card wrapper pattern. */
export function Card({ radius = '3xl', hover = false, padded = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-natural-border overflow-hidden',
        RADIUS[radius],
        padded && 'p-6',
        hover && 'transition hover:shadow-xl hover:-translate-y-1',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
