/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Clock3, Compass, Hotel, MapPinned, Route, Utensils } from 'lucide-react';
import { Button, Reveal } from '@/components/ui';
import type { Language } from '@/types';

interface JourneyMapProps {
  language: Language;
  onExplore: () => void;
}

type RouteId = 'north' | 'central' | 'south';

const ROUTES: Array<{
  id: RouteId;
  x: string;
  y: string;
  image: string;
  vi: { name: string; eyebrow: string; stay: string; food: string; route: string; status: string };
  en: { name: string; eyebrow: string; stay: string; food: string; route: string; status: string };
}> = [
  {
    id: 'north',
    x: '35%',
    y: '28%',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80',
    vi: {
      name: 'Miền Bắc',
      eyebrow: 'Hà Nội, Hạ Long, Sa Pa',
      stay: 'Khách sạn phố cổ hoặc retreat vùng núi',
      food: 'Phở, bún chả, đặc sản vùng cao',
      route: 'Gợi ý: phố cổ Hà Nội, vịnh biển, ruộng bậc thang và bản làng.',
      status: 'Đang bổ sung dữ liệu đối tác',
    },
    en: {
      name: 'Northern Vietnam',
      eyebrow: 'Hanoi, Ha Long, Sa Pa',
      stay: 'Old Quarter hotels or mountain retreats',
      food: 'Pho, bun cha, highland specialties',
      route: 'Idea: Hanoi old streets, bay views, rice terraces, and village stays.',
      status: 'Partner data being added',
    },
  },
  {
    id: 'central',
    x: '54%',
    y: '52%',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80',
    vi: {
      name: 'Miền Trung',
      eyebrow: 'Hội An, Đà Nẵng, Huế',
      stay: 'Boutique phố cổ, khách sạn biển hoặc resort yên tĩnh',
      food: 'Mì Quảng, cao lầu, bún bò, hải sản',
      route: 'Gợi ý: phố cổ, bãi biển, cố đô và một chặng ẩm thực địa phương.',
      status: 'Đang mở đặt dịch vụ',
    },
    en: {
      name: 'Central Vietnam',
      eyebrow: 'Hoi An, Da Nang, Hue',
      stay: 'Ancient-town boutiques, beach hotels, or quiet resorts',
      food: 'Mi quang, cao lau, bun bo, seafood',
      route: 'Idea: old town, beach time, imperial sites, and a local food leg.',
      status: 'Now open for booking',
    },
  },
  {
    id: 'south',
    x: '70%',
    y: '72%',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    vi: {
      name: 'Miền Nam',
      eyebrow: 'Sài Gòn, miền Tây, Phú Quốc',
      stay: 'Khách sạn trung tâm, homestay sông nước hoặc resort đảo',
      food: 'Cơm tấm, hủ tiếu, trái cây miệt vườn',
      route: 'Gợi ý: city break, chợ nổi, vườn trái cây và vài ngày nghỉ biển.',
      status: 'Đang bổ sung dữ liệu đối tác',
    },
    en: {
      name: 'Southern Vietnam',
      eyebrow: 'Saigon, Mekong, Phu Quoc',
      stay: 'City hotels, riverside homestays, or island resorts',
      food: 'Com tam, hu tieu, orchard fruit',
      route: 'Idea: city break, floating market, orchards, and a beach reset.',
      status: 'Partner data being added',
    },
  },
];

export default function JourneyMap({ language, onExplore }: JourneyMapProps) {
  const isVi = language === 'vi';
  const [activeRouteId, setActiveRouteId] = React.useState<RouteId>('central');
  const activeRoute = ROUTES.find((route) => route.id === activeRouteId) || ROUTES[1];
  const copy = activeRoute[isVi ? 'vi' : 'en'];

  return (
    <section className="bg-natural-bg px-4 py-16 text-natural-text">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-natural-bronze">
                {isVi ? 'Ý tưởng tuyến theo vùng' : 'Regional route ideas'}
              </span>
              <h2 className="mt-2 max-w-3xl font-serif text-3xl font-black tracking-tight text-natural-ink md:text-5xl">
                {isVi ? 'Bắc, Trung, Nam đều là một phần của bản đồ VietCharm.' : 'North, Central, and South all belong on the VietCharm map.'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
                {isVi
                  ? 'Gợi ý tuyến cho từng vùng để bạn hình dung hành trình. Dịch vụ đặt trực tiếp đang được mở rộng dần ra cả ba miền.'
                  : 'Route ideas for each region to help you picture the trip. Direct booking is expanding across all three regions.'}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={onExplore} className="w-fit">
              <Compass className="h-4 w-4" />
              <span>{isVi ? 'Xem dịch vụ đang có' : 'Browse available services'}</span>
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Reveal className="min-h-[440px]">
            <div className="relative h-full min-h-[440px] overflow-hidden rounded-3xl border border-natural-border bg-[#E9E1CD] shadow-luxe">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
                alt={isVi ? 'Bản đồ ý tưởng du lịch Việt Nam' : 'Vietnam regional travel ideas'}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.58),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.52),transparent_24%)]" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M35 28 C42 38, 47 45, 54 52 S64 64, 70 72" fill="none" stroke="#8C7A5B" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2.5 2.5" />
              </svg>

              {ROUTES.map((route, index) => {
                const routeCopy = route[isVi ? 'vi' : 'en'];
                const active = activeRouteId === route.id;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setActiveRouteId(route.id)}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center"
                    style={{ left: route.x, top: route.y }}
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-xl transition ${active ? 'bg-natural-gold text-natural-ink scale-110' : 'bg-natural-accent text-white hover:scale-105'}`}>
                      <MapPinned className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${active ? 'bg-natural-ink text-white' : 'bg-white text-natural-text'}`}>
                      {index + 1}. {routeCopy.name}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/35 bg-white/75 p-4 backdrop-blur-md">
                <div className="grid gap-3 text-left sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-natural-accent" />
                    <span className="text-xs font-bold">{isVi ? 'Lịch trình linh hoạt' : 'Flexible itineraries'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-natural-accent" />
                    <span className="text-xs font-bold">{isVi ? '3 miền cùng hiện diện' : '3 regions represented'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-natural-accent" />
                    <span className="text-xs font-bold">{isVi ? 'Mở rộng dần theo vùng' : 'Growing region by region'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="h-full overflow-hidden rounded-3xl border border-natural-border bg-white shadow-luxe">
              <div className="relative h-48">
                <img src={activeRoute.image} alt={copy.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-natural-gold">{copy.eyebrow}</p>
                  <h3 className="font-serif text-3xl font-black">{copy.name}</h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="rounded-2xl bg-natural-cream p-4">
                  <p className="flex items-center gap-2 text-xs font-black uppercase text-natural-accent">
                    <Route className="h-4 w-4" />
                    {isVi ? 'Tuyến gợi ý' : 'Route idea'}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-natural-ink">{copy.route}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-natural-bronze">{copy.status}</p>
                </div>
                <div className="grid gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Hotel className="mt-0.5 h-4 w-4 text-natural-accent" />
                    <span>{copy.stay}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Utensils className="mt-0.5 h-4 w-4 text-natural-accent" />
                    <span>{copy.food}</span>
                  </div>
                </div>
                <Button type="button" variant="goldDeep" onClick={onExplore} className="w-full">
                  <span>{isVi ? 'Xem dịch vụ đang có' : 'Browse available services'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
