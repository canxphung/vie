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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function ProvinceHero({ provinceId, exploreLabel, onExplore }: ProvinceHeroProps) {
  const hero = getProvinceHero(provinceId);

  return (
    <div className="relative w-full h-[340px] sm:h-[480px] md:h-[600px] overflow-hidden flex items-center">
      {/* Ken Burns image */}
      <img
        src={hero.image}
        alt="Central Province background"
        className="absolute inset-0 w-full h-full object-cover select-none animate-kenburns"
      />

      {/* Layered overlays: bottom-up legibility scrim + warm gold vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
      <div
        className="absolute inset-0 z-10 mix-blend-soft-light opacity-60"
        style={{
          background:
            'radial-gradient(120% 90% at 15% 100%, rgba(227,176,75,0.45), transparent 60%)',
        }}
      />
      {/* Subtle bottom fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-natural-bg/90 to-transparent" />

      <Container className="relative z-20 text-white w-full">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2.5 md:space-y-4">
          <motion.div variants={rise} className="flex items-center gap-3">
            <span className="h-px w-10 bg-natural-gold/80" />
            <p className="font-serif italic text-base md:text-2xl text-gold-gradient font-semibold tracking-wide">
              Khám phá vẻ đẹp
            </p>
          </motion.div>

          <motion.h2
            variants={rise}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-[0.06em] uppercase text-white"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.55)' }}
          >
            {hero.title}
          </motion.h2>

          <motion.p
            variants={rise}
            className="text-sm md:text-lg max-w-xl text-stone-100/90 font-medium leading-relaxed drop-shadow-md"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div variants={rise} className="pt-2">
            <button
              onClick={onExplore}
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-natural-gold via-amber-300 to-natural-gold-deep px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-widest text-stone-950 shadow-luxe-lg transition duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span>{exploreLabel}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
