/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, CalendarDays, ChevronDown, Compass, Hotel, MapPinned, Sparkles, UsersRound } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';
import type { Language } from '@/types';

interface HomeCinematicHeroProps {
  language: Language;
  onExploreCentral: () => void;
  onOpenTripRoom?: () => void;
  onOpenBlindTravel?: () => void;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=85';

// Staggered reveal so the hero "assembles" on load instead of snapping in flat.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HomeCinematicHero({
  language,
  onExploreCentral,
  onOpenTripRoom,
  onOpenBlindTravel,
}: HomeCinematicHeroProps) {
  const isVi = language === 'vi';

  return (
    <section className="grain-overlay relative min-h-[calc(100svh-64px)] overflow-hidden bg-stone-950 text-white">
      {/* Cinematic Ken Burns backdrop */}
      <img
        src={HERO_IMAGE}
        alt={isVi ? 'Phố cổ Hội An lúc hoàng hôn' : 'Hoi An ancient town at sunset'}
        className="animate-kenburns absolute inset-0 h-full w-full object-cover"
      />

      {/* Layered depth: left-anchored darkness, warm gold floor, and a vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-natural-bg via-natural-bg/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(80%_100%_at_30%_120%,rgba(227,176,75,0.22),transparent_70%)]" />

      {/* Ambient gold motes drifting in the dark zone */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="animate-float-soft absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-natural-gold/60 blur-[1px]" />
        <span className="animate-float-soft absolute left-[26%] top-[62%] h-1.5 w-1.5 rounded-full bg-natural-gold/40 blur-[1px] [animation-delay:1.5s]" />
        <span className="animate-float-soft absolute left-[8%] top-[48%] h-1 w-1 rounded-full bg-white/50 [animation-delay:3s]" />
        <span className="animate-float-soft absolute right-[22%] top-[20%] h-1.5 w-1.5 rounded-full bg-natural-gold/35 blur-[1px] [animation-delay:2.2s]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-7xl flex-col justify-center px-4 py-16 md:px-8"
      >
        <div className="max-w-3xl">
          <motion.span
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-natural-gold/30 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-natural-gold shadow-[0_0_30px_-8px_rgba(227,176,75,0.6)] backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-natural-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-natural-gold" />
            </span>
            {isVi ? 'Du lịch Việt Nam theo từng vùng' : 'Vietnam travel by region'}
          </motion.span>

          <motion.h1
            variants={rise}
            className="mt-6 max-w-4xl font-serif text-4xl font-black leading-[0.98] tracking-tight md:text-6xl lg:text-7xl"
          >
            {isVi ? (
              <>
                Khám phá Việt Nam theo vùng, theo gu,{' '}
                <span className="text-gold-gradient">theo nhịp của bạn.</span>
              </>
            ) : (
              <>
                Explore Vietnam by region, mood, and{' '}
                <span className="text-gold-gradient">your own pace.</span>
              </>
            )}
          </motion.h1>

          <motion.p variants={rise} className="mt-5 max-w-2xl text-sm leading-relaxed text-white/82 md:text-base">
            {isVi
              ? 'VietCharm gom điểm đến, nơi ở, xe, hoạt động và lịch trình AI vào một flow đặt chuyến. Khu vực phục vụ đang được mở rộng dần, với trải nghiệm thiết kế cho cả bản đồ Việt Nam.'
              : 'VietCharm brings destinations, stays, rides, experiences, and AI itineraries into one trip flow. Coverage keeps expanding across regions, with an experience designed for the full Vietnam map.'}
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="goldDeep"
              size="lg"
              onClick={onExploreCentral}
              className="rounded-full shadow-[0_12px_40px_-10px_rgba(227,176,75,0.65)]"
            >
              <Compass className="h-4 w-4" />
              <span>{isVi ? 'Xem vùng đang có dữ liệu' : 'Browse available regions'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onOpenBlindTravel}
              className="rounded-full border-white/25 bg-white/12 text-white hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isVi ? 'Để AI gợi ý chuyến đi' : 'Let AI suggest a trip'}</span>
            </Button>
          </motion.div>
        </div>

        <motion.div variants={rise} className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, value: isVi ? 'AI' : 'AI', label: isVi ? 'lịch trình theo gu' : 'mood-based routes' },
            { icon: Hotel, value: '18+', label: isVi ? 'lưu trú chọn lọc' : 'curated stays' },
            { icon: MapPinned, value: isVi ? 'Bắc-Trung-Nam' : 'N-C-S', label: isVi ? 'khung vùng du lịch' : 'regional framework' },
            { icon: UsersRound, value: isVi ? 'Nhóm' : 'Groups', label: isVi ? 'cùng vote lịch trình' : 'co-plan together' },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-natural-gold/40 hover:bg-white/15"
            >
              <Icon className="mb-2 h-4 w-4 text-natural-gold transition-transform duration-300 group-hover:scale-110" />
              <p className="font-mono text-lg font-black text-white">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/62">{label}</p>
            </div>
          ))}
        </motion.div>

        {onOpenTripRoom && (
          <motion.button
            variants={rise}
            type="button"
            onClick={onOpenTripRoom}
            className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70 transition hover:text-natural-gold"
          >
            <UsersRound className="h-4 w-4" />
            <span>{isVi ? 'Đi nhóm? Mở Trip Room để cùng chốt lịch' : 'Traveling as a group? Open Trip Room'}</span>
          </motion.button>
        )}
      </motion.div>

      {/* Scroll-to-explore cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-1 text-white/70">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{isVi ? 'Cuộn để khám phá' : 'Scroll to explore'}</span>
        <ChevronDown className="animate-scroll-cue h-4 w-4 text-natural-gold" />
      </div>
    </section>
  );
}
