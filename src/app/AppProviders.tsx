/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CatalogProvider } from '@/contexts/CatalogContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UIProvider } from '@/contexts/UIContext';

/**
 * Composes the global providers. Inner providers may read outer hooks
 * (Cart uses toast/i18n; UI uses auth/toast/cart).
 */
export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CatalogProvider>
          <ToastProvider>
            <CartProvider>
              <UIProvider>{children}</UIProvider>
            </CartProvider>
          </ToastProvider>
        </CatalogProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
