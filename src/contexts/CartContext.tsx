/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/contexts/ToastContext';
import type { BookingCartItem } from '@/types';

export type PaymentInitialStep = 'cart' | 'checkout';

function getCartKey(item: BookingCartItem): string {
  return item.cartKey || item.id;
}

export interface CartValue {
  items: BookingCartItem[];
  cartCount: number;
  isPaymentOpen: boolean;
  paymentInitialStep: PaymentInitialStep;
  /** Items the user has ticked for checkout (defaults to every item). */
  selectedItems: BookingCartItem[];
  /** Total quantity across selected items. */
  selectedCount: number;
  /** True when every cart item is selected. */
  allSelected: boolean;
  isItemSelected: (key: string) => boolean;
  toggleItemSelected: (key: string) => void;
  setAllItemsSelected: (selected: boolean) => void;
  /** Remove the currently selected items (used after paying for a partial selection). */
  clearSelectedItems: () => void;
  openPayment: (step?: PaymentInitialStep) => void;
  closePayment: () => void;
  addItem: (item: BookingCartItem) => void;
  /** Add an AI/combo bundle. If the bundle contains any `ai-` item the cart is replaced. */
  addCombo: (items: BookingCartItem[]) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

export const CartContext = React.createContext<CartValue | null>(null);

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const { isVi } = useI18n();
  const { showToast } = useToast();
  const [items, setItems] = React.useState<BookingCartItem[]>([]);
  const [isPaymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentInitialStep, setPaymentInitialStep] = React.useState<PaymentInitialStep>('checkout');
  // Keys the user has un-ticked. Everything not listed here counts as selected,
  // so newly added items default to selected without extra bookkeeping.
  const [deselectedKeys, setDeselectedKeys] = React.useState<string[]>([]);

  const value = React.useMemo<CartValue>(() => {
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const isDeselected = (key: string) => deselectedKeys.includes(key);
    const selectedItems = items.filter((item) => !isDeselected(getCartKey(item)));
    const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items,
      cartCount,
      isPaymentOpen,
      paymentInitialStep,
      selectedItems,
      selectedCount,
      allSelected: items.length > 0 && selectedItems.length === items.length,
      isItemSelected: (key) => !isDeselected(key),
      toggleItemSelected: (key) =>
        setDeselectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])),
      setAllItemsSelected: (selected) =>
        setDeselectedKeys(selected ? [] : items.map((item) => getCartKey(item))),
      clearSelectedItems: () => {
        setItems((prev) => prev.filter((x) => deselectedKeys.includes(getCartKey(x))));
        setDeselectedKeys([]);
      },
      openPayment: (step = 'checkout') => {
        setPaymentInitialStep(step);
        setPaymentOpen(true);
      },
      closePayment: () => setPaymentOpen(false),
      addItem: (item) =>
        setItems((prev) => {
          const nextKey = getCartKey(item);
          const exists = prev.find((x) => getCartKey(x) === nextKey);
          if (exists) {
            return prev.map((x) => (getCartKey(x) === nextKey ? { ...x, quantity: x.quantity + 1 } : x));
          }
          return [...prev, item];
        }),
      addCombo: (newItems) =>
        setItems((prev) => {
          const filtered = prev.filter((x) => !newItems.some((aiItem) => aiItem.id.startsWith('ai-')));
          return [...filtered, ...newItems];
        }),
      removeItem: (id) => {
        const removed = items
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => getCartKey(item) === id || item.id === id);

        if (removed.length === 0) return;

        const removedKeys = new Set(removed.map(({ item }) => getCartKey(item)));
        const deselectedSnapshot = deselectedKeys;

        setItems((prev) => prev.filter((x) => getCartKey(x) !== id && x.id !== id));
        setDeselectedKeys((prev) => prev.filter((k) => !removedKeys.has(k) && k !== id));
        showToast({
          type: 'info',
          title: isVi ? 'Đã xóa khỏi giỏ hàng' : 'Removed from cart',
          message: removed[0]?.item.name,
          durationMs: 7000,
          action: {
            label: isVi ? 'Hoàn tác' : 'Undo',
            onClick: () => {
              setItems((prev) => {
                const next = [...prev];
                removed
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .forEach(({ item, index }) => {
                    if (next.some((existing) => getCartKey(existing) === getCartKey(item))) return;
                    next.splice(Math.min(index, next.length), 0, item);
                  });
                return next;
              });
              setDeselectedKeys((prev) => {
                const restored = deselectedSnapshot.filter((key) => removedKeys.has(key));
                return [...prev.filter((key) => !removedKeys.has(key)), ...restored];
              });
            },
          },
        });
      },
      clearCart: () => {
        if (items.length === 0) return;
        const itemsSnapshot = items;
        const deselectedSnapshot = deselectedKeys;

        setItems([]);
        setDeselectedKeys([]);
        showToast({
          type: 'info',
          title: isVi ? 'Đã xóa giỏ hàng' : 'Cart cleared',
          message: isVi ? 'Các dịch vụ đã chọn vừa được gỡ khỏi giỏ.' : 'Your selected services were removed.',
          durationMs: 8000,
          action: {
            label: isVi ? 'Hoàn tác' : 'Undo',
            onClick: () => {
              setItems((prev) => {
                const restored = [...itemsSnapshot];
                prev.forEach((item) => {
                  if (!restored.some((x) => getCartKey(x) === getCartKey(item))) {
                    restored.push(item);
                  }
                });
                return restored;
              });
              setDeselectedKeys(deselectedSnapshot);
            },
          },
        });
      },
      isInCart: (id) => items.some((x) => getCartKey(x) === id || x.id === id),
    };
  }, [items, isPaymentOpen, paymentInitialStep, deselectedKeys, showToast, isVi]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
