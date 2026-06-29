/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TourCombos } from '@/features/tours/TourCombos';
import { Container } from '@/components/ui';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ToursPage() {
  const { language } = useI18n();
  const isVi = language === 'vi';
  const { addItem: handleAddToCart, openPayment, closePayment } = useCart();
  const { setView, requireAuth, viewItem: handleViewItem, favorites, toggleFavorite: handleToggleFavorite } = useUI();
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
  return (
          <motion.div
            key="tours-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-8"
          >
            <Container>
              <TourCombos
                language={language}
                onAddToCart={(item) =>
                  requireAuth(() => {
                    handleAddToCart(item);
                    setShowPaymentModal(true);
                  }, isVi ? 'Đăng nhập để đặt combo và thanh toán.' : 'Sign in to book the combo and pay.')
                }
                onNavigateHome={() => setView('regions')}
                onViewItem={handleViewItem}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </Container>
          </motion.div>
  );
}
