/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { KeyboardEvent } from 'react';

/**
 * Props that turn a non-button element (e.g. a clickable card `<div>`) into a
 * keyboard-operable control: focusable, exposed as a button to assistive tech,
 * and activated by Enter/Space — matching native button behaviour.
 *
 * Nested interactive elements (favourite/CTA buttons) should still call
 * `stopPropagation()` so they don't also trigger the card.
 */
export function clickableCardProps(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
  };
}
