/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Size = 'narrow' | 'default' | 'wide';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  className?: string;
  children?: ReactNode;
}

const SIZES: Record<Size, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
};

/** Centered, horizontally-padded page container. Replaces `max-w-7xl mx-auto px-4`. */
export function Container({ size = 'default', className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn(SIZES[size], 'mx-auto px-4', className)} {...rest}>
      {children}
    </div>
  );
}
