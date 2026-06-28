/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Options {
  /** When true, a falsy value removes the key instead of storing it (used for currentUser). */
  removeOnFalsy?: boolean;
}

/**
 * State persisted to localStorage. Replicates the existing App.tsx pattern exactly:
 * lazy JSON init falling back to `seed` on any error, and an effect that writes on change.
 */
export function useLocalStorage<T>(key: string, seed: T, options: Options = {}) {
  const [value, setValue] = React.useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : seed;
    } catch {
      return seed;
    }
  });

  React.useEffect(() => {
    try {
      if (options.removeOnFalsy && !value) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
