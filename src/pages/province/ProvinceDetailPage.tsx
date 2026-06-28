/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Navigation2 } from 'lucide-react';
import BookingDetails from '@/components/BookingDetails';
import { Container } from '@/components/ui';
import { attractionsByProvince } from '@/data';
import { FeaturedAttractions } from '@/features/province/FeaturedAttractions';
import { NewsletterSignup } from '@/features/province/NewsletterSignup';
import { ProvinceHero } from '@/features/province/ProvinceHero';
import { ProvinceSearchBar } from '@/features/province/ProvinceSearchBar';
import { ProvinceUsps } from '@/features/province/ProvinceUsps';
import { useI18n, useCart, useUI } from '@/hooks';

export default function ProvinceDetailPage() {
  const { language, t, isVi } = useI18n();
  const { items: cartItems, addItem: handleAddToCart, removeItem: handleRemoveFromCart } = useCart();
  const {
    selectedProvinceId,
    setView,
    setAllServicesTab,
    scrollToSection: handleScrollToSection,
    viewItem: handleViewItem,
    favorites,
    toggleFavorite: handleToggleFavorite,
  } = useUI();
  const selectedAttractions = attractionsByProvince[selectedProvinceId] || [];

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
        onExplore={() => handleScrollToSection('itinerary-map-section')}
      />

      <ProvinceSearchBar
        isVi={isVi}
        labels={{
          heroSearchTitle: t.heroSearchTitle,
          searchPlaceholder: t.searchPlaceholder,
          checkIn: t.checkIn,
          checkOut: t.checkOut,
          guestsNum: t.guestsNum,
          searchBtn: t.searchBtn,
        }}
        onSearch={() => handleScrollToSection('hotels-section')}
      />

      <ProvinceUsps
        items={[
          { title: t.uspsTitle1, subtitle: t.uspsSub1 },
          { title: t.uspsTitle2, subtitle: t.uspsSub2 },
          { title: t.uspsTitle3, subtitle: t.uspsSub3 },
          { title: t.uspsTitle4, subtitle: t.uspsSub4 },
        ]}
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
            {language === 'vi' ? 'Xem các tỉnh miền Trung khác' : 'Explore central provinces'}
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
        onViewAll={() => {
          setView('all-services');
          setAllServicesTab('attractions');
        }}
        onViewItem={handleViewItem}
        onToggleFavorite={handleToggleFavorite}
      />

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

      <NewsletterSignup isVi={isVi} title={t.promoBannerTitle} placeholder={t.subPlaceholder} />
    </motion.div>
  );
}
