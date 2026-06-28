/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { PersonalProfile } from '@/features/profile/PersonalProfile';
import { Container } from '@/components/ui';
import { useI18n, useAuth, useCatalog, useUI } from '@/hooks';

export default function ProfilePage() {
  const { language } = useI18n();
  const { currentUser, updateProfile } = useAuth();
  const { bookings, vouchers, applications } = useCatalog();
  const { setView, favorites, recentlyViewed, toggleFavorite: handleToggleFavorite, viewItem: handleViewItem } = useUI();
  return (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-8"
          >
            <Container>
              <PersonalProfile
                language={language}
                user={currentUser}
                onUpdateProfile={(updated) => updateProfile(updated)}
                bookings={bookings.filter(b => b.userEmail === currentUser?.email)}
                vouchers={vouchers}
                onNavigateHome={() => setView('regions')}
                partnershipRequests={applications.filter(a => a.email === currentUser?.email)}
                favorites={favorites}
                recentlyViewed={recentlyViewed}
                onToggleFavorite={handleToggleFavorite}
                onViewItem={handleViewItem}
              />
            </Container>
          </motion.div>
  );
}
