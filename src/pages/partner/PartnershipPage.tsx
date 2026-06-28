/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { PartnershipForm } from '@/features/partnership/PartnershipForm';
import { Container } from '@/components/ui';
import { useI18n, useAuth, useCatalog } from '@/hooks';

export default function PartnershipPage() {
  const { language } = useI18n();
  const { currentUser } = useAuth();
  const { applications, addApplication } = useCatalog();
  return (
          <motion.div
            key="partnership-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-8"
          >
            <Container>
              <PartnershipForm
                language={language}
                onRegisterApplication={(app) => addApplication(app)}
                applications={applications.filter(a => a.email === currentUser?.email)}
              />
            </Container>
          </motion.div>
  );
}
