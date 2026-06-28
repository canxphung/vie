/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  const [items, setItems] = React.useState<BookingCartItem[]>([]);
  const [isPaymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentInitialStep, setPaymentInitialStep] = React.useState<PaymentInitialStep>('checkout');

  const value = React.useMemo<CartValue>(() => {
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    return {
      items,
      cartCount,
      isPaymentOpen,
      paymentInitialStep,
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
      removeItem: (id) => setItems((prev) => prev.filter((x) => getCartKey(x) !== id && x.id !== id)),
      clearCart: () => setItems([]),
      isInCart: (id) => items.some((x) => getCartKey(x) === id || x.id === id),
    };
  }, [items, isPaymentOpen, paymentInitialStep]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
