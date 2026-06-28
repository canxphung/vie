/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Header from './components/Header';
import RegionSelector from './components/RegionSelector';
import ProvinceDashboard from './components/ProvinceDashboard';
import BookingDetails from './components/BookingDetails';
import PaymentModal from './components/PaymentModal';
import TripRoom from './components/TripRoom';
import BlindTravel from './components/BlindTravel';
import HelpPromoCenter from './components/HelpPromoCenter';
import ServiceDetails from './components/ServiceDetails';

// Feature components (still hosted in VietCharmExtraFeatures until split into features/)
import {
  UserAuthModal, PersonalProfile, TaxiBooking, TourCombos, TravelHandbook, PartnershipForm, AdminDashboard
} from './components/VietCharmExtraFeatures';
import NearbyPlaces from './components/NearbyPlaces';
import AllServicesView from './components/AllServicesView';
import Footer from '@/components/layout/Footer';

import { attractionsByProvince } from './data';
import { useI18n, useAuth, useCatalog, useCart, useUI } from '@/hooks';
import { Star, ShieldAlert, ArrowRight, Sparkles, MapPin, Calendar, HelpCircle, Navigation2, Users, Compass, BookOpen, Car, Gift, Settings, Sparkle, Clock, ChevronDown, Heart, Facebook, Instagram, Youtube, Phone, Mail, ShieldCheck, Headphones, Award, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { language, setLanguage, t, isVi } = useI18n();
  const {
    view, setView, activeSubView, allServicesTab, setAllServicesTab,
    selectedProvinceId, setSelectedProvinceId, selectProvince,
    selectedItem, viewItem, clearSelectedItem,
    recentlyViewed, clearRecentlyViewed, favorites, toggleFavorite,
    scrollToSection, changeHeaderView, navigateHome,
  } = useUI();
  const {
    currentUser, users, isAuthModalOpen, openAuthModal, closeAuthModal,
    login, register, logout, updateProfile, setUserRole,
  } = useAuth();
  const {
    applications, vouchers, bookings,
    addApplication, setApplicationStatus, setBookingStatus, addVoucher, deleteVoucher,
  } = useCatalog();
  const {
    items: cartItems, cartCount, isPaymentOpen, openPayment, closePayment,
    addItem: handleAddToCart, addCombo: handleAddAIComboToCart,
    removeItem: handleRemoveFromCart, clearCart: handleClearCart,
  } = useCart();

  // Aliases so the existing JSX keeps working while state now lives in contexts.
  const handleViewItem = viewItem;
  const handleToggleFavorite = toggleFavorite;
  const handleScrollToSection = scrollToSection;
  const selectedAttractions = attractionsByProvince[selectedProvinceId] || [];
  const showPaymentModal = isPaymentOpen;
  const setShowPaymentModal = (open: boolean) => (open ? openPayment() : closePayment());
  const showAuthModal = isAuthModalOpen;
  const setShowAuthModal = (open: boolean) => (open ? openAuthModal() : closeAuthModal());

  // Local-only UI state (search widget + newsletter on the province detail view).
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [subscribedMsg, setSubscribedMsg] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [guestsCount, setGuestsCount] = React.useState(1);
  const [roomsCount, setRoomsCount] = React.useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = React.useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribedMsg(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribedMsg(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text transition-colors duration-300 font-sans antialiased selection:bg-natural-gold selection:text-white">
      
      {/* Header with standard menu options inside Vietnamese image (STT 1-14) */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        cartCount={cartCount}
        onOpenCart={() => setShowPaymentModal(true)}
        onNavigateHome={() => setView('regions')}
        currentView={view === 'province' ? activeSubView : view}
        onChangeView={changeHeaderView}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={() => {
          logout();
          navigateHome();
        }}
      />

      <AnimatePresence mode="wait">
        
        {/* VIEW 0: SERVICE DETAILS PREVIEW SCREEN (STT 7) */}
        {selectedItem && (
          <motion.div
            key="service-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceDetails 
              language={language}
              item={selectedItem as any}
              onBack={() => clearSelectedItem()}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={() => {
                setShowPaymentModal(true);
              }}
              isItemInCart={(id) => cartItems.some(x => x.id === id)}
            />
          </motion.div>
        )}
        
        {/* VIEW 1: REGION SELECTOR (BAC - TRUNG - NAM) */}
        {!selectedItem && view === 'regions' && (
          <motion.div
            key="regions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RegionSelector 
              language={language}
              onSelectCentral={() => setView('provinces')}
              onSelectTripRoom={() => setView('trip-room')}
              onSelectBlindTravel={() => setView('blind-travel')}
            />
          </motion.div>
        )}

        {/* VIEW 2: PROVINCE DASHBOARD (CLICKABLE PROVINCES GRIDS DISPLAY) */}
        {!selectedItem && view === 'provinces' && (
          <motion.div
            key="provinces"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ProvinceDashboard 
              language={language}
              onSelectProvince={(provId) => selectProvince(provId)}
              onBackToHome={() => setView('regions')}
            />
          </motion.div>
        )}

        {/* VIEW 3: PROVINCE DETAIL (THE SPECIAL HOI AN DESIGN IMAGE SPECIFIED SCREEN) */}
        {!selectedItem && view === 'province' && (
          <motion.div
            key="province-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-0"
          >
            {/* Dynamic Hero section of Hoi An/Central provinces match detail photo */}
            <div className="relative w-full h-[320px] sm:h-[480px] md:h-[560px] overflow-hidden flex items-center shadow-inner">
              <div className="absolute inset-0 bg-black/45 z-10" />
              <img 
                src={
                  selectedProvinceId === 'quang-nam' 
                    ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80'
                    : selectedProvinceId === 'da-nang'
                    ? 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=80'
                    : selectedProvinceId === 'thua-thien-hue'
                    ? 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1600&q=80'
                    : selectedProvinceId === 'binh-dinh'
                    ? 'https://images.unsplash.com/photo-1621539250328-3e440939bc5d?auto=format&fit=crop&w=1600&q=80'
                    : 'https://images.unsplash.com/photo-1584013321612-e8c107f27f1b?auto=format&fit=crop&w=1600&q=80'
                }
                alt="Central Province background"
                className="absolute inset-0 w-full h-full object-cover select-none"
              />

              {/* Calligraphy elements exactly matched to image */}
              <div className="max-w-7xl mx-auto px-4 relative z-20 text-white w-full space-y-4">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-1.5 md:space-y-3"
                >
                  <p className="font-serif italic text-lg md:text-3xl text-natural-gold font-medium">Khám phá vẻ đẹp</p>
                  <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-widest uppercase font-sans drop-shadow-lg text-white">
                    {
                      selectedProvinceId === 'quang-nam' ? 'HỘI AN' : 
                      selectedProvinceId === 'da-nang' ? 'ĐÀ NẴNG' : 
                      selectedProvinceId === 'thua-thien-hue' ? 'CỐ ĐÔ HUẾ' : 
                      selectedProvinceId === 'binh-dinh' ? 'QUY NHƠN' : 'NHA TRANG'
                    }
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg max-w-xl text-stone-200 font-medium leading-relaxed drop-shadow-md">
                    {
                      selectedProvinceId === 'quang-nam' ? 'Nơi thời gian chậm lại để bạn cảm nhận những điều bình yên và mộc mạc nhất' :
                      selectedProvinceId === 'da-nang' ? 'Nơi sóng vỗ bờ cát Mỹ Khê hòa quyện cùng cầu vàng đỉnh non sương khói' :
                      selectedProvinceId === 'thua-thien-hue' ? 'Cố đô cổ kính ngàn năm văn hiến thầm lặng soi bóng bên dòng Hương Giang' :
                      selectedProvinceId === 'binh-dinh' ? 'Miền đất võ trời văn với những tháp Chăm trầm mặc và làn nước Kỳ Co xanh trong' :
                      'Thiên đường vịnh biển rực rỡ cát trắng nắng vàng, đảo ngọc xanh biếc quyến rũ lòng người'
                    }
                  </p>
                </motion.div>
 
                {/* Golden explore button exactly matched from image */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleScrollToSection('itinerary-map-section')}
                  className="bg-natural-accent hover:bg-natural-olive text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-serif font-bold transition shadow-lg tracking-wider hover:scale-105 active:scale-95 duration-200"
                >
                  {t.exploreNow} →
                </motion.button>
              </div>
            </div>

            {/* Floating Booking Search Bar Form exactly matched beneath hero */}
            <div className="max-w-7xl mx-auto px-4 -translate-y-10 sm:-translate-y-14 relative z-30">
              <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl border border-amber-200 flex flex-col md:flex-row gap-4 items-stretch justify-between">
                
                {/* Search input query */}
                <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:pr-4">
                  <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{t.heroSearchTitle}</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full text-xs sm:text-sm font-bold bg-transparent outline-none text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Calendar check-in */}
                <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:px-4">
                  <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{t.checkIn}</span>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-stone-700">22 / 06 / 2026</span>
                  </div>
                </div>

                {/* Calendar check-out */}
                <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:px-4">
                  <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{t.checkOut}</span>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-stone-700">26 / 06 / 2026</span>
                  </div>
                </div>

                {/* Guests counter */}
                <div className="flex-1 space-y-1 border-b md:border-b-0 pb-3 md:pb-0 md:px-4 relative">
                  <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{t.guestsNum}</span>
                  <button 
                    type="button"
                    onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                    className="flex items-center justify-between w-full text-left bg-transparent hover:bg-stone-50/50 p-1 -m-1 rounded-lg transition duration-150 group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-stone-700 block">
                      {isVi 
                        ? `${guestsCount} Khách, ${roomsCount} Phòng` 
                        : `${guestsCount} ${guestsCount > 1 ? 'Guests' : 'Guest'}, ${roomsCount} ${roomsCount > 1 ? 'Rooms' : 'Room'}`}
                    </span>
                    <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition" />
                  </button>

                  {showGuestsDropdown && (
                    <>
                      {/* Invisible backdrop to dismiss dropdown */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowGuestsDropdown(false)} />
                      
                      {/* Interactive Dropdown Box */}
                      <div className="absolute left-0 md:right-0 top-full mt-2 w-64 bg-white border border-natural-border rounded-2xl shadow-xl p-4 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Guests line selection */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-stone-800 block">
                              {isVi ? 'Số khách' : 'Guests'}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {isVi ? 'Người lớn & trẻ em' : 'Adults & children'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              disabled={guestsCount <= 1}
                              onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition text-sm cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-stone-800">{guestsCount}</span>
                            <button
                              type="button"
                              disabled={guestsCount >= 20}
                              onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))}
                              className="w-8 h-8 rounded-full border border-natural-accent flex items-center justify-center text-natural-accent font-bold hover:bg-amber-50/50 transition text-sm cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Rooms line selection */}
                        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-stone-800 block">
                              {isVi ? 'Số phòng' : 'Rooms'}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {isVi ? 'Số phòng ngủ cần đặt' : 'Rooms needed'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              disabled={roomsCount <= 1}
                              onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition text-sm cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-stone-800">{roomsCount}</span>
                            <button
                              type="button"
                              disabled={roomsCount >= 10}
                              onClick={() => setRoomsCount(Math.min(10, roomsCount + 1))}
                              className="w-8 h-8 rounded-full border border-natural-accent flex items-center justify-center text-natural-accent font-bold hover:bg-amber-50/50 transition text-sm cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Confirmation and apply button */}
                        <button
                          type="button"
                          onClick={() => setShowGuestsDropdown(false)}
                          className="w-full bg-natural-accent hover:bg-natural-olive text-white py-2 rounded-xl text-xs font-bold transition duration-200 uppercase tracking-wider shadow-sm cursor-pointer"
                        >
                          {isVi ? 'Áp dụng' : 'Apply'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Yellow Search Action Button */}
                <button 
                  onClick={() => handleScrollToSection('hotels-section')}
                  className="bg-natural-gold-deep hover:bg-natural-gold-dark text-stone-950 font-black px-6 py-3 rounded-2xl transition shadow-md md:w-fit uppercase text-xs md:text-sm tracking-wide self-center shrink-0"
                >
                  {t.searchBtn}
                </button>
              </div>
            </div>

            {/* Benefit USPs Row exact replication */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
                
                <div className="space-y-1">
                  <span className="text-sm font-bold text-stone-900 block">{t.uspsTitle1}</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{t.uspsSub1}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-stone-900 block">{t.uspsTitle2}</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{t.uspsSub2}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-stone-900 block">{t.uspsTitle3}</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{t.uspsSub3}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-stone-900 block">{t.uspsTitle4}</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{t.uspsSub4}</p>
                </div>

              </div>
            </div>

            {/* Dynamic Surrounding Provinces section with adjacent items */}
            <div className="bg-natural-beige border-y border-natural-border py-10 px-4 text-natural-text">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-lg font-serif font-bold text-natural-text flex items-center gap-1.5 uppercase">
                    <Navigation2 className="w-5 h-5 text-natural-accent animate-pulse" />
                    <span>{t.visitOtherProvinces}</span>
                  </h4>
                  <p className="text-xs text-natural-text/80 mt-1 max-w-xl leading-relaxed">
                    {language === 'vi' 
                      ? 'Dễ dàng di chuyển bằng xe máy Sirius chỉ mất 1 tiếng từ Hội An đến các cây cầu nổi tiếng của Đà Nẵng hoặc cung cung nguy nga của Huế.'
                      : 'Effortlessly commute by rented Sirius motorbikes within 1 hour between Hội An, Đà Nẵng beach and Cố Đô Huế.'}
                  </p>
                </div>
                <button
                  onClick={() => setView('provinces')}
                  className="bg-natural-bg hover:bg-natural-beige text-natural-accent font-bold border border-natural-border shadow-xs px-5 py-2.5 rounded-xl text-xs transition uppercase tracking-wider font-sans"
                >
                  {language === 'vi' ? 'Xem các tỉnh miền Trung khác' : 'Explore central provinces'}
                </button>
              </div>
            </div>

            {/* Section: Điểm đến nổi bật (Featured Attractions in grid) exactly matching size & design */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="flex justify-between items-end border-b border-amber-200/50 pb-4 mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight uppercase">
                    {t.featuredSpots}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    {t.spotSubtitle}
                  </p>
                </div>
                <span 
                  onClick={() => {
                    setView('all-services');
                    setAllServicesTab('attractions');
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-stone-900 transition flex items-center gap-1 cursor-pointer"
                >
                  {language === 'vi' ? 'Xem tất cả' : 'View all'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {selectedAttractions.map((spot) => (
                  <div 
                    key={spot.id} 
                    onClick={() => handleViewItem({
                      id: spot.id,
                      type: 'nearby-place',
                      name: spot.name,
                      image: spot.image,
                      price: 0,
                      description: spot.description
                    })}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-150 transition duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img src={spot.image} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite({
                            id: spot.id,
                            type: 'nearby-place',
                            name: spot.name,
                            image: spot.image,
                            price: 0,
                            description: spot.description
                          });
                        }}
                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-natural-bg/95 backdrop-blur-md flex items-center justify-center shadow-sm border border-natural-border hover:scale-110 transition group/fav z-10"
                        title={language === 'vi' ? 'Thêm vào yêu thích' : 'Add to favorites'}
                      >
                        <Heart 
                          className={`w-4 h-4 transition duration-200 ${
                            favorites.some(x => x.id === spot.id) 
                              ? 'text-rose-600 fill-rose-600' 
                              : 'text-stone-400 group-hover/fav:text-rose-500'
                          }`} 
                        />
                      </button>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-stone-800 flex items-center gap-0.5 border border-stone-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span>{spot.rating} ({spot.reviewsCount})</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-stone-900 text-sm tracking-tight leading-snug line-clamp-1">{spot.name}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {spot.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodations, Activities and Bike Rentals roster catalog */}
            <BookingDetails 
              language={language}
              provinceId={selectedProvinceId}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
              onRemoveFromCart={handleRemoveFromCart}
              onViewItem={handleViewItem}
              onViewAllServices={(tab) => {
                setView('all-services');
                setAllServicesTab(tab);
              }}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Exclusive VIP privileges promotional campaign exact match */}
            <div className="w-full bg-natural-accent py-14 px-4 shadow-inner text-white">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-natural-bg">
                    {t.promoBannerTitle}
                  </h3>
                  <p className="text-xs md:text-sm text-natural-beige/90 max-w-xl mx-auto leading-relaxed">
                    Đăng ký nhập email và dạo bước du lịch Hội An & miền Trung cùng chuỗi đối tác lữ hành VietCharm.
                  </p>
                </div>
 
                <form onSubmit={handleSubscribeSubmit} className="max-w-md mx-auto flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t.subPlaceholder}
                    className="flex-1 text-xs md:text-sm bg-natural-bg text-natural-text placeholder:text-stone-400 px-4 py-3 rounded-xl border border-natural-border focus:ring-1 focus:ring-natural-accent outline-none font-medium"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-natural-gold hover:bg-natural-gold-dark text-natural-text px-5 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition shadow-md whitespace-nowrap"
                  >
                    {isVi ? 'Đăng ký' : 'Subscribe'}
                  </button>
                </form>

                {subscribedMsg && (
                  <p className="text-emerald-800 font-black text-xs animate-bounce mt-2">
                    ✓ {isVi ? 'Đăng ký thành công! Voucher ưu đãi 10% đã gửi đi.' : 'Subscribed successfully! 10% Coupon dispatched.'}
                  </p>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 4A: TRIP ROOM (PHÒNG LẬP KẾ HOẠCH ĐỒNG THUẬN NHÓM) */}
        {!selectedItem && view === 'trip-room' && (
          <motion.div
            key="trip-room-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <TripRoom 
              language={language}
              onAddComboToCart={handleAddAIComboToCart}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
        )}

        {/* VIEW 4B: BLIND TRAVEL (HÀNH TRÌNH ẨN SỐ BAO KHỨ HỒI & RESORT) */}
        {!selectedItem && view === 'blind-travel' && (
          <motion.div
            key="blind-travel-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <BlindTravel 
              language={language}
              onAddComboToCart={handleAddAIComboToCart}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
        )}

        {/* VIEW 5: USER PERSONAL PROFILE (STT 2) */}
        {!selectedItem && view === 'profile' && (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <PersonalProfile 
              language={language}
              user={currentUser}
              onUpdateProfile={(updated) => updateProfile(updated)}
              bookings={bookings.filter(b => b.userEmail === currentUser?.email)}
              vouchers={vouchers}
              onNavigateHome={() => setView('regions')}
              partnershipRequests={applications.filter(a => a.email === currentUser?.email)}
              favorites={favorites}
              recentlyViewed={recentlyViewed}
              onToggleFavorite={handleToggleFavorite}
              onViewItem={handleViewItem}
            />
          </motion.div>
        )}

        {/* VIEW 6: TAXI BOOKING (STT 5) */}
        {!selectedItem && view === 'taxi' && (
          <motion.div
            key="taxi-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <TaxiBooking 
              language={language}
              onAddToCart={(item) => {
                handleAddToCart(item);
                setShowPaymentModal(true);
              }}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
        )}

        {/* VIEW 7: TOUR COMBOS (STT 10) */}
        {!selectedItem && view === 'tours' && (
          <motion.div
            key="tours-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <TourCombos 
              language={language}
              onAddToCart={(item) => {
                handleAddToCart(item);
                setShowPaymentModal(true);
              }}
              onNavigateHome={() => setView('regions')}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

        {/* VIEW 8: TRAVEL HANDBOOK (STT 11) */}
        {!selectedItem && view === 'handbook' && (
          <motion.div
            key="handbook-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <TravelHandbook language={language} />
          </motion.div>
        )}

        {/* VIEW 8.5: RECENTLY VIEWED SERVICES */}
        {!selectedItem && view === 'recently-viewed' && (
          <motion.div
            key="recently-viewed-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-12 space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-natural-border pb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-natural-accent uppercase tracking-widest">{isVi ? 'Nhật ký lữ hành' : 'Travel History Log'}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-natural-text mt-1">
                  {isVi ? 'Dịch Vụ Đã Xem Gần Đây' : 'Recently Viewed Services'}
                </h2>
                <p className="text-natural-text/70 text-xs mt-1">
                  {isVi 
                    ? 'Danh sách các cơ sở lưu trú khách sạn, hoạt động trải nghiệm hoặc xe tự lái bạn đã tham khảo.' 
                    : 'The collection of hotels, activities, or vehicle rentals you have browsed.'}
                </p>
              </div>

              {recentlyViewed.length > 0 && (
                <button
                  onClick={() => clearRecentlyViewed()}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  🗑️ {isVi ? 'Xóa toàn bộ lịch sử' : 'Clear Browser History'}
                </button>
              )}
            </div>

            {recentlyViewed.length === 0 ? (
              <div className="text-center py-20 bg-natural-cream border border-dashed border-natural-border rounded-3xl p-6 space-y-4">
                <Clock className="w-12 h-12 text-natural-accent/50 mx-auto animate-pulse" />
                <h3 className="font-serif font-bold text-natural-text text-lg">
                  {isVi ? 'Chưa có dịch vụ nào đã xem' : 'No browsed history yet'}
                </h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">
                  {isVi 
                    ? 'Hãy khám phá các tỉnh miền Trung, click xem chi tiết các khách sạn di sản và hoạt động vui chơi để lưu trữ tại đây.' 
                    : 'Explore beautiful Central provinces, interact with historical stays and private cars to populate your logs here.'}
                </p>
                <button 
                  onClick={() => setView('provinces')} 
                  className="bg-natural-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-natural-olive transition cursor-pointer"
                >
                  {isVi ? 'Bắt đầu Khám phá ngay →' : 'Start Exploring Now →'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentlyViewed.map((item, idx) => {
                  const alreadyInCart = cartItems.some((x) => x.id === item.id);
                  return (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-natural-beige-light rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-natural-border hover:border-natural-accent transition duration-300 flex flex-col justify-between"
                    >
                      <div className="relative h-44 overflow-hidden shrink-0 bg-stone-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-natural-gold text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {item.type === 'hotel' ? (isVi ? 'Khách sạn' : 'Hotel') : 
                           item.type === 'activity' ? (isVi ? 'Trải nghiệm' : 'Activity') : 
                           (isVi ? 'Xe tự lái' : 'Rental')}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-natural-text text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-[11px] text-natural-text/75 line-clamp-2 leading-relaxed min-h-[32px]">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-natural-border flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-natural-accent block font-bold uppercase tracking-wider">
                              {isVi ? 'ĐƠN GIÁ' : 'PRICE'}
                            </span>
                            <span className="font-mono font-black text-natural-accent text-sm">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          {alreadyInCart ? (
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="bg-natural-beige hover:bg-natural-border text-natural-text px-3 py-1.5 rounded-xl text-[11px] font-bold border border-natural-border transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>✓ {isVi ? 'Đã thêm' : 'Added'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleViewItem(item);
                              }}
                              className="bg-natural-accent hover:bg-natural-olive text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer"
                            >
                              {isVi ? 'Xem chi tiết' : 'View Details'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 8.6: DISCOVER NEARBY PLACES */}
        {!selectedItem && view === 'nearby-places' && (
          <motion.div
            key="nearby-places-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <NearbyPlaces 
              language={language}
              onBackToHome={() => setView('regions')}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

        {/* VIEW 9: PARTNERSHIP FORM REGISTRATION (STT 13) */}
        {!selectedItem && view === 'partnership-register' && (
          <motion.div
            key="partnership-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <PartnershipForm 
              language={language}
              onRegisterApplication={(app) => addApplication(app)}
              applications={applications.filter(a => a.email === currentUser?.email)}
            />
          </motion.div>
        )}

        {/* VIEW 10: ADMIN DASHBOARD (STT 14) */}
        {!selectedItem && view === 'admin' && (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            {currentUser?.role === 'admin' ? (
              <AdminDashboard 
                language={language}
                users={users}
                onUpdateUserRole={(userId, newRole) => setUserRole(userId, newRole)}
                applications={applications}
                onUpdateApplicationStatus={(appId, newStatus) => setApplicationStatus(appId, newStatus)}
                bookings={bookings}
                onUpdateBookingStatus={(bkId, newStatus) => setBookingStatus(bkId, newStatus)}
                vouchers={vouchers}
                onAddNewVoucher={(newV) => addVoucher(newV)}
                onDeleteVoucher={(vCode) => deleteVoucher(vCode)}
              />
            ) : (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">{isVi ? 'Không có quyền truy cập!' : 'Access Denied!'}</h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">{isVi ? 'Bạn cần tài khoản có quyền Quản trị viên để truy cập trang thông số dữ liệu này.' : 'Administrator role required to query service catalogs.'}</p>
                <button onClick={() => setView('regions')} className="bg-natural-accent text-white px-5 py-2 rounded-xl text-xs font-bold transition">
                  {isVi ? 'Quay về trang chủ' : 'Return home'}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 11: ALL SERVICES DIRECTORY CATALOG */}
        {!selectedItem && view === 'all-services' && (
          <motion.div
            key="all-services-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AllServicesView 
              language={language}
              initialTab={allServicesTab}
              onBack={() => {
                if (allServicesTab === 'attractions') {
                  setView('regions');
                } else {
                  setView('province');
                }
              }}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              cartItems={cartItems}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* SECURE payment processing and dynamic E-Ticket billing popup */}
      {showPaymentModal && (
        <PaymentModal 
          language={language}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Real authentication modal (STT 1) */}
      <UserAuthModal 
        language={language}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          login(user);
          navigateHome();
        }}
        users={users}
        onRegisterNew={(newU) => {
          register(newU);
          navigateHome();
        }}
      />

      {/* Floating interactive Help Center & Promo desk */}
      <HelpPromoCenter 
        language={language}
        onNavigateToPartnership={() => setView('partnership-register')}
        onNavigateToHotels={() => {
          setView('province');
          setTimeout(() => {
            handleScrollToSection('hotels-section');
          }, 450);
        }}
        onNavigateToMysteryRoom={() => setView('blind-travel')}
      />

      <Footer />

    </div>
  );
}
