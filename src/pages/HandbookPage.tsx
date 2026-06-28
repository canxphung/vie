/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TravelHandbook } from '@/components/VietCharmExtraFeatures';
import { useI18n } from '@/hooks';

export default function HandbookPage() {
  const { language } = useI18n();
  return (
          <motion.div
            key="handbook-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <TravelHandbook language={language} />
          </motion.div>
  );
}
