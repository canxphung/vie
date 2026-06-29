/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import ServiceDetails from '@/components/ServiceDetails';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ServiceDetailsPage() {
  const { language } = useI18n();
  const { items: cartItems, addItem: handleAddToCart, removeItem: handleRemoveFromCart, openPayment, closePayment } = useCart();
  const { selectedItem, clearSelectedItem, bookingSearch, toggleFavorite, isFavorite } = useUI();
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
  const lastSelectedItemRef = React.useRef(selectedItem);

  if (selectedItem) {
    lastSelectedItemRef.current = selectedItem;
  }

  const detailItem = selectedItem || lastSelectedItemRef.current;

  if (!detailItem) return null;

  return (
          <motion.div
            key="service-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceDetails 
              language={language}
              item={detailItem}
              onBack={() => clearSelectedItem()}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={() => {
                setShowPaymentModal(true);
              }}
              isItemInCart={(key) => cartItems.some((x) => (x.cartKey || x.id) === key)}
              bookingSearch={bookingSearch}
              isFavorite={isFavorite(detailItem.id)}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
  );
}
