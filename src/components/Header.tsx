/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bike,
  BookOpen,
  Car,
  ChevronDown,
  Clock,
  Compass,
  Gift,
  Globe,
  Handshake,
  Hotel,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Route,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import type { Language, UserAccount } from '../types';
import { dictionaries } from '../data';
import { VietCharmLogo } from '@/components/brand/VietCharmLogo';
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
      className={`relative inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap px-4 text-sm font-medium transition cursor-pointer ${
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

function MobileDrawerButton({ active, icon: Icon, label, onClick }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm font-black transition ${
        active
          ? 'border-natural-accent bg-natural-accent text-white'
          : 'border-natural-border bg-white text-natural-ink hover:bg-natural-beige'
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-natural-gold' : 'text-natural-accent'}`} />
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
  const [showTransportMenu, setShowTransportMenu] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const moreMenuRef = React.useRef<HTMLDivElement>(null);
  const transportMenuRef = React.useRef<HTMLDivElement>(null);

  const isExploreActive = ['spots', 'regions', 'provinces', 'province'].includes(currentView);
  const isMoreActive = ['handbook', 'nearby-places'].includes(currentView);
  const cartButtonLabel = isVi ? 'Giỏ hàng' : 'Cart';

  React.useEffect(() => {
    if (!showMoreMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showMoreMenu]);

  React.useEffect(() => {
    if (!showTransportMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!transportMenuRef.current?.contains(event.target as Node)) {
        setShowTransportMenu(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showTransportMenu]);

  React.useEffect(() => {
    if (!showMobileMenu) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showMobileMenu]);

  const closeMenus = () => {
    setShowMoreMenu(false);
    setShowTransportMenu(false);
    setShowMobileMenu(false);
  };

  const navigateTo = (target: ViewId | 'spots' | 'hotels' | 'rentals' | 'experiences') => {
    onChangeView(target);
    closeMenus();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d8c8a7] bg-natural-bg text-natural-text shadow-sm">
      <div className="bg-[#73551F] text-white lg:hidden">
        <Container className="flex min-h-16 items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              closeMenus();
            }}
            className="group flex min-w-0 flex-1 items-center gap-2.5 cursor-pointer"
          >
            <VietCharmLogo size="sm" className="transition group-hover:opacity-90" />
          </button>

          <button
            type="button"
            onClick={() => setLanguage(isVi ? 'en' : 'vi')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-black uppercase text-white/90 transition hover:bg-white/10 hover:text-white"
            title={isVi ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            {isVi ? 'EN' : 'VI'}
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenCart();
              closeMenus();
            }}
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
            title={cartButtonLabel}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-natural-gold text-[9px] font-black text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowMobileMenu((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-expanded={showMobileMenu}
            aria-label={showMobileMenu ? (isVi ? 'Đóng menu' : 'Close menu') : (isVi ? 'Mở menu' : 'Open menu')}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>

        {showMobileMenu && (
          <div className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-natural-border bg-natural-bg px-4 py-4 text-natural-text shadow-2xl">
            <div className="mx-auto max-w-lg space-y-4">
              <div className="rounded-2xl border border-natural-border bg-natural-beige p-3">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.fullName} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-natural-ink">{currentUser.fullName}</p>
                      <p className="truncate text-xs font-semibold text-stone-500">{currentUser.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        closeMenus();
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-natural-accent transition hover:bg-natural-bg"
                      title={isVi ? 'Đăng xuất' : 'Log out'}
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenLogin();
                        closeMenus();
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-3 text-sm font-black text-natural-ink transition hover:bg-natural-bg"
                    >
                      {t.login}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenRegister();
                        closeMenus();
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-natural-gold px-3 text-sm font-black text-white transition hover:bg-natural-gold-dark"
                    >
                      {t.register}
                    </button>
                  </div>
                )}
              </div>

              <nav className="grid gap-2">
                <MobileDrawerButton active={currentView === 'tours'} icon={Gift} label={isVi ? 'Khuyến mãi' : 'Promotions'} onClick={() => navigateTo('tours')} />
                <MobileDrawerButton active={currentView === 'partnership-register'} icon={Handshake} label={isVi ? 'Hợp tác với chúng tôi' : 'Partner with us'} onClick={() => navigateTo('partnership-register')} />
                <MobileDrawerButton active={currentView === 'recently-viewed'} icon={Clock} label={isVi ? 'Xem gần đây' : 'Recent'} onClick={() => navigateTo('recently-viewed')} />
                <MobileDrawerButton active={isExploreActive} icon={Compass} label={isVi ? 'Khám phá' : 'Explore'} onClick={() => navigateTo('spots')} />
                <MobileDrawerButton active={currentView === 'hotels'} icon={Hotel} label={isVi ? 'Khách sạn' : 'Hotels'} onClick={() => navigateTo('hotels')} />
                <MobileDrawerButton active={currentView === 'rentals'} icon={Car} label={isVi ? 'Phương tiện di chuyển' : 'Transport'} onClick={() => navigateTo('rentals')} />
                <MobileDrawerButton active={currentView === 'experiences'} icon={Route} label={isVi ? 'Hoạt động & Vui chơi' : 'Activities'} onClick={() => navigateTo('experiences')} />
                <MobileDrawerButton active={currentView === 'trip-room'} icon={UsersRound} label="Trip Room" onClick={() => navigateTo('trip-room')} />
                <MobileDrawerButton active={currentView === 'blind-travel'} icon={Sparkles} label={isVi ? 'Hành trình ẩn số' : 'Blind Travel'} onClick={() => navigateTo('blind-travel')} />
                <MobileDrawerButton active={currentView === 'handbook'} icon={BookOpen} label={isVi ? 'Cẩm nang du lịch' : 'Travel handbook'} onClick={() => navigateTo('handbook')} />
                <MobileDrawerButton active={currentView === 'nearby-places'} icon={MapPin} label={isVi ? 'Địa điểm lân cận' : 'Nearby places'} onClick={() => navigateTo('nearby-places')} />
                {currentUser && (
                  <MobileDrawerButton active={currentView === 'profile'} icon={UserRound} label={isVi ? 'Hồ sơ cá nhân' : 'Profile'} onClick={() => navigateTo('profile')} />
                )}
                {currentUser?.role === 'admin' && (
                  <MobileDrawerButton active={currentView === 'admin'} icon={Settings} label={isVi ? 'Quản trị' : 'Admin'} onClick={() => navigateTo('admin')} />
                )}
                <a
                  href="tel:19005040"
                  onClick={closeMenus}
                  className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-natural-border bg-white px-3 text-sm font-black text-natural-ink transition hover:bg-natural-beige"
                >
                  <Phone className="h-4 w-4 shrink-0 text-natural-accent" />
                  <span>{isVi ? 'Hỗ trợ' : 'Support'}</span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>

      <div className="hidden bg-[#73551F] text-white lg:block">
        <Container className="flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-2 lg:flex-nowrap lg:py-0">
          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              closeMenus();
            }}
            className="group flex shrink-0 items-center gap-2.5 cursor-pointer"
          >
            <VietCharmLogo size="sm" className="transition group-hover:opacity-90" />
          </button>

          <nav className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
            <HeaderLink active={currentView === 'tours'} icon={Gift} onClick={() => navigateTo('tours')}>
              {isVi ? 'Khuyến mãi' : 'Promotions'}
            </HeaderLink>
            <HeaderLink
              active={currentView === 'partnership-register'}
              icon={Handshake}
              onClick={() => navigateTo('partnership-register')}
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
            <HeaderLink active={currentView === 'recently-viewed'} icon={Clock} onClick={() => navigateTo('recently-viewed')}>
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
                  onClick={() => navigateTo('profile')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-black text-[#73551F] transition hover:bg-natural-beige cursor-pointer"
                  title={isVi ? 'Quản lý hồ sơ' : 'Manage profile'}
                >
                  <img src={currentUser.avatar} alt="Avatar" className="h-5 w-5 rounded-full object-cover" />
                  <span className="hidden max-w-28 truncate sm:inline">{currentUser.fullName}</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => navigateTo('admin')}
                    className="inline-flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-[10px] font-black uppercase text-red-700 transition hover:bg-red-100 cursor-pointer"
                    title={isVi ? 'Trang quản trị' : 'Admin panel'}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isVi ? 'Quản trị' : 'Admin'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    closeMenus();
                  }}
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
                  onClick={() => {
                    onOpenLogin();
                    closeMenus();
                  }}
                  className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-stone-950 shadow-sm transition hover:bg-natural-beige cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenRegister();
                    closeMenus();
                  }}
                  className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-natural-gold px-5 text-sm font-black text-white shadow-sm transition hover:bg-natural-gold-dark cursor-pointer"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </Container>
      </div>

      <div className="hidden border-t border-[#8A6A2D]/35 bg-[#FFF8E9] lg:block">
        <Container className="flex min-h-9 flex-nowrap items-center justify-center gap-x-3 py-1">
          <nav className="flex flex-nowrap items-center justify-center gap-x-3">
            <NavItem active={isExploreActive} icon={Compass} onClick={() => navigateTo('spots')}>
              {isVi ? 'Khám phá' : 'Explore'}
            </NavItem>
            <NavItem active={currentView === 'hotels'} icon={Hotel} onClick={() => navigateTo('hotels')}>
              {isVi ? 'Khách sạn' : 'Hotels'}
            </NavItem>

            <div ref={transportMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowTransportMenu((open) => !open)}
                aria-expanded={showTransportMenu}
                aria-haspopup="menu"
                className={`relative inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap px-4 text-sm font-medium transition cursor-pointer ${
                  currentView === 'rentals' ? 'text-natural-accent' : 'text-natural-ink hover:text-natural-accent'
                }`}
              >
                <Car className="h-4 w-4 shrink-0 text-natural-accent" />
                <span>{isVi ? 'Phương tiện di chuyển' : 'Transport'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showTransportMenu ? 'rotate-180' : ''}`} />
                {currentView === 'rentals' && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-natural-accent" />}
              </button>

              {showTransportMenu && (
                <div className="absolute left-0 top-full z-50 w-52 pt-2">
                  <div className="overflow-hidden rounded-xl border border-natural-border bg-natural-bg py-2 shadow-xl">
                    <DropdownItem
                      active={false}
                      icon={Bike}
                      label={isVi ? 'Thuê xe' : 'Rent a vehicle'}
                      onClick={() => navigateTo('rentals')}
                    />
                    <DropdownItem
                      active={false}
                      icon={Car}
                      label={isVi ? 'Đặt taxi' : 'Book a taxi'}
                      onClick={() => navigateTo('taxi')}
                    />
                  </div>
                </div>
              )}
            </div>

            <NavItem active={currentView === 'experiences'} icon={Route} onClick={() => navigateTo('experiences')}>
              {isVi ? 'Hoạt động & Vui chơi' : 'Activities'}
            </NavItem>
            <NavItem active={currentView === 'trip-room'} icon={UsersRound} onClick={() => navigateTo('trip-room')}>
              Trip Room
            </NavItem>
            <NavItem active={currentView === 'blind-travel'} icon={Sparkles} onClick={() => navigateTo('blind-travel')}>
              {isVi ? 'Hành trình ẩn số' : 'Blind Travel'}
            </NavItem>

            <div
              ref={moreMenuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setShowMoreMenu((open) => !open)}
                aria-expanded={showMoreMenu}
                aria-haspopup="menu"
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
                        navigateTo('handbook');
                      }}
                    />
                    <DropdownItem
                      active={currentView === 'nearby-places'}
                      icon={MapPin}
                      label={isVi ? 'Địa điểm lân cận' : 'Nearby places'}
                      onClick={() => {
                        navigateTo('nearby-places');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => {
              onOpenCart();
              closeMenus();
            }}
            className={`relative inline-flex h-9 w-10 items-center justify-center transition hover:text-natural-accent cursor-pointer ${
              currentView === 'cart' ? 'text-natural-accent' : 'text-natural-ink'
            }`}
            title={cartButtonLabel}
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
