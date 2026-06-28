/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import AllServicesView from '@/components/AllServicesView';
import { useI18n, useCart, useUI } from '@/hooks';

export default function AllServicesPage() {
  const { language } = useI18n();
  const { items: cartItems, addItem: handleAddToCart, removeItem: handleRemoveFromCart } = useCart();
  const { allServicesTab, setView, viewItem: handleViewItem, favorites, toggleFavorite: handleToggleFavorite } = useUI();
  return (
          <motion.div
            key="all-services-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AllServicesView 
              language={language}
              initialTab={allServicesTab}
              onBack={() => {
                if (allServicesTab === 'attractions') {
                  setView('regions');
                } else {
                  setView('province');
                }
              }}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              cartItems={cartItems}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
  );
}
