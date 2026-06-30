/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { provinces, hotelsByProvince, activitiesByProvince, attractionsByProvince } from '@/data';
import { BlurImage, Button, MotifDivider, Reveal } from '@/components/ui';
import { useUI, useI18n, useToast } from '@/hooks';

const SERVICE_STRINGS = {
  hotels: {
    vi: { heading: 'Chọn điểm đến để xem khách sạn', label: 'khách sạn', actionPrefix: 'Xem khách sạn tại' },
    en: { heading: 'Choose a destination for hotels', label: 'hotels', actionPrefix: 'View hotels in' },
  },
  activities: {
    vi: { heading: 'Chọn điểm đến để xem hoạt động', label: 'hoạt động', actionPrefix: 'Xem hoạt động tại' },
    en: { heading: 'Choose a destination for activities', label: 'activities', actionPrefix: 'View activities in' },
  },
  attractions: {
    vi: { heading: 'Chọn nơi bạn muốn khám phá', label: 'điểm đến', actionPrefix: 'Xem điểm đến tại' },
    en: { heading: 'Choose where you want to explore', label: 'places', actionPrefix: 'View places in' },
  },
  vehicles: {
    vi: { heading: 'Chọn điểm đến để xem phương tiện', label: 'phương tiện', actionPrefix: 'Xem phương tiện tại' },
    en: { heading: 'Choose a destination for transport', label: 'vehicles', actionPrefix: 'View transport in' },
  },
} as const;

function getServiceCount(serviceTab: string, provinceId: string): number {
  if (serviceTab === 'hotels') return hotelsByProvince[provinceId]?.length ?? 0;
  if (serviceTab === 'activities') return activitiesByProvince[provinceId]?.length ?? 0;
  if (serviceTab === 'attractions') return attractionsByProvince[provinceId]?.length ?? 0;
  return 0;
}

export default function ServiceProvincesPage() {
  const { allServicesServicePicker, allServicesVehicleMode, openAllServices, setView } = useUI();
  const { language } = useI18n();
  const { showToast } = useToast();
  const isVi = language === 'vi';

  const serviceTab = allServicesServicePicker;
  const lang = isVi ? 'vi' : 'en';
  const base = SERVICE_STRINGS[serviceTab][lang];
  // Vehicles share one picker but two intents (rent vs. taxi) — reflect that in copy.
  const display =
    serviceTab === 'vehicles'
      ? allServicesVehicleMode === 'taxi'
        ? {
            heading: isVi ? 'Chọn điểm đến để đặt taxi' : 'Choose a destination to book a taxi',
            label: isVi ? 'taxi' : 'taxi',
            actionPrefix: isVi ? 'Đặt taxi tại' : 'Book a taxi in',
          }
        : {
            heading: isVi ? 'Chọn điểm đến để thuê xe' : 'Choose a destination to rent a vehicle',
            label: isVi ? 'xe' : 'vehicles',
            actionPrefix: isVi ? 'Thuê xe tại' : 'Rent a vehicle in',
          }
      : base;
  const primaryProvince = provinces.find((province) => province.active) || provinces[0];

  return (
    <div className="w-full bg-natural-bg py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Top bar */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => setView('regions')}
            className="flex items-center gap-2 text-xs font-serif font-bold text-natural-accent hover:text-natural-olive transition bg-natural-beige border border-natural-border shadow-xs px-4 py-2 rounded-full w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-natural-accent" />
            <span>{isVi ? 'Trang chủ' : 'Home'}</span>
          </button>

          <button
            onClick={() => openAllServices(serviceTab, 'service-provinces')}
            className="text-xs font-bold text-natural-accent hover:text-natural-olive transition flex items-center gap-1"
          >
            {isVi ? `Xem tất cả ${display.label}` : `View all ${display.label}`}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Heading */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-gradient">
            {isVi ? 'Chọn điểm đến' : 'Choose a destination'}
          </span>
          <h2 className="mt-1 text-2xl md:text-4xl font-serif font-bold text-natural-text tracking-tight">
            {display.heading}
          </h2>
          <p className="text-natural-text/80 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            {isVi
              ? `Mỗi điểm đến có danh sách ${display.label} riêng. Chọn nơi bạn muốn đi trước, rồi xem các lựa chọn phù hợp ở đó.`
              : `Each destination has its own ${display.label} list. Pick where you want to go, then browse matching options there.`}
          </p>
          <MotifDivider className="mt-6 md:justify-start" />
        </div>

        {/* Province grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {provinces.map((prov, index) => {
            const isClickable = prov.active;
            const count = getServiceCount(serviceTab, prov.id);
            // Vehicles aren't province-keyed yet, so show a generic "rent on arrival"
            // label instead of a misleading zero count.
            const metaLabel = !isClickable
              ? (isVi ? 'SẮP RA MẮT' : 'Coming soon')
              : serviceTab === 'vehicles'
                ? (isVi ? 'Có sẵn để thuê' : 'Available to rent')
                : count > 0
                  ? `${count} ${display.label}`
                  : (isVi ? 'Đang cập nhật' : 'Updating');

            return (
              <Reveal key={prov.id} delay={Math.min(index, 5) * 0.07} className="h-full">
                <motion.div
                  whileHover={isClickable ? { y: -6 } : {}}
                  transition={{ duration: 0.3 }}
                  className={`group relative h-full rounded-3xl overflow-hidden border bg-natural-beige-light transition duration-300 ${
                    isClickable
                      ? 'border-natural-border cursor-pointer shadow-luxe hover:shadow-luxe-lg hover:border-natural-gold/45'
                      : 'border-natural-border/60 opacity-70 shadow-lg'
                  }`}
                  onClick={() => {
                    if (isClickable) {
                      openAllServices(serviceTab, 'service-provinces', prov.id);
                    }
                  }}
                >
                  {/* Hero image */}
                  <div className="h-56 w-full overflow-hidden relative">
                    <BlurImage
                      src={prov.image}
                      alt={prov.name}
                      wrapperClassName="absolute inset-0"
                      className="h-full w-full object-cover transition duration-[600ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    {/* Status badge */}
                    <div
                      className={`absolute top-4 right-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        isClickable
                          ? 'border-white/50 bg-white/95 text-natural-accent'
                          : 'border-white/20 bg-black/35 text-white/75'
                      }`}
                    >
                      {isClickable ? (isVi ? 'HOẠT ĐỘNG' : 'Available') : (isVi ? 'SẮP RA MẮT' : 'Soon')}
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-[10px] font-bold text-natural-gold uppercase tracking-widest">{prov.tagline}</p>
                      <h3 className="text-xl font-serif font-bold tracking-tight">{prov.name}</h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <p className="text-natural-text/80 text-xs line-clamp-2 leading-relaxed">
                      {prov.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-natural-border flex items-center justify-between">
                      <span className="text-[11px] font-mono text-stone-500 uppercase flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-natural-accent" />
                        {metaLabel}
                      </span>

                      {isClickable ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-natural-accent">
                          <span>{isVi ? 'Xem ngay' : 'View'}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast({
                              type: 'info',
                              title: isVi ? 'Điểm đến đang cập nhật' : 'Destination is being updated',
                              message: isVi
                                ? `${prov.name} chưa có đầy đủ dữ liệu. Bạn có thể xem Quảng Nam - Hội An trước.`
                                : `${prov.name} is not fully available yet. You can browse Quang Nam - Hoi An for now.`,
                            });
                          }}
                          className="text-[10px] text-natural-accent hover:text-natural-olive underline font-bold transition-all cursor-pointer"
                        >
                          {isVi ? 'Xem lộ trình' : 'See roadmap'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom CTA banner */}
        <Reveal className="mt-14">
          <div className="rounded-3xl border border-natural-border bg-natural-beige p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-natural-text">
                  {isVi ? 'Chưa chắc nên bắt đầu từ đâu?' : 'Not sure where to start?'}
                </h4>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-natural-text/75">
                  {isVi
                    ? `Bạn có thể xem toàn bộ ${display.label}, hoặc bắt đầu với ${primaryProvince.name}.`
                    : `You can view the full list, or start with ${primaryProvince.name}.`}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openAllServices(serviceTab, 'service-provinces')}
                  className="w-full whitespace-normal text-center text-xs uppercase tracking-wider sm:w-auto"
                >
                  {isVi ? `Xem tất cả ${display.label}` : `View all ${display.label}`}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => openAllServices(serviceTab, 'service-provinces', primaryProvince.id)}
                  className="w-full whitespace-normal text-center text-xs uppercase tracking-wider sm:w-auto"
                >
                  {`${display.actionPrefix} ${primaryProvince.name}`}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
