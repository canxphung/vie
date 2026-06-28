/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TourCombos } from '@/components/VietCharmExtraFeatures';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ToursPage() {
  const { language } = useI18n();
  const { addItem: handleAddToCart, openPayment, closePayment } = useCart();
  const { setView, viewItem: handleViewItem, favorites, toggleFavorite: handleToggleFavorite } = useUI();
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
  return (
          <motion.div
            key="tours-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <TourCombos 
              language={language}
              onAddToCart={(item) => {
                handleAddToCart(item);
                setShowPaymentModal(true);
              }}
              onNavigateHome={() => setView('regions')}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
  );
}
