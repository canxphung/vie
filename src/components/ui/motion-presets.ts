/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shared Motion presets. Spread onto a `motion.*` element, e.g.
 *   <motion.div {...fadeInUp} key="x" />
 */

export const defaultTransition = { duration: 0.3 } as const;

/** Fade + slide up — the app's standard view/section entrance. */
export const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: defaultTransition,
} as const;

/** Simple opacity fade. */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;
