/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Header from './components/Header';
import Footer from '@/components/layout/Footer';
import HelpPromoCenter from './components/HelpPromoCenter';
import PaymentModal from './components/PaymentModal';
import ErrorBoundary from './components/ErrorBoundary';
import ViewRouter from '@/app/ViewRouter';
import { useI18n, useAuth, useCart, useUI } from '@/hooks';

export default function App() {
  const { language, setLanguage } = useI18n();
  const {
    view,
    activeSubView,
    allServicesTab,
    selectedProvinceId,
    selectedItem,
    setView,
    changeHeaderView,
    navigateHome,
    openAllServices,
  } = useUI();

  // Reset scroll to the top whenever the page, province, or opened item changes, so a
  // new view/detail never opens mid-page (or clamped to the bottom of a shorter page).
  // In-page section scrolls keep view/item unchanged, so they don't trigger this.
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, selectedProvinceId, selectedItem]);
  const { currentUser, logout } = useAuth();
  const {
    cartCount, isPaymentOpen, paymentInitialStep, closePayment,
    removeItem: handleRemoveFromCart, selectedItems, clearSelectedItems,
  } = useCart();
  const isAuthPage = view === 'login' || view === 'register' || view === 'forgot-password';
  const hideFloatingHelp = isAuthPage || view === 'cart';
  const currentHeaderView =
    view === 'province'
      ? activeSubView
      : view === 'all-services'
        ? allServicesTab === 'attractions'
          ? 'spots'
          : allServicesTab === 'vehicles'
          ? 'rentals'
          : allServicesTab === 'activities'
            ? 'experiences'
            : allServicesTab
        : view;

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text transition-colors duration-300 font-sans antialiased selection:bg-natural-gold selection:text-white">
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={cartCount}
        onOpenCart={() => setView('cart')}
        onNavigateHome={() => setView('regions')}
        currentView={currentHeaderView}
        onChangeView={changeHeaderView}
        currentUser={currentUser}
        onOpenLogin={() => setView('login')}
        onOpenRegister={() => setView('register')}
        onLogout={() => {
          logout();
          navigateHome();
        }}
      />

      <ErrorBoundary>
        <ViewRouter />
      </ErrorBoundary>

      {isPaymentOpen && (
        <PaymentModal
          language={language}
          cartItems={selectedItems}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={clearSelectedItems}
          initialStep={paymentInitialStep}
          onBackToCart={() => {
            closePayment();
            setView('cart');
          }}
          onClose={() => closePayment()}
        />
      )}

      {!hideFloatingHelp && (
        <HelpPromoCenter
          language={language}
          onNavigateToPartnership={() => setView('partnership-register')}
          onNavigateToHotels={() => {
            openAllServices('hotels');
          }}
          onNavigateToMysteryRoom={() => setView('blind-travel')}
        />
      )}

      <Footer />
    </div>
  );
}
