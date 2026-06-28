/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'gold' | 'goldDeep' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: any;
  [key: string]: any;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-natural-accent hover:bg-natural-olive text-white',
  secondary: 'bg-natural-bg hover:bg-natural-beige text-natural-accent border border-natural-border',
  gold: 'bg-natural-gold hover:bg-natural-gold-dark text-natural-text',
  goldDeep: 'bg-natural-gold-deep hover:bg-natural-gold-dark text-stone-950',
  ghost: 'bg-transparent hover:bg-natural-beige text-natural-text',
  danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

/** Themed button. Replaces the dozens of repeated `bg-[#8C7A5B] ...` class strings. */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
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
