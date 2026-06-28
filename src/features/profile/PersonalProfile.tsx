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

// 2. COMPONENT: PERSONAL PROFILE MANAGEMENT
// ==========================================
interface PersonalProfileProps {
  language: Language;
  user: UserAccount;
  onUpdateProfile: (updated: UserAccount) => void;
  bookings: SystemBooking[];
  vouchers: PromoVoucher[];
  onNavigateHome: () => void;
  partnershipRequests: PartnershipApplication[];
  favorites: any[];
  recentlyViewed: any[];
  onToggleFavorite: (item: any) => void;
  onViewItem: (item: any) => void;
}

export function PersonalProfile({ 
  language, 
  user, 
  onUpdateProfile, 
  bookings, 
  vouchers, 
  onNavigateHome, 
  partnershipRequests,
  favorites = [],
  recentlyViewed = [],
  onToggleFavorite,
  onViewItem
}: PersonalProfileProps) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<'bookings' | 'favorites' | 'history' | 'partnerships'>('bookings');
  const [fullName, setFullName] = React.useState(user.fullName);
  const [email, setEmail] = React.useState(user.email);
  const [phone, setPhone] = React.useState(user.phone);
  const [bio, setBio] = React.useState(user.bio);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const [isEditing, setIsEditing] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Filter system bookings belonging to this user
  const userBookings = bookings.filter(b => b.userEmail.toLowerCase() === user.email.toLowerCase());
  const userPartnerships = partnershipRequests.filter(p => p.email.toLowerCase() === user.email.toLowerCase());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      fullName,
      email,
      phone,
      bio,
      avatar
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 9999);
    setAvatar(`https://picsum.photos/id/${randomId % 1000}/150/150`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-natural-text">
      {/* Profile Header Block */}
      <div className="bg-natural-beige border border-natural-border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img 
              src={avatar} 
              alt={isEditing ? fullName : user.fullName} 
              className="w-24 h-24 rounded-full border-4 border-amber-200 object-cover shadow-lg"
            />
            {isEditing && (
              <button 
                onClick={handleRandomAvatar}
                className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-200"
              >
                Đổi ảnh (Random)
              </button>
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="bg-natural-accent text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full inline-block">
              {user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'PREMIUM MEMBER'}
            </span>
            <h2 className="text-2xl font-serif font-black text-stone-900">
              {isEditing ? fullName : user.fullName}
            </h2>
            <p className="text-xs text-natural-accent font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" /> {isEditing ? email : user.email}
            </p>
            <p className="text-xs text-stone-500 italic mt-1 max-w-md">
              "{isEditing ? bio : (user.bio || (isVi ? 'Hội viên cao cấp của VietCharm.' : 'Premium member of VietCharm.'))}"
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white hover:bg-natural-cream text-natural-accent border border-natural-border px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition shadow-xs tracking-wider cursor-pointer"
          >
            {isEditing ? (isVi ? 'Hủy bỏ' : 'Cancel') : (isVi ? 'Chỉnh sửa hồ sơ' : 'Edit Profile')}
          </button>
          <button 
            onClick={onNavigateHome}
            className="bg-natural-accent hover:bg-natural-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition shadow-md tracking-wider cursor-pointer"
          >
            {isVi ? 'Về Trang chủ' : 'To Home'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-center">
          ✓ {isVi ? 'Cập nhật thông tin cá nhân thành công!' : 'Profile updated successfully!'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Info / Edit Form */}
        <div className="lg:col-span-1 bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-stone-800 border-b border-natural-border pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>{isVi ? 'Thông tin cá nhân' : 'Personal Details'}</span>
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Họ và tên' : 'Full Name'}</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs border border-natural-border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-natural-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Địa chỉ Email' : 'Email'}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-natural-border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-natural-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Số điện thoại' : 'Phone'}</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-natural-border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-natural-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Giới thiệu bản thân' : 'Biography'}</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-natural-border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-natural-accent"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-text font-black py-2.5 rounded-xl text-xs uppercase transition tracking-wider cursor-pointer"
              >
                {isVi ? 'Lưu thay đổi' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Họ và tên' : 'Full Name'}
                </span>
                <span className="font-serif font-black text-stone-800 text-sm">{user.fullName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Địa chỉ Email' : 'Email'}
                </span>
                <span className="font-semibold text-natural-accent">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Tên đăng nhập' : 'Username'}
                </span>
                <span className="font-mono font-bold text-stone-800">{user.username}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Số điện thoại' : 'Phone'}
                </span>
                <span className="font-semibold text-stone-800">{user.phone || (isVi ? 'Chưa cung cấp' : 'Not provided')}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Ngày tham gia' : 'Date Joined'}
                </span>
                <span className="text-stone-800 font-medium">{user.createdAt}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {isVi ? 'Nhóm đặc quyền' : 'Privilege Level'}
                </span>
                <span className="text-emerald-700 font-black">
                  {user.role === 'admin' ? (isVi ? 'Quản trị hệ thống' : 'System SuperAdmin') : (isVi ? 'Thành viên VIP Gold' : 'VIP Gold Member')}
                </span>
              </div>

              {/* Biography display */}
              <div className="pt-3">
                <span className="text-stone-500 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-natural-accent" />
                  {isVi ? 'Giới thiệu bản thân' : 'Biography'}
                </span>
                <p className="text-natural-text bg-natural-cream border border-natural-border p-3 rounded-xl italic leading-relaxed text-stone-600">
                  {user.bio || (isVi ? 'Hội viên chưa thiết lập lời giới thiệu.' : 'No biography provided.')}
                </p>
              </div>

              {/* Voucher Wallet display inside profile */}
              <div className="pt-6 border-t border-natural-border mt-6 space-y-3">
                <h4 className="font-serif font-black text-xs text-natural-accent uppercase flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-natural-gold" />
                  <span>{isVi ? 'Ví Voucher ưu đãi của tôi' : 'My Coupon Wallet'}</span>
                </h4>
                <div className="space-y-3">
                  {vouchers.map(v => (
                    <div key={v.code} className="relative bg-natural-cream border border-natural-border rounded-2xl p-4 flex justify-between items-center shadow-xs overflow-hidden group hover:border-natural-accent transition-all duration-300">
                      {/* Ticket half circles decoration */}
                      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white border-r border-natural-border rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-l border-natural-border rounded-full -translate-y-1/2"></div>
                      
                      <div className="pl-3 pr-2 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-natural-accent tracking-wider select-all cursor-pointer bg-stone-100 px-2 py-0.5 rounded-md hover:bg-natural-accent/10 transition-colors">
                            {v.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 block leading-relaxed">{v.description}</span>
                      </div>
                      
                      <div className="border-l border-dashed border-natural-border pl-4 py-1 flex flex-col items-center justify-center shrink-0 min-w-[70px]">
                        <span className="text-[9px] text-stone-400 font-bold uppercase block tracking-wider mb-0.5">{isVi ? 'GIẢM' : 'OFF'}</span>
                        <span className="text-amber-600 font-black text-xs block">
                          {v.discountType === 'percentage' ? `${v.value}%` : `${v.value >= 1000 ? `${v.value / 1000}k` : v.value}đ`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking History, Favorites, Recently Viewed & Partnerships Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-natural-beige border border-natural-border rounded-2xl p-1.5 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-natural-accent text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{isVi ? 'Lịch sử đặt vé' : 'Bookings'}</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{isVi ? 'Yêu thích' : 'Favorites'}</span>
              {favorites.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'favorites' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-600'}`}>
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-natural-accent text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isVi ? 'Đã xem' : 'Recent'}</span>
              {recentlyViewed.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'history' ? 'bg-white text-stone-700' : 'bg-stone-200 text-stone-700'}`}>
                  {recentlyViewed.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('partnerships')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'partnerships'
                  ? 'bg-natural-accent text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{isVi ? 'Hợp tác' : 'Partnerships'}</span>
            </button>
          </div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-natural-border pb-3 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-natural-accent" />
                  <span>{isVi ? 'Lịch sử đặt vé & khách sạn' : 'Booking & Ticket History'}</span>
                </h3>

                {userBookings.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <FileText className="w-10 h-10 mx-auto text-stone-300" />
                    <p>{isVi ? 'Bạn chưa có đơn đặt chỗ nào trong hệ thống.' : 'No active bookings registered yet.'}</p>
                    <button 
                      onClick={onNavigateHome}
                      className="bg-natural-cream text-natural-accent px-4 py-2 border border-natural-border rounded-xl hover:bg-natural-beige transition text-[11px] font-bold uppercase"
                    >
                      {isVi ? 'Khám phá và đặt ngay' : 'Explore Attractions Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div key={b.id} className="border border-stone-200 rounded-2xl p-4 space-y-3 hover:shadow-md transition">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="font-mono text-[10px] text-stone-500 font-bold">MÃ ĐƠN: {b.id}</span>
                            <h4 className="text-xs font-bold text-stone-800 mt-0.5">{b.date}</h4>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status === 'confirmed' ? 'Đã thanh toán (Thẻ vé hợp lệ)' : b.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                          </span>
                        </div>

                        <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs">
                          {b.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-stone-600">
                              <span>{it.name} <strong className="text-stone-800">x{it.quantity}</strong></span>
                              <span>{(it.price * it.quantity).toLocaleString()}đ</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                          <span className="text-stone-500">{isVi ? 'Giảm voucher:' : 'Discount:'} -{b.discountApplied.toLocaleString()}đ</span>
                          <span className="font-bold text-stone-900">{isVi ? 'Thành tiền:' : 'Paid Balance:'} <strong className="text-natural-accent font-black text-sm">{b.finalTotal.toLocaleString()}đ</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                key="favorites-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-natural-border pb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>{isVi ? 'Mục dịch vụ yêu thích của tôi' : 'My Favorite Services'}</span>
                </h3>

                {favorites.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <Heart className="w-10 h-10 mx-auto text-stone-200 animate-pulse" />
                    <p>{isVi ? 'Danh sách yêu thích trống.' : 'No favorites added yet.'}</p>
                    <p className="text-[10px] text-stone-400 max-w-sm mx-auto">{isVi ? 'Hãy bấm hình trái tim tại các khách sạn, trải nghiệm hay thuê xe để lưu lại.' : 'Tap heart icons on hotels, tours, or activities to save them.'}</p>
                    <button 
                      onClick={onNavigateHome}
                      className="bg-natural-cream text-natural-accent px-4 py-2 border border-natural-border rounded-xl hover:bg-natural-beige transition text-[11px] font-bold uppercase mt-2"
                    >
                      {isVi ? 'Khám phá ngay' : 'Explore Now'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <div 
                        key={fav.id}
                        className="bg-natural-cream border border-natural-border rounded-2xl overflow-hidden shadow-xs hover:border-natural-accent transition flex flex-col justify-between"
                      >
                        <div className="relative h-32 overflow-hidden shrink-0">
                          <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite?.(fav);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-rose-600 hover:scale-105 transition"
                            title={isVi ? 'Xóa khỏi yêu thích' : 'Remove from favorites'}
                          >
                            <Heart className="w-4 h-4 fill-current text-rose-600" />
                          </button>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 inline-block mb-1">
                              {fav.type === 'hotel' ? (isVi ? 'Khách sạn' : 'Hotel') : fav.type === 'vehicle' ? (isVi ? 'Thuê xe' : 'Vehicle') : (isVi ? 'Trải nghiệm' : 'Activity')}
                            </span>
                            <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{fav.name}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{fav.description || ''}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                            <span className="font-mono text-xs font-black text-natural-accent">
                              {fav.price.toLocaleString('vi-VN')}đ{fav.type === 'hotel' ? (isVi ? '/đêm' : '/night') : ''}
                            </span>
                            <button
                              onClick={() => onViewItem?.(fav)}
                              className="bg-natural-accent hover:bg-natural-olive text-white text-[10px] px-3 py-1 rounded-lg font-bold"
                            >
                              {isVi ? 'Xem' : 'View'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-natural-border pb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-natural-accent" />
                  <span>{isVi ? 'Dịch vụ đã xem gần đây' : 'Recently Viewed'}</span>
                </h3>

                {recentlyViewed.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <Calendar className="w-10 h-10 mx-auto text-stone-200" />
                    <p>{isVi ? 'Bạn chưa xem dịch vụ nào gần đây.' : 'No recently viewed items yet.'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentlyViewed.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewItem?.(item)}
                        className="bg-natural-cream hover:bg-natural-beige border border-natural-border rounded-xl p-3 flex gap-3 cursor-pointer transition"
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{item.description || ''}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-mono text-[11px] font-black text-natural-accent">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[9px] text-stone-400 italic">
                              {isVi ? 'Bấm để xem' : 'Click to view'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'partnerships' && (
              <motion.div
                key="partnerships-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-natural-border pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span>{isVi ? 'Yêu cầu hợp tác lữ hành' : 'Partnership Applications Status'}</span>
                </h3>

                {userPartnerships.length === 0 ? (
                  <p className="text-center py-4 text-xs text-stone-400">
                    {isVi ? 'Bạn chưa đăng ký liên kết kinh doanh dịch vụ nào.' : 'No brand partnership requests on file.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userPartnerships.map((p) => (
                      <div key={p.id} className="bg-stone-50 border border-stone-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-stone-400 font-bold">{p.id}</span>
                            <strong className="text-stone-800 text-sm">{p.brandName}</strong>
                          </div>
                          <p className="text-stone-500">Người liên hệ: {p.contactName} - Loại hình: <span className="uppercase font-semibold text-natural-accent">{p.type}</span></p>
                          <span className="text-[10px] text-stone-400 block">Đăng ngày: {p.date}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {p.status === 'approved' ? '✓ ĐÃ PHÊ DUYỆT' : p.status === 'pending' ? '● CHỜ DUYỆT' : '✕ TỪ CHỐI'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


// ==========================================
