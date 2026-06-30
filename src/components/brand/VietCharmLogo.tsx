/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import logoSrc from '../../../logo/logo.png';
import { cn } from '@/lib/cn';

interface VietCharmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-11 w-40',
  md: 'h-14 w-52',
  lg: 'h-16 w-60',
} as const;

export function VietCharmLogo({ className, size = 'md' }: VietCharmLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 overflow-hidden',
        SIZE_CLASSES[size],
        className,
      )}
    >
      <img
        src={logoSrc}
        alt="Viet Charm Heritage & Travel"
        className="h-full w-full object-cover mix-blend-screen"
        draggable={false}
      />
    </span>
  );
}
