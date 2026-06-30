/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useUI } from '@/hooks';
import ProfilePage from '@/pages/account/ProfilePage';
import AdminPage from '@/pages/admin/AdminPage';
import AuthPage from '@/pages/auth/AuthPage';
import CartPage from '@/pages/cart/CartPage';
import AiExplorerPage from '@/pages/trip/AiExplorerPage';
import AllServicesPage from '@/pages/discover/AllServicesPage';
import NearbyPlacesPage from '@/pages/discover/NearbyPlacesPage';
import ProvinceDetailPage from '@/pages/discover/ProvinceDetailPage';
import ProvincesPage from '@/pages/discover/ProvincesPage';
import RecentlyViewedPage from '@/pages/discover/RecentlyViewedPage';
import RegionsPage from '@/pages/discover/RegionsPage';
import ServiceDetailsPage from '@/pages/discover/ServiceDetailsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PartnershipPage from '@/pages/partner/PartnershipPage';
import BlindTravelPage from '@/pages/trip/BlindTravelPage';
import HandbookPage from '@/pages/trip/HandbookPage';
import TaxiPage from '@/pages/trip/TaxiPage';
import ToursPage from '@/pages/trip/ToursPage';
import TripRoomPage from '@/pages/trip/TripRoomPage';

/** Renders the active view. The item-details overlay takes precedence over `view`. */
export default function ViewRouter() {
  const { view, selectedItem } = useUI();

  let page = null;
  if (selectedItem) {
    page = <ServiceDetailsPage />;
  } else if (view === 'regions') {
    page = <RegionsPage />;
  } else if (view === 'provinces') {
    page = <ProvincesPage />;
  } else if (view === 'province') {
    page = <ProvinceDetailPage />;
  } else if (view === 'trip-room') {
    page = <TripRoomPage />;
  } else if (view === 'blind-travel') {
    page = <BlindTravelPage />;
  } else if (view === 'ai-explorer') {
    page = <AiExplorerPage />;
  } else if (view === 'group-blind-travel') {
    page = <TripRoomPage />;
  } else if (view === 'profile') {
    page = <ProfilePage />;
  } else if (view === 'taxi') {
    page = <TaxiPage />;
  } else if (view === 'tours') {
    page = <ToursPage />;
  } else if (view === 'handbook') {
    page = <HandbookPage />;
  } else if (view === 'recently-viewed') {
    page = <RecentlyViewedPage />;
  } else if (view === 'nearby-places') {
    page = <NearbyPlacesPage />;
  } else if (view === 'partnership-register') {
    page = <PartnershipPage />;
  } else if (view === 'admin') {
    page = <AdminPage />;
  } else if (view === 'all-services') {
    page = <AllServicesPage />;
  } else if (view === 'cart') {
    page = <CartPage />;
  } else if (view === 'login') {
    page = <AuthPage mode="login" />;
  } else if (view === 'register') {
    page = <AuthPage mode="register" />;
  } else if (view === 'forgot-password') {
    page = <AuthPage mode="forgot-password" />;
  } else {
    page = <NotFoundPage />;
  }

  // AnimatePresence tracks its direct child by `key`; key it by the active
  // view/item so page transitions stay predictable without delaying the mount.
  const transitionKey = selectedItem ? `item-${selectedItem.id}` : view;

  return (
    <AnimatePresence initial={false}>
      {page && React.cloneElement(page, { key: transitionKey })}
    </AnimatePresence>
  );
}
