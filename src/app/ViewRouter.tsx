/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { useUI } from '@/hooks';
import ProfilePage from '@/pages/account/ProfilePage';
import AdminPage from '@/pages/admin/AdminPage';
import AllServicesPage from '@/pages/catalog/AllServicesPage';
import NearbyPlacesPage from '@/pages/catalog/NearbyPlacesPage';
import RecentlyViewedPage from '@/pages/catalog/RecentlyViewedPage';
import ProvincesPage from '@/pages/home/ProvincesPage';
import RegionsPage from '@/pages/home/RegionsPage';
import PartnershipPage from '@/pages/partner/PartnershipPage';
import ProvinceDetailPage from '@/pages/province/ProvinceDetailPage';
import ServiceDetailsPage from '@/pages/province/ServiceDetailsPage';
import BlindTravelPage from '@/pages/travel/BlindTravelPage';
import HandbookPage from '@/pages/travel/HandbookPage';
import TaxiPage from '@/pages/travel/TaxiPage';
import ToursPage from '@/pages/travel/ToursPage';
import TripRoomPage from '@/pages/travel/TripRoomPage';

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
  }

  return <AnimatePresence mode="wait">{page}</AnimatePresence>;
}
