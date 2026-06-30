/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { BookingSearchCriteria, ViewableItem } from '@/types';
import type { ViewId, SubView, ServiceTab } from '@/constants/views';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { routeToState, viewToPath } from '@/app/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useI18n } from '@/contexts/I18nContext';

/** Views that require a signed-in user; navigating to them while logged out redirects to login. */
const AUTH_GATED_VIEWS: ReadonlySet<ViewId> = new Set(['trip-room', 'partnership-register']);
const AUTH_MODAL_EVENT = 'vietcharm:open-auth-modal';

export interface UIValue {
  view: ViewId;
  setView: (v: ViewId) => void;
  activeSubView: SubView;
  setActiveSubView: (s: SubView) => void;
  allServicesTab: ServiceTab;
  setAllServicesTab: (t: ServiceTab) => void;
  /** Sub-mode of the unified "Phương tiện di chuyển" view: rent a vehicle vs. book a taxi. */
  allServicesVehicleMode: 'rent' | 'taxi';
  setAllServicesVehicleMode: (m: 'rent' | 'taxi') => void;
  allServicesReturnView: ViewId | null;
  openAllServices: (tab: ServiceTab, returnView?: ViewId) => void;
  bookingSearch: BookingSearchCriteria;
  setBookingSearch: (criteria: BookingSearchCriteria) => void;
  selectedProvinceId: string;
  setSelectedProvinceId: (id: string) => void;
  /** Open a province detail page (sets province + resets sub-view + navigates). */
  selectProvince: (id: string) => void;
  navigateHome: () => void;
  /** Run `action` if signed in; otherwise show a notice and redirect to login. */
  requireAuth: (action: () => void, message?: string) => void;
  /** Navigate to province detail and smooth-scroll to a section once it mounts. */
  scrollToSection: (sectionId: string) => void;
  /** The Header menu mapping (sub-views, scroll targets, top-level views). */
  changeHeaderView: (target: string) => void;
  selectedItem: ViewableItem | null;
  /** Preview an item: push to "recently viewed" and open the details overlay. */
  viewItem: (item: ViewableItem) => void;
  clearSelectedItem: () => void;
  recentlyViewed: ViewableItem[];
  clearRecentlyViewed: () => void;
  favorites: ViewableItem[];
  toggleFavorite: (item: ViewableItem) => void;
  isFavorite: (id: string) => boolean;
}

export const UIContext = React.createContext<UIValue | null>(null);

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDateInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function createDefaultBookingSearch(): BookingSearchCriteria {
  const today = new Date();
  const checkIn = addDays(today, 1);
  return {
    query: '',
    checkInDate: formatDateInput(checkIn),
    checkOutDate: formatDateInput(addDays(checkIn, 4)),
    guestsCount: 1,
    roomsCount: 1,
  };
}

function requestAuthModal() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_MODAL_EVENT, { detail: { view: 'login' } }));
}

export function UIProvider({ children }: { children?: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { isVi } = useI18n();

  const initialRoute = React.useMemo(
    () => (typeof window === 'undefined' ? { view: 'regions' as ViewId } : routeToState(window.location.pathname)),
    [],
  );
  const initialView =
    AUTH_GATED_VIEWS.has(initialRoute.view) && !currentUser ? 'login' : initialRoute.view;
  const [view, setViewState] = React.useState<ViewId>(initialView);
  const [activeSubView, setActiveSubView] = React.useState<SubView>('spots');
  const [allServicesTab, setAllServicesTab] = React.useState<ServiceTab>('attractions');
  const [allServicesVehicleMode, setAllServicesVehicleMode] = React.useState<'rent' | 'taxi'>('rent');
  const [allServicesReturnView, setAllServicesReturnView] = React.useState<ViewId | null>(null);
  const [bookingSearch, setBookingSearch] = React.useState<BookingSearchCriteria>(() => createDefaultBookingSearch());
  const [selectedProvinceId, setSelectedProvinceIdState] = React.useState(initialRoute.provinceId || 'quang-nam');
  const [selectedItem, setSelectedItem] = React.useState<ViewableItem | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.recentlyViewed, []);
  const [favorites, setFavorites] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.favorites, []);
  const selectedProvinceIdRef = React.useRef(selectedProvinceId);
  const viewRef = React.useRef(view);
  const currentUserRef = React.useRef(currentUser);

  React.useEffect(() => {
    selectedProvinceIdRef.current = selectedProvinceId;
  }, [selectedProvinceId]);

  React.useEffect(() => {
    viewRef.current = view;
  }, [view]);

  React.useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const notifyAuthRequired = React.useCallback(
    (message?: string) => {
      showToast({
        type: 'info',
        title: isVi ? 'Cần đăng nhập' : 'Sign in required',
        message: message ?? (isVi ? 'Vui lòng đăng nhập để tiếp tục.' : 'Please sign in to continue.'),
      });
    },
    [showToast, isVi],
  );

  const syncUrl = React.useCallback((nextView: ViewId, provinceId = selectedProvinceIdRef.current, replace = false) => {
    if (typeof window === 'undefined') return;
    const nextPath = viewToPath(nextView, provinceId);
    if (window.location.pathname === nextPath) return;

    const state = { view: nextView, provinceId };
    if (replace) {
      window.history.replaceState(state, '', nextPath);
    } else {
      window.history.pushState(state, '', nextPath);
    }
  }, []);

  const setView = React.useCallback(
    (nextView: ViewId) => {
      let target = nextView;
      if (AUTH_GATED_VIEWS.has(nextView) && !currentUserRef.current) {
        notifyAuthRequired(
          isVi ? 'Vui lòng đăng nhập để dùng tính năng này.' : 'Please sign in to use this feature.',
        );
        requestAuthModal();
        return;
      }
      setSelectedItem(null);
      if (target !== 'all-services') setAllServicesReturnView(null);
      setViewState(target);
      viewRef.current = target;
      syncUrl(target, selectedProvinceIdRef.current);
    },
    [syncUrl, notifyAuthRequired, isVi],
  );

  const setSelectedProvinceId = React.useCallback(
    (id: string) => {
      selectedProvinceIdRef.current = id;
      setSelectedProvinceIdState(id);
      if (viewRef.current === 'province') {
        syncUrl('province', id);
      }
    },
    [syncUrl],
  );

  React.useEffect(() => {
    const applyLocation = () => {
      const nextRoute = routeToState(window.location.pathname);
      const nextView =
        AUTH_GATED_VIEWS.has(nextRoute.view) && !currentUserRef.current ? 'login' : nextRoute.view;
      setSelectedItem(null);
      setViewState(nextView);
      viewRef.current = nextView;

      if (nextRoute.provinceId) {
        selectedProvinceIdRef.current = nextRoute.provinceId;
        setSelectedProvinceIdState(nextRoute.provinceId);
      }

      if (nextView !== 'all-services') {
        setAllServicesReturnView(null);
      }
    };

    window.addEventListener('popstate', applyLocation);
    return () => window.removeEventListener('popstate', applyLocation);
  }, []);

  // Navigate to province detail, then smooth-scroll to the target section once it mounts.
  // Offsets by the live sticky-header height so the section heading isn't hidden behind it.
  const scrollToSection = (sectionId: string) => {
    setAllServicesReturnView(null);
    setViewState('province');
    viewRef.current = 'province';
    syncUrl('province', selectedProvinceIdRef.current);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const header = document.querySelector('header');
      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 200);
  };

  const openAllServices = React.useCallback(
    (tab: ServiceTab, returnView: ViewId = viewRef.current) => {
      const normalizedReturnView = returnView === 'all-services' ? 'province' : returnView;
      setAllServicesTab(tab);
      setAllServicesReturnView(normalizedReturnView);
      setSelectedItem(null);
      setViewState('all-services');
      viewRef.current = 'all-services';
      syncUrl('all-services', selectedProvinceIdRef.current);
    },
    [syncUrl],
  );

  const changeHeaderView = (target: string) => {
    if (target === 'spots') {
      setActiveSubView('spots');
      setView('provinces');
    } else if (target === 'blind-travel') {
      setView('blind-travel');
    } else if (target === 'trip-room' || target === 'group-blind-travel') {
      setView('trip-room');
    } else if (
      target === 'profile' || target === 'tours' || target === 'handbook' ||
      target === 'partnership-register' || target === 'admin' || target === 'recently-viewed' ||
      target === 'nearby-places' || target === 'cart'
    ) {
      setView(target as ViewId);
    } else if (target === 'hotels') {
      setActiveSubView('hotels');
      openAllServices('hotels');
    } else if (target === 'rentals') {
      // "Phương tiện di chuyển" → vehicle rentals
      setActiveSubView('rentals');
      setAllServicesVehicleMode('rent');
      openAllServices('vehicles');
    } else if (target === 'taxi') {
      // "Phương tiện di chuyển" → taxi booking (same unified view, taxi mode)
      setActiveSubView('rentals');
      setAllServicesVehicleMode('taxi');
      openAllServices('vehicles');
    } else if (target === 'experiences') {
      setActiveSubView('experiences');
      openAllServices('activities');
    }
  };

  const requireAuth = React.useCallback(
    (action: () => void, message?: string) => {
      if (currentUserRef.current) {
        action();
        return;
      }
      notifyAuthRequired(message);
      requestAuthModal();
    },
    [notifyAuthRequired, setView],
  );

  const value: UIValue = {
    view,
    setView,
    activeSubView,
    setActiveSubView,
    allServicesTab,
    setAllServicesTab,
    allServicesVehicleMode,
    setAllServicesVehicleMode,
    allServicesReturnView,
    openAllServices,
    bookingSearch,
    setBookingSearch,
    selectedProvinceId,
    setSelectedProvinceId,
    selectProvince: (id) => {
      selectedProvinceIdRef.current = id;
      setSelectedProvinceIdState(id);
      setActiveSubView('spots');
      setAllServicesReturnView(null);
      setSelectedItem(null);
      setViewState('province');
      viewRef.current = 'province';
      syncUrl('province', id);
    },
    navigateHome: () => setView('regions'),
    requireAuth,
    scrollToSection,
    changeHeaderView,
	    selectedItem,
	    viewItem: (item) => {
	      if (typeof window !== 'undefined') {
	        window.sessionStorage.setItem(
	          STORAGE_KEYS.returnTarget,
	          JSON.stringify({
	            view: viewRef.current,
	            provinceId: selectedProvinceIdRef.current,
	            tab: allServicesTab,
	            itemId: item.id,
	            scrollY: window.scrollY,
	          }),
	        );
	      }
	      setRecentlyViewed((prev) => {
	        const filtered = prev.filter((x) => x.id !== item.id);
	        return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 24);
      });
      setSelectedItem(item);
    },
    clearSelectedItem: () => setSelectedItem(null),
    recentlyViewed,
    clearRecentlyViewed: () => setRecentlyViewed([]),
    favorites,
    toggleFavorite: (item) =>
      setFavorites((prev) => {
        const exists = prev.some((x) => x.id === item.id);
        return exists ? prev.filter((x) => x.id !== item.id) : [...prev, item];
      }),
    isFavorite: (id) => favorites.some((x) => x.id === id),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const ctx = React.useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within <UIProvider>');
  return ctx;
}
