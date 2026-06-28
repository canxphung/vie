/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Car,
  ChevronDown,
  Clock,
  Compass,
  Gift,
  Globe,
  Handshake,
  Hotel,
  Key,
  Landmark,
  LogOut,
  MapPin,
  Phone,
  Route,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import type { Language, UserAccount } from '../types';
import { dictionaries } from '../data';
import { Container } from '@/components/ui';
import type { ViewId } from '@/constants/views';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  currentView: string;
  onChangeView: (view: ViewId | 'spots' | 'hotels' | 'rentals' | 'experiences') => void;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

type IconComponent = React.ComponentType<{ className?: string }>;

interface HeaderLinkProps {
  active?: boolean;
  icon?: IconComponent;
  children: React.ReactNode;
  onClick: () => void;
}

function HeaderLink({ active = false, icon: Icon, children, onClick }: HeaderLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center gap-2 px-3 text-sm font-black transition cursor-pointer ${
        active ? 'text-white' : 'text-white/88 hover:text-white'
      }`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-natural-gold" />}
      <span>{children}</span>
    </button>
  );
}

interface NavItemProps {
  active: boolean;
  icon?: IconComponent;
  children: React.ReactNode;
  onClick: () => void;
}

function NavItem({ active, icon: Icon, children, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-9 items-center justify-center gap-1.5 px-4 text-sm font-medium transition cursor-pointer ${
        active ? 'text-natural-accent' : 'text-natural-ink hover:text-natural-accent'
      }`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-natural-accent" />}
      <span>{children}</span>
      {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-natural-accent" />}
    </button>
  );
}

interface DropdownItemProps {
  active: boolean;
  icon: IconComponent;
  label: string;
  onClick: () => void;
}

function DropdownItem({ active, icon: Icon, label, onClick }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide transition hover:bg-natural-accent/10 cursor-pointer ${
        active ? 'text-natural-accent' : 'text-natural-text'
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-natural-gold" />
      <span>{label}</span>
    </button>
  );
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
  onOpenLogin,
  onOpenRegister,
  onLogout,
}: HeaderProps) {
  const t = dictionaries[language];
  const isVi = language === 'vi';
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  const isExploreActive = ['spots', 'regions', 'provinces', 'province'].includes(currentView);
  const isMoreActive = ['handbook', 'nearby-places'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d8c8a7] bg-natural-bg text-natural-text shadow-sm">
      <div className="bg-[#73551F] text-white">
        <Container className="flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-2 lg:flex-nowrap lg:py-0">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group flex shrink-0 items-center gap-2.5 cursor-pointer"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/30 text-natural-gold transition group-hover:bg-white/10">
              <Landmark className="h-6 w-6" />
            </span>
            <span className="text-left">
              <span className="block font-serif text-xl font-black leading-none tracking-wide text-white">
                VIET CHARM
              </span>
              <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.24em] text-natural-gold">
                Heritage & Travel
              </span>
            </span>
          </button>

          <nav className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
            <HeaderLink active={currentView === 'tours'} icon={Gift} onClick={() => onChangeView('tours')}>
              {isVi ? 'Khuyến mãi' : 'Promotions'}
            </HeaderLink>
            <HeaderLink
              active={currentView === 'partnership-register'}
              icon={Handshake}
              onClick={() => onChangeView('partnership-register')}
            >
              {isVi ? 'Hợp tác với chúng tôi' : 'Partner with us'}
            </HeaderLink>
            <a
              href="tel:19005040"
              className="inline-flex h-12 items-center justify-center gap-2 px-3 text-sm font-black text-white/88 transition hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-natural-gold" />
              <span>{isVi ? 'Hỗ trợ' : 'Support'}</span>
            </a>
            <HeaderLink active={currentView === 'recently-viewed'} icon={Clock} onClick={() => onChangeView('recently-viewed')}>
              {isVi ? 'Xem gần đây' : 'Recent'}
            </HeaderLink>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(isVi ? 'en' : 'vi')}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-black uppercase text-white/85 transition hover:bg-white/10 hover:text-white cursor-pointer"
              title={isVi ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              <Globe className="h-3.5 w-3.5" />
              {isVi ? 'EN' : 'VI'}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeView('profile')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-black text-[#73551F] transition hover:bg-natural-beige cursor-pointer"
                  title={isVi ? 'Quản lý hồ sơ' : 'Manage profile'}
                >
                  <img src={currentUser.avatar} alt="Avatar" className="h-5 w-5 rounded-full object-cover" />
                  <span className="hidden max-w-28 truncate sm:inline">{currentUser.fullName}</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => onChangeView('admin')}
                    className="inline-flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-[10px] font-black uppercase text-red-700 transition hover:bg-red-100 cursor-pointer"
                    title={isVi ? 'Trang quản trị' : 'Admin panel'}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isVi ? 'Quản trị' : 'Admin'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white cursor-pointer"
                  title={isVi ? 'Đăng xuất' : 'Log out'}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-stone-950 shadow-sm transition hover:bg-natural-beige cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-natural-gold px-5 text-sm font-black text-white shadow-sm transition hover:bg-natural-gold-dark cursor-pointer"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </Container>
      </div>

      <div className="border-t border-[#8A6A2D]/35 bg-[#FFF8E9]">
        <Container className="flex min-h-9 flex-wrap items-center justify-center gap-x-7 gap-y-1 py-1 lg:flex-nowrap">
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1">
            <NavItem active={isExploreActive} icon={Compass} onClick={() => onChangeView('spots')}>
              {isVi ? 'Khám phá' : 'Explore'}
            </NavItem>
            <NavItem active={currentView === 'hotels'} icon={Hotel} onClick={() => onChangeView('hotels')}>
              {isVi ? 'Khách sạn' : 'Hotels'}
            </NavItem>
            <NavItem active={currentView === 'rentals'} icon={Key} onClick={() => onChangeView('rentals')}>
              {isVi ? 'Thuê xe' : 'Rentals'}
            </NavItem>
            <NavItem active={currentView === 'experiences'} icon={Route} onClick={() => onChangeView('experiences')}>
              {isVi ? 'Hoạt động & Vui chơi' : 'Activities'}
            </NavItem>
            <NavItem active={currentView === 'trip-room'} icon={UsersRound} onClick={() => onChangeView('trip-room')}>
              Trip Room
            </NavItem>
            <NavItem active={currentView === 'blind-travel'} icon={Sparkles} onClick={() => onChangeView('blind-travel')}>
              {isVi ? 'Hành trình ẩn số' : 'Blind Travel'}
            </NavItem>

            <div
              className="relative"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button
                type="button"
                onClick={() => setShowMoreMenu((open) => !open)}
                className={`relative inline-flex h-9 items-center justify-center gap-1.5 px-4 text-sm font-medium transition cursor-pointer ${
                  isMoreActive ? 'text-natural-accent' : 'text-natural-ink hover:text-natural-accent'
                }`}
              >
                <span>{isVi ? 'Xem thêm' : 'More'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                {isMoreActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-natural-accent" />}
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full z-50 w-56 pt-2">
                  <div className="overflow-hidden rounded-xl border border-natural-border bg-natural-bg py-2 shadow-xl">
                    <DropdownItem
                      active={currentView === 'handbook'}
                      icon={BookOpen}
                      label={isVi ? 'Cẩm nang du lịch' : 'Travel handbook'}
                      onClick={() => {
                        onChangeView('handbook');
                        setShowMoreMenu(false);
                      }}
                    />
                    <DropdownItem
                      active={currentView === 'nearby-places'}
                      icon={MapPin}
                      label={isVi ? 'Địa điểm lân cận' : 'Nearby places'}
                      onClick={() => {
                        onChangeView('nearby-places');
                        setShowMoreMenu(false);
                      }}
                    />
                    <DropdownItem
                      active={currentView === 'taxi'}
                      icon={Car}
                      label={isVi ? 'Đặt taxi' : 'Taxi booking'}
                      onClick={() => {
                        onChangeView('taxi');
                        setShowMoreMenu(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </nav>

          <button
            type="button"
            onClick={onOpenCart}
            className={`relative inline-flex h-9 w-10 items-center justify-center transition hover:text-natural-accent cursor-pointer ${
              currentView === 'cart' ? 'text-natural-accent' : 'text-natural-ink'
            }`}
            title={isVi ? 'Giỏ hàng' : 'Cart'}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-natural-gold text-[9px] font-black text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </Container>
      </div>
    </header>
  );
}
