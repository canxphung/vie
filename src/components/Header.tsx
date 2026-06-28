/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, ShoppingBag, Landmark, Sparkles, User, LogOut, Settings, Key, BookOpen, Car, Gift, HelpCircle, Clock, Hotel, ChevronDown, Compass } from 'lucide-react';
import { Language } from '../types';
import { dictionaries } from '../data';
import { UserAccount } from './VietCharmExtraFeatures';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  currentView: string;
  onChangeView: (view: any) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export default function Header({
  language,
  setLanguage,
  cartCount,
  onOpenCart,
  onNavigateHome,
  currentView,
  onChangeView,
  currentUser,
  onOpenAuthModal,
  onLogout,
}: HeaderProps) {
  const t = dictionaries[language];
  const isVi = language === 'vi';
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [showTransportMenu, setShowTransportMenu] = React.useState(false);

  return (
    <header className="w-full bg-[#FDFCF8] text-[#4A4A35] border-b border-[#E6E2D3]">
      {/* Mini top bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap justify-between items-center text-xs border-b border-[#E6E2D3] bg-[#F5F2ED] text-[#4A4A35]">
        <div className="flex gap-4 items-center font-medium">
          <button onClick={onNavigateHome} className="hover:text-[#8C7A5B] transition flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-[#8C7A5B]" />
            VietCharm Portal
          </button>
          <span className="text-[#E6E2D3]">|</span>
          <span className="text-stone-600">{t.promo}</span>
          <span className="text-[#E6E2D3]">|</span>
          <span className="text-stone-600">{t.partner}</span>
          <span className="text-[#E6E2D3]">|</span>
          <span className="text-stone-600">{t.support}</span>
        </div>

        <div className="flex items-center gap-4 mt-1 sm:mt-0 font-medium font-sans">
          {currentUser ? (
            <div className="flex items-center gap-3 text-stone-800">
              <button
                onClick={() => onChangeView('profile')}
                className="bg-[#FAF8F5] hover:bg-[#F5F2ED] px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#E6E2D3] text-[#8C7A5B] transition cursor-pointer"
                title={isVi ? 'Quản lý Hồ sơ' : 'Manage Profile'}
              >
                <img src={currentUser.avatar} alt="Avatar" className="w-4.5 h-4.5 rounded-full object-cover border border-[#8C7A5B]" />
                <span className="font-sans font-bold">{currentUser.fullName}</span>
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => onChangeView('admin')}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 transition uppercase animate-pulse shadow-sm cursor-pointer"
                  title={isVi ? 'Trang Quản trị' : 'Admin Panel'}
                >
                  <Settings className="w-3 h-3 text-red-600" />
                  <span>{isVi ? 'QUẢN TRỊ' : 'ADMIN'}</span>
                </button>
              )}
              <button 
                onClick={onLogout}
                className="text-[#8C7A5B] hover:text-red-700 font-bold flex items-center gap-0.5 transition cursor-pointer"
                title={isVi ? 'Đăng xuất' : 'Log out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenAuthModal}
                className="bg-white hover:bg-[#F5F2ED] text-[#8C7A5B] px-3.5 py-1 rounded-full text-[11px] font-bold transition shadow-xs border border-[#E6E2D3] cursor-pointer"
              >
                {t.login}
              </button>
              <button 
                onClick={onOpenAuthModal}
                className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-3.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer"
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation in the exact photo style */}
      <div className="bg-[#FDFCF8] border-b border-[#E6E2D3]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          {/* Logo brand */}
          <div onClick={onNavigateHome} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="p-2 rounded-lg bg-[#8C7A5B] text-white shadow-md group-hover:bg-[#5A5A40] transition">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-[#8C7A5B] flex items-center gap-1">
                VIET<span className="text-[#C4A484]">CHARM</span>
              </span>
              <p className="text-[9px] text-[#C4A484] tracking-[0.2em] uppercase font-bold">Heritage & Travel</p>
            </div>
          </div>

          {/* Navigation Links inside image style (STT 1-14) */}
          <nav className="flex flex-wrap gap-2 md:gap-4 text-xs sm:text-[13px] font-bold uppercase tracking-wider my-2 md:my-0 items-center">
            <button 
              onClick={() => onChangeView('spots')}
              className={`pb-1 px-1 transition relative cursor-pointer ${currentView === 'spots' || currentView === 'regions' || currentView === 'provinces' || currentView === 'province' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
            >
              {language === 'vi' ? 'Khám phá' : 'Explore'}
            </button>
            <button 
              onClick={() => onChangeView('hotels')}
              className={`pb-1 px-1 transition relative flex items-center gap-1 cursor-pointer ${currentView === 'hotels' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
            >
              <Hotel className="w-3.5 h-3.5 text-[#E3B04B]" />
              <span>{language === 'vi' ? 'Khách sạn' : 'Hotels'}</span>
            </button>
            <button 
              onClick={() => onChangeView('experiences')}
              className={`pb-1 px-1 transition relative flex items-center gap-1 cursor-pointer ${currentView === 'experiences' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
            >
              <Compass className="w-3.5 h-3.5 text-[#E3B04B]" />
              <span>{language === 'vi' ? 'Trải nghiệm' : 'Experiences'}</span>
            </button>
            {/* "Phương tiện di chuyển" dropdown grouping Rentals and Taxi */}
            <div 
              className="relative"
              onMouseEnter={() => setShowTransportMenu(true)}
              onMouseLeave={() => setShowTransportMenu(false)}
            >
              <button 
                onClick={() => setShowTransportMenu(!showTransportMenu)}
                className={`pb-1 px-1 transition relative flex items-center gap-1 cursor-pointer ${['rentals', 'taxi'].includes(currentView) ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
              >
                <Car className="w-3.5 h-3.5 text-[#E3B04B]" />
                <span>{language === 'vi' ? 'Phương tiện di chuyển' : 'Transportation'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTransportMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showTransportMenu && (
                <div className="absolute left-0 top-full pt-1 w-52 z-50">
                  <div className="bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => {
                        onChangeView('rentals');
                        setShowTransportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'rentals' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <Key className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>{language === 'vi' ? 'Thuê xe tự lái' : 'Self-drive Rentals'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        onChangeView('taxi');
                        setShowTransportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'taxi' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <Car className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>{language === 'vi' ? 'Đặt Taxi' : 'Taxi Booking'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* "More" dropdown grouping Tours, Handbook, Partnership, Nearby Places */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`pb-1 px-1 transition relative flex items-center gap-1 cursor-pointer ${['tours', 'handbook', 'partnership-register', 'nearby-places'].includes(currentView) ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
              >
                <span>{language === 'vi' ? 'Xem thêm' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showMoreMenu && (
                <div className="absolute left-0 top-full pt-1 w-48 z-50">
                  <div className="bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => {
                        onChangeView('nearby-places');
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'nearby-places' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <Compass className="w-3.5 h-3.5 text-[#E3B04B]" />
                      <span>{language === 'vi' ? 'Địa điểm lân cận' : 'Nearby Places'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        onChangeView('tours');
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'tours' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <Gift className="w-3.5 h-3.5 text-[#E3B04B]" />
                      <span>Combo Tour</span>
                    </button>
                    <button 
                      onClick={() => {
                        onChangeView('handbook');
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'handbook' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>{language === 'vi' ? 'Cẩm nang' : 'Handbook'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        onChangeView('partnership-register');
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition hover:bg-[#8C7A5B]/10 cursor-pointer ${currentView === 'partnership-register' ? 'text-[#8C7A5B]' : 'text-[#4A4A35]'}`}
                    >
                      <Landmark className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>{language === 'vi' ? 'Hợp tác' : 'Partnership'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => onChangeView('trip-room')}
              className={`pb-1 px-1.5 py-0.5 rounded-md transition relative text-emerald-800 bg-emerald-50 hover:bg-emerald-100 cursor-pointer ${currentView === 'trip-room' ? 'text-emerald-950 font-extrabold border-b-2 border-emerald-800' : 'font-extrabold'}`}
            >
              👥 {language === 'vi' ? 'Trip Room' : 'Trip Room'}
            </button>
            <button 
              onClick={() => onChangeView('blind-travel')}
              className={`pb-1 px-1.5 py-0.5 rounded-md transition relative text-amber-800 bg-amber-50 hover:bg-amber-100 cursor-pointer ${currentView === 'blind-travel' ? 'text-amber-950 font-extrabold border-b-2 border-amber-800' : 'font-extrabold'}`}
            >
              🔮 {language === 'vi' ? 'Hành trình ẩn số' : 'Blind Travel'}
            </button>
            <button 
              onClick={() => onChangeView('recently-viewed')}
              className={`pb-1 px-1 transition relative flex items-center gap-1 cursor-pointer ${currentView === 'recently-viewed' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B]' : 'text-[#4A4A35] hover:text-[#8C7A5B]'}`}
            >
              <Clock className="w-3.5 h-3.5 text-[#E3B04B]" />
              <span>{language === 'vi' ? 'Đã xem gần đây' : 'Recently Viewed'}</span>
            </button>
          </nav>

          {/* Shopping Card */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-[#F5F2ED] transition text-[#8C7A5B] border border-[#E6E2D3] cursor-pointer"
              title="Cart Bundle"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E3B04B] text-white border border-[#FDFCF8] text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-bounce shadow-md">
                   {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
