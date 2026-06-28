/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TaxiBooking } from '@/features/transport/TaxiBooking';
import { Container } from '@/components/ui';
import { useI18n, useCart, useUI } from '@/hooks';

export default function TaxiPage() {
  const { language } = useI18n();
  const { addItem: handleAddToCart, openPayment, closePayment } = useCart();
  const { setView } = useUI();
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
  return (
          <motion.div
            key="taxi-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-8"
          >
            <Container>
              <TaxiBooking
                language={language}
                onAddToCart={(item) => {
                  handleAddToCart(item);
                  setShowPaymentModal(true);
                }}
                onNavigateHome={() => setView('regions')}
              />
            </Container>
          </motion.div>
  );
}
