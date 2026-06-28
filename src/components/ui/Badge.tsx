/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '@/lib/cn';

type Tone = 'gold' | 'accent' | 'neutral' | 'success';

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children?: any;
  [key: string]: any;
}

const TONES: Record<Tone, string> = {
  gold: 'bg-natural-gold text-white',
  accent: 'bg-natural-accent text-white',
  neutral: 'bg-natural-beige text-natural-text',
  success: 'bg-emerald-100 text-emerald-700',
};

/** Small pill label. */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide', TONES[tone], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
