/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Container } from '@/components/ui';
import { getProvinceHero } from '@/constants/provinceHero';

interface ProvinceHeroProps {
  provinceId: string;
  exploreLabel: string;
  onExplore: () => void;
}

export function ProvinceHero({ provinceId, exploreLabel, onExplore }: ProvinceHeroProps) {
  const hero = getProvinceHero(provinceId);

  return (
    <div className="relative w-full h-[320px] sm:h-[480px] md:h-[560px] overflow-hidden flex items-center shadow-inner">
      <div className="absolute inset-0 bg-black/45 z-10" />
      <img
        src={hero.image}
        alt="Central Province background"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      <Container className="relative z-20 text-white w-full space-y-4">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5 md:space-y-3"
        >
          <p className="font-serif italic text-lg md:text-3xl text-natural-gold font-medium">Khám phá vẻ đẹp</p>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-widest uppercase font-sans drop-shadow-lg text-white">
            {hero.title}
          </h2>
          <p className="text-xs sm:text-sm md:text-lg max-w-xl text-stone-200 font-medium leading-relaxed drop-shadow-md">
            {hero.subtitle}
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onExplore}
          className="bg-natural-accent hover:bg-natural-olive text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-serif font-bold transition shadow-lg tracking-wider hover:scale-105 active:scale-95 duration-200"
        >
          {exploreLabel} →
        </motion.button>
      </Container>
    </div>
  );
}
