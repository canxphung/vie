/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Navigation2 } from 'lucide-react';
import AIPilot from '@/components/AIPilot';
import BookingDetails from '@/components/BookingDetails';
import { Container } from '@/components/ui';
import { attractionsByProvince, provinces } from '@/data';
import { FeaturedAttractions } from '@/features/province/FeaturedAttractions';
import { NewsletterSignup } from '@/features/province/NewsletterSignup';
import { ProvinceHero } from '@/features/province/ProvinceHero';
import { ProvinceSearchBar } from '@/features/province/ProvinceSearchBar';
import { ProvinceUsps } from '@/features/province/ProvinceUsps';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ProvinceDetailPage() {
  const { language, t, isVi } = useI18n();
  const { items: cartItems, removeItem: handleRemoveFromCart, addCombo: handleAddComboToCart } = useCart();
  const {
    selectedProvinceId,
    setView,
    openAllServices,
    bookingSearch,
    setBookingSearch,
    scrollToSection: handleScrollToSection,
    viewItem: handleViewItem,
    favorites,
    toggleFavorite: handleToggleFavorite,
  } = useUI();
  const selectedAttractions = attractionsByProvince[selectedProvinceId] || [];
  const selectedProvince = provinces.find((province) => province.id === selectedProvinceId);

  return (
    <motion.div
      key="province-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-0"
    >
      <ProvinceHero
        provinceId={selectedProvinceId}
        exploreLabel={t.exploreNow}
        onExplore={() => handleScrollToSection('featured-attractions-section')}
      />

      <ProvinceSearchBar
        isVi={isVi}
        value={bookingSearch}
        labels={{
          heroSearchTitle: t.heroSearchTitle,
          searchPlaceholder: t.searchPlaceholder,
          checkIn: t.checkIn,
          checkOut: t.checkOut,
          guestsNum: t.guestsNum,
          searchBtn: t.searchBtn,
        }}
        onSearch={(criteria) => {
          setBookingSearch(criteria);
          handleScrollToSection('hotels-section');
        }}
      />

      <Container className="-mt-6 pb-6">
        <nav
          aria-label={isVi ? 'Điều hướng phân cấp' : 'Breadcrumb'}
          className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-500"
        >
          <button type="button" onClick={() => setView('regions')} className="transition hover:text-natural-accent">
            {isVi ? 'Trang chủ' : 'Home'}
          </button>
          <span aria-hidden>/</span>
          <button type="button" onClick={() => setView('provinces')} className="transition hover:text-natural-accent">
            {isVi ? 'Miền Trung' : 'Central Vietnam'}
          </button>
          <span aria-hidden>/</span>
          <span className="text-natural-text" aria-current="page">
            {selectedProvince?.name || selectedProvinceId}
          </span>
        </nav>
      </Container>

      <ProvinceUsps
        items={[
          { title: t.uspsTitle1, subtitle: t.uspsSub1 },
          { title: t.uspsTitle2, subtitle: t.uspsSub2 },
          { title: t.uspsTitle3, subtitle: t.uspsSub3 },
          { title: t.uspsTitle4, subtitle: t.uspsSub4 },
        ]}
      />

      <AIPilot
        language={language}
        currentProvinceId={selectedProvinceId}
        onAddComboToCart={handleAddComboToCart}
        onNavigateToBlindTravel={() => setView('blind-travel')}
      />

      <div className="bg-natural-beige border-y border-natural-border py-10 text-natural-text">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
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
            {language === 'vi' ? 'Xem điểm đến khác' : 'Explore other destinations'}
          </button>
        </Container>
      </div>

      <FeaturedAttractions
        language={language}
        title={t.featuredSpots}
        subtitle={t.spotSubtitle}
        viewAllLabel={language === 'vi' ? 'Xem tất cả' : 'View all'}
        attractions={selectedAttractions}
        favorites={favorites}
        onViewAll={() => openAllServices('attractions', 'province')}
        onViewItem={handleViewItem}
        onToggleFavorite={handleToggleFavorite}
      />

      <BookingDetails
        language={language}
        provinceId={selectedProvinceId}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onViewItem={handleViewItem}
        searchCriteria={bookingSearch}
        onViewAllServices={(tab) => openAllServices(tab, 'province')}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <NewsletterSignup isVi={isVi} title={t.promoBannerTitle} placeholder={t.subPlaceholder} />
    </motion.div>
  );
}
