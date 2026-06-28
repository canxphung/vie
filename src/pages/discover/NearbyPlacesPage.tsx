/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import NearbyPlaces from '@/components/NearbyPlaces';
import { useI18n, useUI } from '@/hooks';

export default function NearbyPlacesPage() {
  const { language } = useI18n();
  const { setView, viewItem: handleViewItem, favorites, toggleFavorite: handleToggleFavorite } = useUI();
  return (
          <motion.div
            key="nearby-places-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <NearbyPlaces 
              language={language}
              onBackToHome={() => setView('regions')}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
  );
}
