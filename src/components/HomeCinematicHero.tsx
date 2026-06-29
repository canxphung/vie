/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, CalendarDays, Compass, Hotel, MapPinned, Sparkles, UsersRound } from 'lucide-react';
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

export default function HomeCinematicHero({
  language,
  onExploreCentral,
  onOpenTripRoom,
  onOpenBlindTravel,
}: HomeCinematicHeroProps) {
  const isVi = language === 'vi';

  return (
    <section className="relative min-h-[calc(100svh-64px)] overflow-hidden bg-stone-950 text-white">
      <img
        src={HERO_IMAGE}
        alt={isVi ? 'Phố cổ Hội An lúc hoàng hôn' : 'Hoi An ancient town at sunset'}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 to-black/18" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-natural-bg via-natural-bg/30 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-natural-gold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            {isVi ? 'Du lịch Việt Nam theo từng vùng' : 'Vietnam travel by region'}
          </span>

          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-black leading-[0.98] tracking-tight md:text-6xl lg:text-7xl">
            {isVi ? 'Khám phá Việt Nam theo vùng, theo gu, theo nhịp của bạn.' : 'Explore Vietnam by region, mood, and travel pace.'}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/82 md:text-base">
            {isVi
              ? 'VietCharm gom điểm đến, nơi ở, xe, hoạt động và lịch trình AI vào một flow đặt chuyến. Khu vực phục vụ đang được mở rộng dần, với trải nghiệm thiết kế cho cả bản đồ Việt Nam.'
              : 'VietCharm brings destinations, stays, rides, experiences, and AI itineraries into one trip flow. Coverage keeps expanding across regions, with an experience designed for the full Vietnam map.'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="goldDeep" size="lg" onClick={onExploreCentral} className="rounded-full">
              <Compass className="h-4 w-4" />
              <span>{isVi ? 'Xem vùng đang có dữ liệu' : 'Browse available regions'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={onOpenBlindTravel} className="rounded-full border-white/25 bg-white/12 text-white hover:bg-white/20">
              <Sparkles className="h-4 w-4" />
              <span>{isVi ? 'Để AI gợi ý chuyến đi' : 'Let AI suggest a trip'}</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, value: isVi ? 'AI' : 'AI', label: isVi ? 'lịch trình theo gu' : 'mood-based routes' },
            { icon: Hotel, value: '18+', label: isVi ? 'lưu trú chọn lọc' : 'curated stays' },
            { icon: MapPinned, value: isVi ? 'Bắc-Trung-Nam' : 'N-C-S', label: isVi ? 'khung vùng du lịch' : 'regional framework' },
            { icon: UsersRound, value: isVi ? 'Nhóm' : 'Groups', label: isVi ? 'cùng vote lịch trình' : 'co-plan together' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              <Icon className="mb-2 h-4 w-4 text-natural-gold" />
              <p className="font-mono text-lg font-black text-white">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/62">{label}</p>
            </div>
          ))}
        </div>

        {onOpenTripRoom && (
          <button
            type="button"
            onClick={onOpenTripRoom}
            className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70 transition hover:text-natural-gold"
          >
            <UsersRound className="h-4 w-4" />
            <span>{isVi ? 'Đi nhóm? Mở Trip Room để cùng chốt lịch' : 'Traveling as a group? Open Trip Room'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
