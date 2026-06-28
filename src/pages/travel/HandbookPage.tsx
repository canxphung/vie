/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TravelHandbook } from '@/features/tours/TravelHandbook';
import { Container } from '@/components/ui';
import { useI18n } from '@/hooks';

export default function HandbookPage() {
  const { language } = useI18n();
  return (
          <motion.div
            key="handbook-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-8"
          >
            <Container>
              <TravelHandbook language={language} />
            </Container>
          </motion.div>
  );
}
