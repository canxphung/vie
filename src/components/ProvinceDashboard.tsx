/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Province, Language } from '../types';
import { provinces } from '../data';
import { MapPin, Map, Navigation, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

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

  return (
    <div className="w-full bg-[#FDFCF8] py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-serif font-bold text-[#8C7A5B] hover:text-[#5A5A40] transition bg-[#F5F2ED] border border-[#E6E2D3] shadow-xs px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <span>{isVi ? 'Quay lại chọn Vùng Miền' : 'Back to Regions'}</span>
          </button>
          
          <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-[#8C7A5B] animate-spin" />
            <span>{isVi ? 'Khu vực Miền Trung Việt Nam' : 'Central Vietnam Region Active'}</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#4A4A35] tracking-tight">
            {isVi ? 'Hệ thống Quản lý Hành trình Miền Trung' : 'Central Provinces Heritage Council'}
          </h2>
          <p className="text-[#4A4A35]/80 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            {isVi 
              ? 'Tích hợp hệ thống đặt tour, thuê khách sạn, thuê ô tô xe máy kèm bản đồ đồng bộ thời gian thực cho Quảng Nam - Hội An và các tỉnh thành lân cận.' 
              : 'Integrated reservation platform offering curated hotels, tour bookings, and vehicle rentals for Quang Nam - Hoi An & adjacent provinces.'}
          </p>
        </div>

        {/* Provinces display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {provinces.map((prov) => {
            const isClickable = prov.active; // quang-nam, da-nang, thua-thien-hue are active
            
            return (
              <motion.div
                key={prov.id}
                whileHover={isClickable ? { y: -6 } : {}}
                transition={{ duration: 0.3 }}
                className={`relative rounded-3xl overflow-hidden shadow-lg border bg-[#F9F7F2] ${
                  isClickable 
                    ? 'border-[#E6E2D3] cursor-pointer hover:shadow-xl hover:border-[#8C7A5B]' 
                    : 'border-[#E6E2D3]/60 opacity-70'
                }`}
                onClick={() => {
                  if (isClickable) {
                    onSelectProvince(prov.id);
                  }
                }}
              >
                {/* Hero preview image */}
                <div className="h-56 w-full overflow-hidden relative">
                  <img 
                    src={prov.image} 
                    alt={prov.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  
                {/* Status label banner */}
                <div className="absolute top-4 right-4 bg-[#5A5A40]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-[#E6E2D3]/20 font-semibold uppercase tracking-wider">
                  {isClickable ? (
                    <span className="text-[#E3B04B] font-bold">● {isVi ? 'KÍCH HOẠT' : 'READY'}</span>
                  ) : (
                    <span className="text-stone-300">⚡ {isVi ? 'ĐANG PHÁT TRIỂN' : 'UNDER DEV'}</span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold text-[#E3B04B] uppercase tracking-widest">{prov.tagline}</p>
                  <h3 className="text-xl font-serif font-bold tracking-tight">{prov.name}</h3>
                </div>
              </div>

              {/* Province Description */}
              <div className="p-5">
                <p className="text-[#4A4A35]/80 text-xs line-clamp-2 leading-relaxed">
                  {prov.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[#E6E2D3] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8C7A5B]" />
                    {prov.id === 'quang-nam' ? (isVi ? 'Đậm nét Hội An' : 'Heritage Core') : (isVi ? 'Liên tỉnh lân cận' : 'Coastal Gateway')}
                  </span>

                  {isClickable ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#8C7A5B]">
                      <span>{isVi ? 'Ấn để khám phá' : 'Click to Plan'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(isVi 
                          ? `Tỉnh ${prov.name} đang được số hóa dữ liệu đại lý lưu trú và lữ hành. Hiện tại chỉ có Quảng Nam - Hội An đang hoạt động đầy đủ.`
                          : `${prov.name} is currently undergoing digital vendor integration. Currently, only Quang Nam - Hoi An is fully active for reservation and planning.`
                        );
                      }}
                      className="text-[10px] text-[#8C7A5B] hover:text-[#5A5A40] underline font-bold transition-all cursor-pointer"
                    >
                      {isVi ? 'Xem lộ trình' : 'See roadmap'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

        {/* Travel safety statement */}
        <div className="mt-14 bg-[#F5F2ED] border border-[#E6E2D3] p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FDFCF8] border border-[#E6E2D3] rounded-full text-[#8C7A5B] shrink-0">
              <ShieldCheck className="w-6.5 h-6.5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-[#4A4A35]">{isVi ? 'Bảo chứng Lữ Hành Độc Quyền từ Ban Quản Lý' : 'Certified Safe Travel Assured'}</h4>
              <p className="text-xs text-[#4A4A35]/75 mt-1 max-w-xl leading-relaxed">
                {isVi 
                  ? 'Mọi chuỗi đặt phòng khách sạn, đại lý cho thuê phương tiện xe máy đều đã được tích hợp liên kết trực tiếp, bảo đảm quyền lợi hoàn tiền 100% khi lộ trình thời tiết bị thay đổi đột ngột.' 
                  : 'We safeguard all bookings, vehicle rentals, and regional tours through our legal 100% weather refund warranty.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onSelectProvince('quang-nam')}
            className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shrink-0"
          >
            {isVi ? 'Khám Phá Hội An Ngay' : 'Go to Hoi An First'}
          </button>
        </div>

      </div>
    </div>
  );
}
