/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import RegionSelector from '@/components/RegionSelector';
import { useI18n, useUI } from '@/hooks';

export default function RegionsPage() {
  const { language } = useI18n();
  const { setView } = useUI();
  return (
          <motion.div
            key="regions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RegionSelector 
              language={language}
              onSelectCentral={() => setView('provinces')}
              onSelectTripRoom={() => setView('trip-room')}
              onSelectBlindTravel={() => setView('blind-travel')}
            />
          </motion.div>
  );
}
