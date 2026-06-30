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
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { UserAuthModal } from '@/features/auth/UserAuthModal';
import { useI18n, useAuth, useCart, useUI } from '@/hooks';

type AuthModalView = 'login' | 'register';

function readSavedReturnScroll(): number | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.returnTarget);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { scrollY?: number };
    return typeof parsed.scrollY === 'number' ? parsed.scrollY : null;
  } catch {
    return null;
  }
}

function restoreScrollAfterRemount(top: number) {
  let attempts = 0;
  const restore = () => {
    window.scrollTo({ top });
    attempts += 1;
    if (attempts < 6) {
      window.setTimeout(restore, attempts < 3 ? 80 : 180);
      return;
    }
    window.sessionStorage.removeItem(STORAGE_KEYS.returnTarget);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(restore);
  });
}

export default function App() {
  const { language, setLanguage } = useI18n();
  const [authModalView, setAuthModalView] = React.useState<AuthModalView>('login');
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const {
    view,
    activeSubView,
    allServicesTab,
    allServicesServicePicker,
    selectedProvinceId,
    selectedItem,
    setView,
    changeHeaderView,
    navigateHome,
    openAllServices,
  } = useUI();

  React.useEffect(() => {
    const openAuthModal = (event: Event) => {
      const detail = (event as CustomEvent<{ view?: AuthModalView }>).detail;
      setAuthModalView(detail?.view === 'register' ? 'register' : 'login');
      setAuthModalOpen(true);
    };

    window.addEventListener('vietcharm:open-auth-modal', openAuthModal);
    return () => window.removeEventListener('vietcharm:open-auth-modal', openAuthModal);
  }, []);

  // Scroll new pages/details to the top, but restore the list position when a detail closes.
  const previousLocationRef = React.useRef({ view, selectedProvinceId, selectedItemId: selectedItem?.id || null });
  const returnScrollRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const previous = previousLocationRef.current;
    const nextItemId = selectedItem?.id || null;
    const baseChanged = previous.view !== view || previous.selectedProvinceId !== selectedProvinceId;
    const itemOpened = !previous.selectedItemId && !!nextItemId;
    const itemClosed = !!previous.selectedItemId && !nextItemId;
    const itemSwapped = !!previous.selectedItemId && !!nextItemId && previous.selectedItemId !== nextItemId;

    if (baseChanged) {
      returnScrollRef.current = null;
      window.scrollTo({ top: 0 });
    } else if (itemOpened) {
      returnScrollRef.current = window.scrollY;
      window.scrollTo({ top: 0 });
    } else if (itemClosed) {
      const savedTop = readSavedReturnScroll();
      const top = savedTop ?? returnScrollRef.current;
      if (top !== null) restoreScrollAfterRemount(top);
      returnScrollRef.current = null;
    } else if (itemSwapped) {
      window.scrollTo({ top: 0 });
    }

    previousLocationRef.current = { view, selectedProvinceId, selectedItemId: nextItemId };
  }, [view, selectedProvinceId, selectedItem]);
  const { currentUser, users, login, register, logout, updatePasswordByEmail } = useAuth();
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
        : view === 'service-provinces'
          ? allServicesServicePicker === 'attractions'
            ? 'spots'
            : allServicesServicePicker === 'vehicles'
              ? 'rentals'
              : allServicesServicePicker === 'activities'
                ? 'experiences'
                : allServicesServicePicker
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

      <UserAuthModal
        language={language}
        isOpen={authModalOpen}
        initialView={authModalView}
        users={users}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={login}
        onRegisterNew={register}
        onUpdatePasswordByEmail={updatePasswordByEmail}
      />

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
