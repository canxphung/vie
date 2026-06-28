/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, MapPin, Phone, Mail, Award, Key, Calendar, ShieldCheck, Database, BarChart3, Plus, Trash2, Check, X, FileText, ClipboardList, Car, Star, Tag, Gift, BookOpen, Compass, Info, CheckCircle2, ChevronRight, Sparkles, Heart } from 'lucide-react';
import type { Language, BookingCartItem, UserAccount, PartnershipApplication, PromoVoucher, SystemBooking, ViewableItem } from '@/types';
import { TOURIST_LOCATIONS } from '@/constants/seed/touristLocations';
import { PREDEFINED_COMBOS } from '@/constants/seed/tourCombos';

// 6. COMPONENT: PARTNERSHIP REGISTRATION WITH STATUS TRACKING
// ==========================================
interface PartnershipFormProps {
  language: Language;
  onRegisterApplication: (app: PartnershipApplication) => void;
  applications: PartnershipApplication[];
}

export function PartnershipForm({ language, onRegisterApplication, applications }: PartnershipFormProps) {
  const isVi = language === 'vi';
  const [brandName, setBrandName] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [type, setType] = React.useState<PartnershipApplication['type']>('hotel');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !contactName.trim()) return;

    const trackingId = `VC-PARTNER-${1000 + Math.floor(Math.random() * 8999)}`;
    const newApp: PartnershipApplication = {
      id: trackingId,
      brandName: brandName.trim(),
      contactName: contactName.trim(),
      type,
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    onRegisterApplication(newApp);
    setSubmittedCode(trackingId);

    // Reset fields
    setBrandName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-natural-text space-y-8">
      <div className="text-center space-y-2">
        <span className="bg-natural-accent text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full">
          VIETCHARM MERCHANDISE NETWORK
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐĂNG KÝ HỢP TÁC KINH DOANH LỮ HÀNH' : 'REGISTER LOCAL PARTNERSHIP & ALLIANCE'}
        </h2>
        <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
          {isVi 
            ? 'Liên kết khách sạn của bạn, đội xe taxi, hoặc các làng nghề thủ công để cùng VietCharm xây dựng hệ sinh thái di sản bền vững.'
            : 'Integrate your hotels, taxi transfer fleets, or handcrafted workshops into our unified sustainable portal.'}
        </p>
      </div>

      {submittedCode && (
        <div className="bg-emerald-50 text-emerald-800 border-2 border-dashed border-emerald-300 p-5 rounded-2xl text-xs space-y-2 text-center animate-fade-in">
          <p className="font-bold text-sm">🎉 {isVi ? 'Đăng ký đề xuất hợp tác thành công!' : 'Partnership Submission Success!'}</p>
          <p>{isVi ? 'Hồ sơ đã được mã hóa gửi đến Bộ phận Quản trị VietCharm.' : 'Your request has been securely dispatched to VietCharm vetting desk.'}</p>
          <p className="font-mono text-stone-800 font-black">{isVi ? 'Mã số hồ sơ theo dõi:' : 'Application Tracking Code:'} {submittedCode}</p>
          <p className="text-stone-500 italic text-[10px]">{isVi ? 'Bạn có thể xem trạng thái xét duyệt trực tiếp tại Hồ sơ cá nhân của mình hoặc liên hệ Hotline.' : 'Monitor application status live in your Profile.'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-natural-border p-6 rounded-3xl space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-natural-border pb-2 uppercase flex items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <span>{isVi ? 'Đơn Đăng Ký Đối Tác' : 'Partnership Form'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Tên Đơn vị / Thương hiệu' : 'Brand/Company Name'}</label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Đò gỗ Sông Hoài Lan"
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-natural-accent"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Người đại diện liên hệ' : 'Contact Person'}</label>
              <input 
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Nguyễn Văn A"
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Lĩnh vực hợp tác' : 'Service Domain'}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PartnershipApplication['type'])}
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-2 py-2 outline-none font-bold"
              >
                <option value="hotel">{isVi ? 'Lưu trú / Khách sạn' : 'Hotel Stay'}</option>
                <option value="vehicle">{isVi ? 'Cho thuê xe máy, ô tô tự lái' : 'Vehicle Rentals & Cars'}</option>
                <option value="taxi">{isVi ? 'Vận chuyển / Taxi đưa đón' : 'Taxi & Transfer'}</option>
                <option value="experience">{isVi ? 'Vui chơi / Hoạt động / Tour' : 'Experiences & Tours'}</option>
                <option value="artisan">{isVi ? 'Làng nghề / Thủ công mỹ nghệ' : 'Artisan Workshop'}</option>
                <option value="guide">{isVi ? 'Hướng dẫn viên du lịch' : 'Tour Guide'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Số điện thoại liên hệ' : 'Phone'}</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0905000000"
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Địa chỉ Email chính thức' : 'Email'}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: partner@brand.com"
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mô tả ngắn gọn Đề xuất / Năng lực dịch vụ' : 'Proposal details'}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Chúng tôi cung cấp 15 chiếc xe máy Sirius mới cáu sọc đỏ đen, sẵn sàng phục vụ khách lữ hành tự lái với giá rẻ..."
              rows={4}
              className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-natural-accent hover:bg-natural-olive text-white font-bold py-3 rounded-xl uppercase tracking-wider transition shadow-md"
          >
            {isVi ? 'ĐỆ TRÌNH HỒ SƠ HỢP TÁC' : 'SUBMIT PROPOSAL'}
          </button>
        </form>

        {/* Benefits guide sidebar */}
        <div className="bg-natural-cream border border-natural-border p-6 rounded-3xl space-y-5 text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-natural-accent uppercase border-b border-natural-border pb-2">
              {isVi ? 'Đặc quyền đối tác VietCharm' : 'Merchant Alliance Benefits'}
            </h4>
            <div className="space-y-3 leading-relaxed">
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Quảng bá không biên giới:' : 'Global Visibility:'}</strong> {isVi ? 'Tiếp cận hàng chục ngàn lượt khách du lịch tìm lịch trình AI của VietCharm hàng tháng.' : 'Showcase your local catalog to tech-forward tourists.'}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Phí chiết khấu cực thấp:' : 'Low Commission:'}</strong> {isVi ? 'VietCharm duy trì mức phí sàn chỉ 5-8% hỗ trợ bà con và doanh nghiệp phát triển bền vững.' : 'We cap platform fees at only 5-8% to support regional communities.'}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Công cụ Quản trị thông minh:' : 'Sleek Dashboard:'}</strong> {isVi ? 'Hệ thống tự động đồng bộ đơn đặt chỗ, thông báo thẻ vé thời gian thực chuẩn xác.' : 'Get instant digital orders with direct verification screens.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200">
            <p className="text-natural-accent font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" /> {isVi ? 'Cam kết bảo mật:' : 'Data Privacy:'}
            </p>
            <p className="text-stone-500 mt-1 leading-snug">
              {isVi ? 'Mọi thông tin liên hệ và giấy phép được VietCharm bảo mật tối mật theo quy định lữ hành.' : 'Your submission remains strictly confidential.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
