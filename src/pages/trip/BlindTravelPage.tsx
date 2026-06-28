/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import BlindTravel from '@/components/BlindTravel';
import { useI18n, useCart, useUI } from '@/hooks';

export default function BlindTravelPage() {
  const { language } = useI18n();
  const { addCombo: handleAddAIComboToCart } = useCart();
  const { setView } = useUI();
  return (
          <motion.div
            key="blind-travel-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <BlindTravel 
              language={language}
              onAddComboToCart={handleAddAIComboToCart}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
  );
}
