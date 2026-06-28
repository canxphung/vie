/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Language } from '@/types';
import { dictionaries, type Dictionary } from '@/locales';

export interface I18nValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Dictionary;
  isVi: boolean;
}

export const I18nContext = React.createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children?: any }) {
  const [language, setLanguage] = React.useState<Language>('vi');

  const value = React.useMemo<I18nValue>(
    () => ({ language, setLanguage, t: dictionaries[language], isVi: language === 'vi' }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
