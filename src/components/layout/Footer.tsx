/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useI18n, useUI } from '@/hooks';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ShieldCheck, Headphones, Award, Compass, Clock } from 'lucide-react';

export default function Footer() {
  const { language } = useI18n();
  const { setView, setAllServicesTab, setSelectedProvinceId } = useUI();
  return (
      <footer className="bg-natural-ink text-natural-beige/85 pt-16 pb-12 px-4 md:px-8 border-t border-natural-accent/30 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Main 4-column layout + brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-natural-beige/10">
            {/* Brand block (takes 3/12 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-natural-gold/10 rounded-xl border border-natural-gold/30">
                  <Compass className="w-8 h-8 text-natural-gold" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-xl text-natural-bg tracking-wider leading-none">VIET CHARM</h4>
                  <span className="text-[9px] uppercase font-bold text-natural-gold tracking-widest block mt-1">HERITAGE & TRAVEL</span>
                </div>
              </div>

              {/* Slogan */}
              <p className="text-xs text-natural-beige/70 leading-relaxed">
                {language === 'vi' 
                  ? 'VietCharm mang đến những trải nghiệm du lịch chân thật và đáng nhớ tại Hội An và khắp Việt Nam.'
                  : 'VietCharm delivers authentic and memorable travel experiences in Hoi An and across Vietnam.'}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#facebook" className="w-8 h-8 rounded-full border border-natural-beige/25 flex items-center justify-center text-natural-beige/80 hover:text-natural-gold hover:border-natural-gold hover:bg-natural-gold/5 transition duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#instagram" className="w-8 h-8 rounded-full border border-natural-beige/25 flex items-center justify-center text-natural-beige/80 hover:text-natural-gold hover:border-natural-gold hover:bg-natural-gold/5 transition duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#youtube" className="w-8 h-8 rounded-full border border-natural-beige/25 flex items-center justify-center text-natural-beige/80 hover:text-natural-gold hover:border-natural-gold hover:bg-natural-gold/5 transition duration-300">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#tiktok" className="w-8 h-8 rounded-full border border-natural-beige/25 flex items-center justify-center text-natural-beige/80 hover:text-natural-gold hover:border-natural-gold hover:bg-natural-gold/5 transition duration-300 font-bold text-xs select-none">
                  ♪
                </a>
              </div>
            </div>

            {/* Links Block 1: KHÁM PHÁ (takes 2/12 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h5 className="font-bold text-xs uppercase text-natural-bg tracking-widest">
                  {language === 'vi' ? 'KHÁM PHÁ' : 'EXPLORE'}
                </h5>
                <span className="w-8 h-[2px] bg-natural-gold mt-2 block" />
              </div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button 
                    onClick={() => {
                      setSelectedProvinceId('quang-nam');
                      setView('province');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Khám phá Hội An' : 'Explore Hoi An'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('all-services');
                      setAllServicesTab('hotels');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Khách sạn' : 'Hotels'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('all-services');
                      setAllServicesTab('vehicles');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Thuê xe' : 'Car Rental'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('all-services');
                      setAllServicesTab('activities');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Hoạt động & vui chơi' : 'Experiences & Tours'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('tours');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Combo tiết kiệm' : 'Saver Combos'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('handbook');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Cẩm nang du lịch' : 'Travel Handbook'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Links Block 2: HỖ TRỢ (takes 2/12 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h5 className="font-bold text-xs uppercase text-natural-bg tracking-widest">
                  {language === 'vi' ? 'HỖ TRỢ' : 'SUPPORT'}
                </h5>
                <span className="w-8 h-[2px] bg-natural-gold mt-2 block" />
              </div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#help" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Trung tâm hỗ trợ' : 'Help Center'}</span>
                  </a>
                </li>
                <li>
                  <a href="#faq" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Câu hỏi thường gặp' : 'FAQs'}</span>
                  </a>
                </li>
                <li>
                  <a href="#booking-guide" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Hướng dẫn đặt dịch vụ' : 'Booking Guide'}</span>
                  </a>
                </li>
                <li>
                  <a href="#refund" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Chính sách hủy & hoàn tiền' : 'Cancellation & Refund'}</span>
                  </a>
                </li>
                <li>
                  <a href="#terms" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Use'}</span>
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Block 3: VỀ VIETCHARM (takes 2/12 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h5 className="font-bold text-xs uppercase text-natural-bg tracking-widest">
                  {language === 'vi' ? 'VỀ VIETCHARM' : 'ABOUT VIETCHARM'}
                </h5>
                <span className="w-8 h-[2px] bg-natural-gold mt-2 block" />
              </div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#about" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Giới thiệu về chúng tôi' : 'About Us'}</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setView('partnership-register');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Hợp tác với chúng tôi' : 'Work With Us'}</span>
                  </button>
                </li>
                <li>
                  <a href="#careers" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Tuyển dụng' : 'Careers'}</span>
                  </a>
                </li>
                <li>
                  <a href="#partners" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Đối tác & Liên kết' : 'Partners & Affiliates'}</span>
                  </a>
                </li>
                <li>
                  <a href="#blog" className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group">
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Tin tức & Blog' : 'News & Blog'}</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-natural-beige/75 hover:text-natural-gold transition duration-200 group text-left w-full cursor-pointer"
                  >
                    <span className="text-natural-gold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{language === 'vi' ? 'Liên hệ' : 'Contact'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Links Block 4: LIÊN HỆ (takes 3/12 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h5 className="font-bold text-xs uppercase text-natural-bg tracking-widest">
                  {language === 'vi' ? 'LIÊN HỆ' : 'CONTACT'}
                </h5>
                <span className="w-8 h-[2px] bg-natural-gold mt-2 block" />
              </div>
              <ul className="space-y-3.5 text-xs text-natural-beige/80">
                <li className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-natural-gold shrink-0 mt-0.5" />
                  <span>
                    {language === 'vi' 
                      ? '123 Trần Phú, Minh An, Hội An, Quảng Nam'
                      : '123 Tran Phu, Minh An, Hoi An, Quang Nam'}
                  </span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 text-natural-gold shrink-0" />
                  <span>Hotline: 1900 1234</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Mail className="w-4 h-4 text-natural-gold shrink-0" />
                  <span className="break-all">Email: info@vietcharm.com</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Clock className="w-4 h-4 text-natural-gold shrink-0" />
                  <span>
                    {language === 'vi' 
                      ? 'Thứ 2 - Chủ nhật: 8:00 - 21:00'
                      : 'Mon - Sun: 8:00 AM - 9:00 PM'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom row: Legals, trust badges, payment methods */}
          <div className="pt-8 flex flex-col xl:flex-row gap-8 items-center justify-between text-xs text-natural-beige/60">
            {/* Copyright and license */}
            <div className="space-y-1 text-center xl:text-left">
              <p className="font-medium text-stone-300">
                {language === 'vi' 
                  ? '© 2024 VietCharm Hội An. All rights reserved.' 
                  : '© 2024 VietCharm Hoi An. All rights reserved.'}
              </p>
              <p className="text-[10px] text-natural-beige/40 leading-relaxed max-w-md">
                {language === 'vi'
                  ? 'Giấy phép kinh doanh lữ hành quốc tế số GP-79-1124'
                  : 'International Tour Operator License No. GP-79-1124'}
              </p>
            </div>

            {/* Trust assurances badging center */}
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              {/* Badge 1: SSL Security */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-natural-beige/5 border border-stone-800/60">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] font-bold block text-stone-200 leading-none">
                    {language === 'vi' ? 'Thanh toán bảo mật' : 'Secure Checkout'}
                  </span>
                  <span className="text-[9px] text-natural-beige/40 block mt-0.5 leading-none">SSL 256-bit</span>
                </div>
              </div>

              {/* Badge 2: Support 24/7 */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-natural-beige/5 border border-stone-800/60">
                <Headphones className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] font-bold block text-stone-200 leading-none">
                    {language === 'vi' ? 'Hỗ trợ 24/7' : '24/7 Support'}
                  </span>
                  <span className="text-[9px] text-natural-beige/40 block mt-0.5 leading-none">
                    {language === 'vi' ? 'Luôn sẵn sàng' : 'Always Ready'}
                  </span>
                </div>
              </div>

              {/* Badge 3: Quality assurance */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-natural-beige/5 border border-stone-800/60">
                <Award className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] font-bold block text-stone-200 leading-none">
                    {language === 'vi' ? 'Đảm bảo chất lượng' : 'Quality Assurance'}
                  </span>
                  <span className="text-[9px] text-natural-beige/40 block mt-0.5 leading-none">
                    {language === 'vi' ? 'Dịch vụ tốt nhất' : 'Best Service'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment card badges right */}
            <div className="flex flex-col items-center xl:items-end gap-2.5">
              <span className="text-[11px] font-bold text-stone-400">
                {language === 'vi' ? 'Chấp nhận thanh toán' : 'We Accept Payments'}
              </span>
              <div className="flex items-center gap-1.5">
                {/* VISA */}
                <div className="px-2.5 py-1 bg-white rounded-lg flex items-center justify-center font-bold text-blue-800 text-[10px] tracking-tight border border-stone-200 h-6 w-11 shadow-xs select-none">
                  VISA
                </div>
                {/* Mastercard */}
                <div className="px-1 py-1 bg-white rounded-lg flex items-center justify-center gap-0.5 border border-stone-200 h-6 w-11 shadow-xs select-none relative">
                  <div className="w-3.5 h-3.5 bg-red-500 rounded-full opacity-90" />
                  <div className="w-3.5 h-3.5 bg-amber-500 rounded-full -ml-2.5 mix-blend-multiply opacity-90" />
                </div>
                {/* MoMo */}
                <div className="px-1.5 py-1 bg-[#A50064] text-white rounded-lg flex items-center justify-center font-extrabold text-[8px] tracking-tighter h-6 w-11 shadow-xs select-none">
                  momo
                </div>
                {/* ZaloPay */}
                <div className="px-1.5 py-1 bg-[#008FE5] text-white rounded-lg flex items-center justify-center font-black text-[7px] tracking-tight h-6 w-11 shadow-xs select-none">
                  ZaloPay
                </div>
                {/* PayPal */}
                <div className="px-2 py-1 bg-[#003087] text-white rounded-lg flex items-center justify-center font-serif font-black italic text-[9px] tracking-tighter h-6 w-11 shadow-xs select-none">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}
