/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Spacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type Tone = 'default' | 'beige' | 'cream' | 'accent' | 'ink';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: Spacing;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
  children?: ReactNode;
}

const SPACING: Record<Spacing, string> = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-14',
  xl: 'py-16',
};

const TONE: Record<Tone, string> = {
  default: '',
  beige: 'bg-natural-beige',
  cream: 'bg-natural-cream',
  accent: 'bg-natural-accent text-white',
  ink: 'bg-natural-ink text-natural-beige',
};

/** A page section with a normalized vertical-spacing scale and optional background tone. */
export function Section({
  spacing = 'md',
  tone = 'default',
  bordered = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(SPACING[spacing], TONE[tone], bordered && 'border-y border-natural-border', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
