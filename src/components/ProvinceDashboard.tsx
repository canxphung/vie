/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Province, Language } from '../types';
import { provinces } from '../data';
import { MapPin, Map, Navigation, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '@/hooks';
import { BlurImage, Button, MotifDivider, Reveal } from '@/components/ui';

interface ProvinceDashboardProps {
  language: Language;
  onSelectProvince: (provId: string) => void;
  onBackToHome: () => void;
}

export default function ProvinceDashboard({
  language,
  onSelectProvince,
  onBackToHome,
}: ProvinceDashboardProps) {
  const isVi = language === 'vi';
  const { showToast } = useToast();

  return (
    <div className="w-full bg-natural-bg py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-serif font-bold text-natural-accent hover:text-natural-olive transition bg-natural-beige border border-natural-border shadow-xs px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-natural-accent" />
            <span>{isVi ? 'Quay lại chọn Vùng Miền' : 'Back to Regions'}</span>
          </button>
          
          <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-natural-accent animate-spin" />
            <span>{isVi ? 'Khu vực Miền Trung Việt Nam' : 'Central Vietnam Region Active'}</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-gradient">
            {isVi ? 'Di sản Miền Trung' : 'Central Heritage'}
          </span>
          <h2 className="mt-1 text-2xl md:text-4xl font-serif font-bold text-natural-text tracking-tight">
            {isVi ? 'Hệ thống Quản lý Hành trình Miền Trung' : 'Central Provinces Heritage Council'}
          </h2>
          <p className="text-natural-text/80 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            {isVi 
              ? 'Tích hợp hệ thống đặt tour, thuê khách sạn, thuê ô tô xe máy kèm bản đồ đồng bộ thời gian thực cho Quảng Nam - Hội An và các tỉnh thành lân cận.' 
              : 'Integrated reservation platform offering curated hotels, tour bookings, and vehicle rentals for Quang Nam - Hoi An & adjacent provinces.'}
          </p>
          <MotifDivider className="mt-6 md:justify-start" />
        </div>

        {/* Provinces display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {provinces.map((prov, index) => {
            const isClickable = prov.active; // quang-nam, da-nang, thua-thien-hue are active

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
                    onSelectProvince(prov.id);
                  }
                }}
              >
                {/* Hero preview image */}
                <div className="h-56 w-full overflow-hidden relative">
                  <BlurImage
                    src={prov.image}
                    alt={prov.name}
                    wrapperClassName="absolute inset-0"
                    className="h-full w-full object-cover transition duration-[600ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  
                {/* Status label banner */}
                <div className="absolute top-4 right-4 bg-natural-olive/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-natural-border/20 font-semibold uppercase tracking-wider">
                  {isClickable ? (
                    <span className="text-natural-gold font-bold">● {isVi ? 'KÍCH HOẠT' : 'READY'}</span>
                  ) : (
                    <span className="text-stone-300">⚡ {isVi ? 'ĐANG PHÁT TRIỂN' : 'UNDER DEV'}</span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold text-natural-gold uppercase tracking-widest">{prov.tagline}</p>
                  <h3 className="text-xl font-serif font-bold tracking-tight">{prov.name}</h3>
                </div>
              </div>

              {/* Province Description */}
              <div className="p-5">
                <p className="text-natural-text/80 text-xs line-clamp-2 leading-relaxed">
                  {prov.description}
                </p>

                <div className="mt-5 pt-4 border-t border-natural-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-natural-accent" />
                    {prov.id === 'quang-nam' ? (isVi ? 'Đậm nét Hội An' : 'Heritage Core') : (isVi ? 'Liên tỉnh lân cận' : 'Coastal Gateway')}
                  </span>

                  {isClickable ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-natural-accent">
                      <span>{isVi ? 'Ấn để khám phá' : 'Click to Plan'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast({
                          type: 'info',
                          title: isVi ? 'Tỉnh đang được số hóa' : 'Province is being digitized',
                          message: isVi
                            ? `Tỉnh ${prov.name} đang được tích hợp dữ liệu lưu trú và lữ hành. Hiện tại Quảng Nam - Hội An hoạt động đầy đủ.`
                            : `${prov.name} is undergoing vendor integration. Quang Nam - Hoi An is currently fully active.`,
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

        {/* Travel safety statement */}
        <div className="mt-14 bg-natural-beige border border-natural-border p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-natural-bg border border-natural-border rounded-full text-natural-accent shrink-0">
              <ShieldCheck className="w-6.5 h-6.5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-natural-text">{isVi ? 'Bảo chứng Lữ Hành Độc Quyền từ Ban Quản Lý' : 'Certified Safe Travel Assured'}</h4>
              <p className="text-xs text-natural-text/75 mt-1 max-w-xl leading-relaxed">
                {isVi 
                  ? 'Mọi chuỗi đặt phòng khách sạn, đại lý cho thuê phương tiện xe máy đều đã được tích hợp liên kết trực tiếp, bảo đảm quyền lợi hoàn tiền 100% khi lộ trình thời tiết bị thay đổi đột ngột.' 
                  : 'We safeguard all bookings, vehicle rentals, and regional tours through our legal 100% weather refund warranty.'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => onSelectProvince('quang-nam')}
            className="shrink-0 text-xs uppercase tracking-wider"
          >
            {isVi ? 'Khám Phá Hội An Ngay' : 'Go to Hoi An First'}
          </Button>
        </div>

      </div>
    </div>
  );
}
