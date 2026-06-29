/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '@/lib/cn';

/**
 * Ornamental heritage separator — two gold hairlines flanking a diamond motif.
 * Use under section titles or to break up content blocks.
 */
export function MotifDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-natural-gold/70 sm:w-20" />
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute inset-0 rotate-45 rounded-[2px] border border-natural-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-natural-gold" />
      </span>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-natural-gold/70 sm:w-20" />
    </div>
  );
}

interface WaveDividerProps {
  /** Tailwind text-color class that paints the wave (set to the NEXT section's bg). */
  fill?: string;
  /** Flip vertically so the crest points the other way. */
  flip?: boolean;
  className?: string;
}

/**
 * Soft wave edge to transition between two stacked sections. Set `fill` to the
 * colour of the section that follows so the wave reads as that section bleeding up.
 */
export function WaveDivider({ fill = 'text-natural-bg', flip = false, className }: WaveDividerProps) {
  return (
    <div className={cn('pointer-events-none leading-[0]', flip && 'rotate-180', className)} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn('block h-8 w-full md:h-14', fill)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,36 C240,84 480,84 720,52 C960,20 1200,20 1440,52 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
