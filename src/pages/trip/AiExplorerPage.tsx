/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import AIPilot from '@/components/AIPilot';
import { Container } from '@/components/ui';
import { useCart, useI18n, useUI } from '@/hooks';

export default function AiExplorerPage() {
  const { language } = useI18n();
  const { addCombo } = useCart();
  const { selectedProvinceId } = useUI();
  const isVi = language === 'vi';

  return (
    <motion.main
      key="ai-explorer-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.22 }}
      className="bg-natural-bg py-8 md:py-10"
    >
      <Container className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-widest text-natural-accent">
            {isVi ? 'Trợ lý hành trình' : 'Trip assistant'}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-natural-ink md:text-4xl">
            {isVi ? 'AI Explorer' : 'AI Explorer'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {isVi
              ? 'Gợi ý combo khách sạn, di chuyển và trải nghiệm theo điểm đến hiện tại của bạn.'
              : 'Build a stay, transport and experience bundle around your current destination.'}
          </p>
        </div>

        <AIPilot language={language} currentProvinceId={selectedProvinceId} onAddComboToCart={addCombo} />
      </Container>
    </motion.main>
  );
}
