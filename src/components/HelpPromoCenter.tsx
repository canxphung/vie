/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  HelpCircle, X, Sparkles, Gift, Compass, Copy, Check, BookOpen, 
  MapPin, Hotel, ShoppingBag, Users, CheckSquare, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface HelpPromoCenterProps {
  language: Language;
  onNavigateToPartnership: () => void;
  onNavigateToHotels: () => void;
  onNavigateToMysteryRoom: () => void;
}

export default function HelpPromoCenter({
  language,
  onNavigateToPartnership,
  onNavigateToHotels,
  onNavigateToMysteryRoom
}: HelpPromoCenterProps) {
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'guide' | 'promos'>('guide');
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // List of website onboarding steps
  const steps = [
    {
      icon: MapPin,
      title: isVi ? '1. Khám phá Điểm đến' : '1. Select Province',
      desc: isVi 
        ? 'Chọn một trong 5 tỉnh thành miền Trung (Quảng Nam, Đà Nẵng, Huế, Bình Định, Khánh Hòa) để bắt đầu hành trình.'
        : 'Choose from 5 beautiful Central provinces to browse tailored hotels, tours, and vehicle rentals.',
    },
    {
      icon: Hotel,
      title: isVi ? '2. Đặt Khách Sạn & Nghỉ Dưỡng' : '2. Premium Hotel Booking',
      desc: isVi 
        ? 'Duyệt và lựa chọn các cơ sở lưu trú, khách sạn cao cấp, homestay địa phương đã được bảo chứng chất lượng bởi VietCharm.'
        : 'Browse and select high-quality hotels, luxury resorts, and boutique homestays curated by VietCharm.',
    },
    {
      icon: ShoppingBag,
      title: isVi ? '3. Đặt Phòng, Thuê Xe & Hoạt Động' : '3. Customize Bookings',
      desc: isVi 
        ? 'Duyệt danh mục phía dưới để đặt riêng lẻ hoặc tùy chỉnh các dịch vụ khách sạn, xe máy, xe tự lái và tour trải nghiệm địa phương.'
        : 'Browse lists below the map to add vetted accommodations, local motorbikes, self-drive cars, or immersive tours to your cart.',
    },
    {
      icon: Users,
      title: isVi ? '4. Kết nối Trip Room Ẩn Số' : '4. Group Up & Split Bills',
      desc: isVi 
        ? 'Tạo hoặc tham gia phòng chat ghép đôi dạo chơi ẩn danh, cùng bình chọn lịch trình yêu thích và tính toán chia sẻ tiền phòng.'
        : 'Create or join a Mystery Room to chat anonymously, vote for favorite spots, and split bills dynamically with group members.',
    },
    {
      icon: CheckSquare,
      title: isVi ? '5. Áp Mã Voucher & Thanh toán' : '5. Apply Vouchers & Book',
      desc: isVi 
        ? 'Vào giỏ hàng, dán mã ưu đãi (Ví dụ: VIETCHARM15), điền Email để nhận hóa đơn bảo chứng di sản có QR hoàn hủy linh hoạt.'
        : 'Open your cart, apply coupon codes, fill in details, and download your heritage-backed travel voucher with cancellation rights.',
    }
  ];

  // List of active promotions
  const promos = [
    {
      code: 'VIETCHARM15',
      title: isVi ? 'Ưu Đãi Đặc Quyền Heritage' : 'Elite Heritage Discount',
      desc: isVi ? 'Giảm ngay 15% tổng hóa đơn thanh toán cho tất cả dịch vụ lữ hành.' : '15% Off all bookings including hotels and motorbike rentals.',
      badge: isVi ? 'HỘI VIÊN VIP' : 'VIP MEMBER'
    },
    {
      code: 'HELLOMIENTRUNG',
      title: isVi ? 'Chào Mừng Duyên Hải' : 'Coastal Welcome Pack',
      desc: isVi ? 'Tặng trực tiếp 100,000đ cho đơn đặt dịch vụ từ 300,000đ trở lên.' : 'Get 100,000 VND cashback on orders starting at 300,000 VND.',
      badge: isVi ? 'MỚI ĐĂNG KÝ' : 'WELCOME'
    },
    {
      code: 'CHARMHOTEL20',
      title: isVi ? 'Ưu Đãi Đặt Khách Sạn' : 'Hotel Super Saver',
      desc: isVi ? 'Giảm ngay 20% tối đa cho lượt đặt phòng khách sạn đầu tiên trên toàn hệ thống.' : 'Enjoy 20% discount on your first boutique hotel reservation.',
      badge: isVi ? 'PHÒNG ĐẸP' : 'HOTEL DEAL'
    },
    {
      code: 'GENZTRAVEL',
      title: isVi ? 'Phượt Bụi Đồng Hành' : 'Backpacker Freedom',
      desc: isVi ? 'Giảm thẳng 10% khi thuê xe máy tự lái Sirius/Exciter dạo phố lồng đèn.' : '10% Off on all local motorbike rentals for students and solo travelers.',
      badge: isVi ? 'GEN Z PHƯỢT' : 'SOLO RIDER'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      {/* Floating Help and Promo Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-natural-accent hover:bg-natural-olive text-white px-5 py-3.5 rounded-full shadow-2xl border border-amber-100 cursor-pointer text-xs font-serif font-black tracking-wider uppercase transition-all"
          id="help-promo-center-trigger"
        >
          <HelpCircle className="w-4 h-4 text-natural-gold" />
          <span>{isVi ? 'Hỗ trợ & Ưu đãi' : 'Help & Promos'}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-natural-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-natural-gold"></span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-natural-bg border border-natural-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header Title Bar */}
              <div className="bg-natural-text p-5 text-white flex justify-between items-center border-b border-natural-border/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-natural-accent rounded-lg">
                    <BookOpen className="w-5 h-5 text-natural-bg" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-base uppercase tracking-wide flex items-center gap-1.5">
                      {isVi ? 'TRUNG TÂM TRỢ GIÚP & QUÀ TẶNG' : 'GUEST HELP & PROMOTIONS'}
                      <Sparkles className="w-4 h-4 text-natural-gold animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-stone-300 font-sans tracking-wide">
                      {isVi ? 'Hướng dẫn làm chủ VietCharm & Săn Deal hời lữ hành' : 'Learn how to book, customize and capture discounts'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs list inside modal */}
              <div className="flex border-b border-stone-200 bg-natural-beige text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'guide'
                      ? 'border-natural-accent bg-natural-bg text-natural-accent'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{isVi ? 'Làm gì khi vô Web?' : 'How to Use Web?'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('promos')}
                  className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'promos'
                      ? 'border-natural-accent bg-natural-bg text-natural-accent'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>{isVi ? 'Mã Giảm Giá & Deal Sốc' : 'Promos & Codes'}</span>
                  <span className="bg-natural-gold text-natural-text text-[9px] font-mono px-1.5 rounded-full">NEW</span>
                </button>
              </div>

              {/* Scrollable Main Content */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
                
                {/* TAB 1: GUIDE/HOW TO USE WEB */}
                {activeTab === 'guide' && (
                  <div className="space-y-4 animate-fade-in text-xs text-natural-text">
                    <div className="bg-natural-cream border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-natural-text">
                          {isVi ? 'Xin chào Lữ Khách Phương Xa!' : 'Welcome to VietCharm!'}
                        </h4>
                        <p className="text-natural-text/85 leading-relaxed mt-1">
                          {isVi 
                            ? 'VietCharm là nền tảng số hóa di sản và quản lý hành trình miền Trung tiên phong. Chỉ với vài thao tác nhỏ dưới đây, bạn đã có thể sở hữu lịch trình tiết kiệm mộc mạc nhất:'
                            : 'VietCharm is an all-in-one portal designed to elevate your heritage explorations. Follow these step-by-step instructions to navigate perfectly:'}
                        </p>
                      </div>
                    </div>

                    <div className="relative border-l border-natural-accent/20 ml-3 pl-5 space-y-5">
                      {steps.map((st, sIdx) => {
                        const Icon = st.icon;
                        return (
                          <div key={sIdx} className="relative">
                            {/* Decorative line dot indicator */}
                            <span className="absolute -left-[27px] top-1.5 p-1 bg-natural-accent rounded-full text-white shadow-xs border border-white">
                              <Icon className="w-3 h-3 text-white" />
                            </span>
                            <h5 className="font-serif font-bold text-stone-800 text-sm">{st.title}</h5>
                            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed leading-relaxed">{st.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-natural-border pt-4 mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
                          {isVi ? 'Đại lý & Bên thứ ba muốn đăng ký?' : 'Are you a local service provider?'}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {isVi ? 'Bạn có thể đăng ký dịch vụ lưu trú, cho thuê xe, hoạt động ngay tại VietCharm.' : 'Apply to host rooms, cars or tours on our verified network.'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onNavigateToPartnership();
                        }}
                        className="bg-natural-accent hover:bg-natural-olive text-white font-bold py-2 px-4 rounded-xl text-[11px] uppercase transition shadow-md whitespace-nowrap cursor-pointer"
                      >
                        {isVi ? 'Đăng Ký Đối Tác →' : 'Apply Partner →'}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: ACTIVE PROMOTIONS */}
                {activeTab === 'promos' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-natural-cream border border-stone-200 p-4 rounded-2xl text-xs text-center">
                      <p className="font-serif font-black text-stone-800 uppercase tracking-tight text-sm">
                        {isVi ? '🔥 KHO VOUCHER KHUYẾN MÃI ĐỘC QUYỀN VIETCHARM' : 'EXCLUSIVE TRAVEL BUNDLED DISCOUNTS'}
                      </p>
                      <p className="text-stone-500 mt-1">
                        {isVi ? 'Nhấp chọn mã giảm giá để sao chép trực tiếp, áp dụng ngay ở Giỏ hàng thanh toán!' : 'Click any coupon code to copy it directly, and apply it in the payment checkout cart!'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {promos.map((pr, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="bg-white border-2 border-dashed border-natural-border hover:border-natural-accent p-4 rounded-2xl relative flex flex-col justify-between transition group shadow-xs"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <span className="bg-amber-600/10 text-amber-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                                {pr.badge}
                              </span>
                            </div>
                            <h5 className="font-serif font-bold text-stone-800 text-xs mt-2">{pr.title}</h5>
                            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed line-clamp-2">{pr.desc}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                            <span className="font-mono text-sm font-black text-natural-accent bg-natural-beige px-2.5 py-1 rounded-lg select-all border border-natural-border">
                              {pr.code}
                            </span>
                            <button
                              onClick={() => handleCopy(pr.code)}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                copiedCode === pr.code 
                                  ? 'bg-emerald-50 text-emerald-600' 
                                  : 'bg-natural-accent text-white hover:bg-natural-olive'
                              }`}
                            >
                              {copiedCode === pr.code ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-natural-accent/10 border border-natural-accent/30 p-4 rounded-2xl text-xs text-natural-text">
                      <h6 className="font-bold flex items-center gap-1">
                        <Hotel className="w-4 h-4 text-natural-accent" />
                        {isVi ? 'Mẹo Nhận Khuyến Mãi Khách Sạn' : 'Hotel Saving Tip:'}
                      </h6>
                      <p className="mt-1 leading-relaxed text-stone-600">
                        {isVi 
                          ? 'Mã phòng đẹp giảm cực sâu khi được áp dụng cùng các lựa chọn khách sạn tiêu chuẩn di sản của VietCharm. Hãy cuộn xuống, bấm chọn phòng yêu thích và nhập mã giảm giá!'
                          : 'Book beautiful properties with special rates. Choose any curated boutique hotel below and apply your coupon code during checkout!'}
                      </p>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onNavigateToHotels();
                        }}
                        className="text-xs font-bold text-natural-accent underline mt-2 block"
                      >
                        {isVi ? 'Đến danh mục Khách sạn ngay →' : 'Navigate to Hotels list now →'}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Panel */}
              <div className="bg-natural-cream border-t border-natural-border p-4 text-center text-[10px] text-stone-400 font-mono flex flex-wrap justify-between items-center gap-2">
                <span>VIETCHARM ONLINE CONCIERGE SUPPORT</span>
                <span>HOTLINE: 1900 5040</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
