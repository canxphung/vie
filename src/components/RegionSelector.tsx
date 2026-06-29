/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, Map, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { dictionaries } from '../data';
import { motion } from 'motion/react';
import { Button, MotifDivider, Reveal } from '@/components/ui';
import HomeCinematicHero from '@/components/HomeCinematicHero';
import JourneyMap from '@/components/JourneyMap';

interface RegionSelectorProps {
  language: Language;
  onSelectCentral: () => void;
  onSelectTripRoom?: () => void;
  onSelectBlindTravel?: () => void;
}

export default function RegionSelector({ language, onSelectCentral, onSelectTripRoom, onSelectBlindTravel }: RegionSelectorProps) {
  const t = dictionaries[language];
  const [showModal, setShowModal] = React.useState(false);
  const [selectedRegion, setSelectedRegion] = React.useState('');

  const handleRegionClick = (region: string) => {
    if (region === 'central') {
      onSelectCentral();
    } else {
      setSelectedRegion(region === 'north' ? t.north : t.south);
      setShowModal(true);
    }
  };

  return (
    <>
    <HomeCinematicHero
      language={language}
      onExploreCentral={onSelectCentral}
      onOpenTripRoom={onSelectTripRoom}
      onOpenBlindTravel={onSelectBlindTravel}
    />

    <JourneyMap language={language} onExplore={onSelectCentral} />

    <div className="w-full bg-natural-bg px-4 pb-16 pt-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs uppercase tracking-widest font-bold text-natural-accent bg-natural-beige border border-natural-border px-3.5 py-1.5 rounded-full">{t.selectRegion}</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-natural-text mt-6 tracking-tight leading-tight max-w-4xl mx-auto">
            {language === 'vi' ? 'Chọn vùng, rồi để VietCharm gom lịch trình cho bạn.' : 'Pick a region, then let VietCharm shape the trip.'}
          </h2>
          <p className="text-natural-text/80 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            {language === 'vi'
              ? 'Mỗi vùng có một nhịp đi riêng. VietCharm giữ cấu trúc Bắc, Trung, Nam ngang nhau; dữ liệu đặt dịch vụ sẽ được mở dần theo từng cụm điểm đến.'
              : 'Every region has its own travel rhythm. VietCharm keeps North, Central, and South equally visible while service data opens destination by destination.'}
          </p>
          <MotifDivider className="mt-7" />
        </motion.div>

        {/* Region selector Cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-6">
          
          {/* North Region */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative h-[360px] rounded-2xl overflow-hidden shadow-xl border border-natural-border cursor-pointer"
            onClick={() => handleRegionClick('north')}
          >
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-all duration-300 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80" 
              alt="Miền Bắc"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 z-20 bg-natural-olive/90 backdrop-blur-xs text-white border border-natural-border/20 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              {language === 'vi' ? 'Đang bổ sung' : 'Adding data'}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-left text-white flex flex-col justify-end">
              <span className="text-natural-accent-light text-xs font-semibold uppercase">{language === 'vi' ? 'Hà Nội - Hạ Long - Sa Pa' : 'Hanoi - Halong - Sapa'}</span>
              <h3 className="text-2xl font-serif font-bold tracking-tight mt-1">{t.north}</h3>
              <p className="text-stone-200 text-xs mt-2 line-clamp-2 leading-relaxed">
                {language === 'vi' ? 'Văn hiến nghìn năm, núi rừng Tây Bắc và vịnh biển phía Bắc trong cùng một khung lập lịch trình.' : 'Ancient capitals, northern mountains, and bay routes in the same itinerary framework.'}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-natural-gold group-hover:text-white">
                <span>{language === 'vi' ? 'Xem trước vùng' : 'Preview region'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </motion.div>

          {/* Central Region */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative h-[360px] rounded-2xl overflow-hidden shadow-xl border border-natural-gold cursor-pointer"
            onClick={() => handleRegionClick('central')}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/10 group-hover:bg-black/35 transition-all duration-300 z-10" />
            <img
              src="https://images.unsplash.com/photo-1676019556644-25abbce12a58?auto=format&fit=crop&w=800&q=80"
              alt="Miền Trung"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 z-20 bg-natural-gold text-natural-text border border-white/20 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
              {language === 'vi' ? 'Có dữ liệu demo' : 'Demo data'}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-left text-white flex flex-col justify-end">
              <span className="text-natural-gold text-xs font-bold uppercase">{language === 'vi' ? 'Hội An - Đà Nẵng - Huế' : 'Hoi An - Danang - Hue'}</span>
              <h3 className="text-2xl font-serif font-bold tracking-tight mt-1">{t.central}</h3>
              <p className="text-stone-200 text-xs mt-2 line-clamp-2 leading-relaxed">
                {language === 'vi' ? 'Phố cổ, biển và cố đô đang có một phần dữ liệu mẫu để chạy thử flow đặt dịch vụ.' : 'Ancient towns, beaches, and imperial sites currently include sample data for the booking flow.'}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-natural-gold group-hover:text-white">
                <span>{language === 'vi' ? 'Xem dịch vụ đang có' : 'View available services'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>

          {/* South Region */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative h-[360px] rounded-2xl overflow-hidden shadow-xl border border-natural-border cursor-pointer"
            onClick={() => handleRegionClick('south')}
          >
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-all duration-300 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80" 
              alt="Miền Nam"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 z-20 bg-natural-olive/90 backdrop-blur-xs text-white border border-natural-border/20 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              {language === 'vi' ? 'Đang bổ sung' : 'Adding data'}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-left text-white flex flex-col justify-end">
              <span className="text-natural-accent-light text-xs font-semibold uppercase">{language === 'vi' ? 'Sài Gòn - Miền Tây - Phú Quốc' : 'Saigon - Mekong - Phu Quoc'}</span>
              <h3 className="text-2xl font-serif font-bold tracking-tight mt-1">{t.south}</h3>
              <p className="text-stone-200 text-xs mt-2 line-clamp-2 leading-relaxed">
                {language === 'vi' ? 'Sài Gòn năng động, sông nước miền Tây và đảo biển phía Nam cho những chuyến đi nhiều sắc thái.' : 'Saigon energy, Mekong waterways, and southern island resets for varied trip styles.'}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-natural-gold group-hover:text-white">
                <span>{language === 'vi' ? 'Xem trước vùng' : 'Preview region'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </motion.div>

        </div>

        {/* REVOLUTIONARY GEN Z FEATURES BANNER - GẦN GŨI DI SẢN */}
        <Reveal className="max-w-5xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trip Room Box */}
          <div className="bg-white border-2 border-natural-accent/20 rounded-3xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-natural-accent/5 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full inline-block">
                👥 {language === 'vi' ? 'TRIP ROOM: PHÒNG LẬP KẾ HOẠCH NHÓM' : 'TRIP ROOM: GROUP PLANNER'}
              </span>
              <h4 className="text-xl font-serif font-black text-natural-text">
                {language === 'vi' ? 'Trip Room – Phòng Lập Kế Hoạch Đồng Thuận' : 'Trip Room – Group Co-Planning Oasis'}
              </h4>
              <p className="text-xs text-natural-text/80 leading-relaxed font-sans">
                {language === 'vi' 
                  ? 'Đi nhóm thường mệt vì tự quyết không đồng lòng, hay đổi lịch và nhập nhèm thanh toán. Trip Room cho phép gửi link mời, mọi người đề xuất sở thích, cùng vote cho khách sạn/ăn uống, và hiển thị hóa đơn thanh toán minh bạch.' 
                  : 'Collaboratively vote on hotels, dining, and custom tour structures. Set your specific preferences, cast votes, and track individual split bills transparently.'}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={onSelectTripRoom}
              className="w-full font-serif text-xs"
            >
              <span>{language === 'vi' ? 'Vào phòng lập kế hoạch' : 'Enter Trip Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Blind Travel Box */}
          <div className="bg-white border-2 border-natural-gold/20 rounded-3xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-natural-gold/5 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-black tracking-widest text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full inline-block">
                🔮 {language === 'vi' ? 'BLIND TRAVEL: TRẢI NGHIỆM ẨN SỐ' : 'BLIND TRAVEL: SURPRISE ADVENTURE'}
              </span>
              <h4 className="text-xl font-serif font-black text-natural-text">
                {language === 'vi' ? 'Blind Travel – Hành Trình Ẩn Số Độc Bản' : 'Blind Travel – Unbox Secret Getaways'}
              </h4>
              <p className="text-xs text-natural-text/80 leading-relaxed font-sans">
                {language === 'vi' 
                  ? 'Bỏ qua áp lực đau đầu so sánh giá và lên lịch trình. Chỉ nhập ngân sách, số ngày nghỉ và gu du lịch, hệ thống AI sẽ tự động đặt mọi thứ. Bạn sẽ không biết mình đi đâu cho đến khi ra sân bay (nhận gợi ý chuẩn bị trang phục trước 3 ngày)!' 
                  : 'Ditch the exhaustive schedules. Choose your budget, days and vibes. The AI reserves everything automatically and seals the final oracle destination card until you arrive at the airport!'}
              </p>
            </div>
            <Button
              variant="gold"
              onClick={onSelectBlindTravel}
              className="w-full font-serif text-xs"
            >
              <span>{language === 'vi' ? 'Khám phá hành trình ẩn số' : 'Explore Blind Travel'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        </Reveal>

        {/* Local trust statement banner */}
        <div className="mt-16 max-w-3xl mx-auto flex flex-wrap justify-center items-center gap-6 px-5 py-4 bg-natural-beige border border-natural-border rounded-2xl text-natural-text text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-natural-accent" />
            <span>{language === 'vi' ? 'Đặt chỗ rõ ràng, xác nhận nhanh' : 'Clear booking with quick confirmation'}</span>
          </div>
          <span className="hidden sm:inline text-natural-border">|</span>
          <div className="flex items-center gap-1.5">
            <Map className="w-5 h-5 text-natural-accent" />
            <span>{language === 'vi' ? 'Kết nối Du lịch Định vị Thời gian Thực' : 'Real-time GPS Integrated Navigation Guides'}</span>
          </div>
        </div>

      </div>

      {/* Sweet modal for North/South development warning */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-natural-bg rounded-2xl max-w-md w-full p-6 border border-natural-border border-t-8 border-t-natural-accent shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-stone-400 hover:text-stone-700 font-black text-xl"
            >
              ×
            </button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-natural-beige rounded-full text-natural-accent shrink-0 border border-natural-border">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-natural-text">{t.devStatus}</h3>
                <p className="text-natural-text/80 text-xs mt-3 leading-relaxed">
                  {t.devBody}
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-natural-accent hover:bg-natural-olive text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-md uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Tôi hiểu rồi' : 'Got it'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
