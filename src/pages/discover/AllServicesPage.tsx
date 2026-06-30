/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import AllServicesView from '@/components/AllServicesView';
import { useI18n, useCart, useUI } from '@/hooks';

export default function AllServicesPage() {
  const { language } = useI18n();
  const isVi = language === 'vi';
  const { items: cartItems, addItem: handleAddToCart, removeItem: handleRemoveFromCart, openPayment } = useCart();
  const {
    allServicesTab,
    allServicesReturnView,
    allServicesVehicleMode,
    setAllServicesVehicleMode,
    setView,
    requireAuth,
    viewItem: handleViewItem,
    favorites,
    toggleFavorite: handleToggleFavorite,
  } = useUI();
  const guardedAddToCart = (item: Parameters<typeof handleAddToCart>[0]) =>
    requireAuth(
      () => handleAddToCart(item),
      isVi ? 'Đăng nhập để thêm dịch vụ vào giỏ.' : 'Sign in to add services to your cart.',
    );
  const handleBookTaxi = (item: Parameters<typeof handleAddToCart>[0]) =>
    requireAuth(() => {
      handleAddToCart(item);
      openPayment();
    }, isVi ? 'Đăng nhập để đặt và thanh toán.' : 'Sign in to book and pay.');
  return (
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
                setView(allServicesReturnView || 'province');
              }}
              onAddToCart={guardedAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              cartItems={cartItems}
              onViewItem={handleViewItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              vehicleMode={allServicesVehicleMode}
              onVehicleModeChange={setAllServicesVehicleMode}
              onBookTaxi={handleBookTaxi}
              onNavigateHome={() => setView('regions')}
            />
          </motion.div>
  );
}
