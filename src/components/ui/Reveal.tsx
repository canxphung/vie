/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  /** Stagger helper: delay (seconds) before this element animates in. */
  delay?: number;
  /** Travel distance (px) the element slides up from. */
  y?: number;
  className?: string;
}

/**
 * Scroll-triggered entrance. Fades + slides the content up the first time it
 * scrolls into view, then leaves it untouched. Respects reduced-motion via the
 * shared transition feel used across the app.
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
