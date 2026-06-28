/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CatalogProvider } from '@/contexts/CatalogContext';
import { CartProvider } from '@/contexts/CartContext';
import { UIProvider } from '@/contexts/UIContext';

/**
 * Composes the global providers. Order: I18n → Auth → Catalog → Cart → UI
 * (inner providers may read outer hooks; e.g. Admin actions read useAuth()).
 */
export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <UIProvider>{children}</UIProvider>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
