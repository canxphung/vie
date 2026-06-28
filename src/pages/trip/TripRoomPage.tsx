/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import TripRoom from '@/components/TripRoom';
import { useI18n, useCart, useUI } from '@/hooks';

export default function TripRoomPage() {
  const { language } = useI18n();
  const { addCombo: handleAddAIComboToCart } = useCart();
  const { setView } = useUI();
  return (
          <motion.div
            key="trip-room-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <TripRoom 
              language={language}
              onAddComboToCart={handleAddAIComboToCart}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
  );
}
