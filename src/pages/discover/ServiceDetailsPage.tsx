/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import ServiceDetails from '@/components/ServiceDetails';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ServiceDetailsPage() {
  const { language } = useI18n();
  const { items: cartItems, addItem: handleAddToCart, removeItem: handleRemoveFromCart, openPayment, closePayment } = useCart();
  const { selectedItem, clearSelectedItem } = useUI();
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
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
              item={selectedItem}
              onBack={() => clearSelectedItem()}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={() => {
                setShowPaymentModal(true);
              }}
              isItemInCart={(id) => cartItems.some(x => x.id === id)}
            />
          </motion.div>
  );
}
