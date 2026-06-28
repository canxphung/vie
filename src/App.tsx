/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Footer from '@/components/layout/Footer';
import HelpPromoCenter from './components/HelpPromoCenter';
import PaymentModal from './components/PaymentModal';
import ViewRouter from '@/app/ViewRouter';
import { useI18n, useAuth, useCart, useUI } from '@/hooks';

export default function App() {
  const { language, setLanguage } = useI18n();
  const { view, activeSubView, setView, changeHeaderView, navigateHome, scrollToSection } = useUI();
  const { currentUser, logout } = useAuth();
  const {
    items: cartItems, cartCount, isPaymentOpen, openPayment, closePayment,
    removeItem: handleRemoveFromCart, clearCart: handleClearCart,
  } = useCart();
  const isAuthPage = view === 'login' || view === 'register' || view === 'forgot-password';

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text transition-colors duration-300 font-sans antialiased selection:bg-natural-gold selection:text-white">
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={cartCount}
        onOpenCart={() => openPayment()}
        onNavigateHome={() => setView('regions')}
        currentView={view === 'province' ? activeSubView : view}
        onChangeView={changeHeaderView}
        currentUser={currentUser}
        onOpenLogin={() => setView('login')}
        onOpenRegister={() => setView('register')}
        onLogout={() => {
          logout();
          navigateHome();
        }}
      />

      <ViewRouter />

      {isPaymentOpen && (
        <PaymentModal
          language={language}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onClose={() => closePayment()}
        />
      )}

      {!isAuthPage && (
        <HelpPromoCenter
          language={language}
          onNavigateToPartnership={() => setView('partnership-register')}
          onNavigateToHotels={() => {
            setView('province');
            setTimeout(() => scrollToSection('hotels-section'), 450);
          }}
          onNavigateToMysteryRoom={() => setView('blind-travel')}
        />
      )}

      <Footer />
    </div>
  );
}
