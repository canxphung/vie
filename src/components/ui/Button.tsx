/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'gold' | 'goldDeep' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'btn-sheen bg-gradient-to-br from-natural-accent to-natural-olive text-white shadow-luxe hover:shadow-luxe-lg',
  secondary: 'bg-natural-bg hover:bg-natural-beige text-natural-accent border border-natural-border',
  gold: 'btn-sheen bg-gradient-to-br from-natural-gold via-amber-300 to-natural-gold-deep text-natural-text shadow-luxe hover:shadow-luxe-lg',
  goldDeep:
    'btn-sheen bg-gradient-to-br from-natural-gold-deep via-natural-gold to-natural-gold-dark text-stone-950 shadow-luxe hover:shadow-luxe-lg',
  ghost: 'bg-transparent hover:bg-natural-beige text-natural-text',
  danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

/** Themed button. Replaces the dozens of repeated `bg-natural-accent ...` class strings. */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 cursor-pointer',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none',
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
