/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { useUI } from '@/hooks';
import ServiceDetailsPage from '@/pages/ServiceDetailsPage';
import RegionsPage from '@/pages/RegionsPage';
import ProvincesPage from '@/pages/ProvincesPage';
import ProvinceDetailPage from '@/pages/ProvinceDetailPage';
import TripRoomPage from '@/pages/TripRoomPage';
import BlindTravelPage from '@/pages/BlindTravelPage';
import ProfilePage from '@/pages/ProfilePage';
import TaxiPage from '@/pages/TaxiPage';
import ToursPage from '@/pages/ToursPage';
import HandbookPage from '@/pages/HandbookPage';
import RecentlyViewedPage from '@/pages/RecentlyViewedPage';
import NearbyPlacesPage from '@/pages/NearbyPlacesPage';
import PartnershipPage from '@/pages/PartnershipPage';
import AdminPage from '@/pages/AdminPage';
import AllServicesPage from '@/pages/AllServicesPage';

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
