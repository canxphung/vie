/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '@/lib/cn';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: any;
  [key: string]: any;
}

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-natural-accent hover:bg-natural-olive text-white',
  outline: 'border border-natural-border bg-white hover:bg-natural-beige text-natural-text',
  ghost: 'hover:bg-natural-beige text-natural-text',
};

const SIZES: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

/** Round icon button — the quantity +/- and favorite-heart pattern. */
export function IconButton({ variant = 'outline', size = 'md', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
