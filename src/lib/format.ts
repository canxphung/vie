/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Format a number with Vietnamese thousands separators (no currency suffix). */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/** Format a number as Vietnamese currency, e.g. 1500000 -> "1.500.000đ". */
export function formatVND(amount: number): string {
  return `${formatNumber(amount)}đ`;
}
