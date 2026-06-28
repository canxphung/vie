/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import ProvinceDashboard from '@/components/ProvinceDashboard';
import { useI18n, useUI } from '@/hooks';

export default function ProvincesPage() {
  const { language } = useI18n();
  const { setView, selectProvince } = useUI();
  return (
          <motion.div
            key="provinces"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ProvinceDashboard 
              language={language}
              onSelectProvince={(provId) => selectProvince(provId)}
              onBackToHome={() => setView('regions')}
            />
          </motion.div>
  );
}
