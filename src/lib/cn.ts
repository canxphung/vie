/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ClassValue = string | number | false | null | undefined;

/** Join truthy class names into a single className string. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
