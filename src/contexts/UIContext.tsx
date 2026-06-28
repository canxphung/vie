/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { ViewableItem } from '@/types';
import type { ViewId, SubView, ServiceTab } from '@/constants/views';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { routeToState, viewToPath } from '@/app/routes';

export interface UIValue {
  view: ViewId;
  setView: (v: ViewId) => void;
  activeSubView: SubView;
  setActiveSubView: (s: SubView) => void;
  allServicesTab: ServiceTab;
  setAllServicesTab: (t: ServiceTab) => void;
  selectedProvinceId: string;
  setSelectedProvinceId: (id: string) => void;
  /** Open a province detail page (sets province + resets sub-view + navigates). */
  selectProvince: (id: string) => void;
  navigateHome: () => void;
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

export function UIProvider({ children }: { children?: React.ReactNode }) {
  const initialRoute = React.useMemo(
    () => (typeof window === 'undefined' ? { view: 'regions' as ViewId } : routeToState(window.location.pathname)),
    [],
  );
  const [view, setViewState] = React.useState<ViewId>(initialRoute.view);
  const [activeSubView, setActiveSubView] = React.useState<SubView>('spots');
  const [allServicesTab, setAllServicesTab] = React.useState<ServiceTab>('attractions');
  const [selectedProvinceId, setSelectedProvinceIdState] = React.useState(initialRoute.provinceId || 'quang-nam');
  const [selectedItem, setSelectedItem] = React.useState<ViewableItem | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.recentlyViewed, []);
  const [favorites, setFavorites] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.favorites, []);
  const selectedProvinceIdRef = React.useRef(selectedProvinceId);
  const viewRef = React.useRef(view);

  React.useEffect(() => {
    selectedProvinceIdRef.current = selectedProvinceId;
  }, [selectedProvinceId]);

  React.useEffect(() => {
    viewRef.current = view;
  }, [view]);

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
      setSelectedItem(null);
      setViewState(nextView);
      viewRef.current = nextView;
      syncUrl(nextView, selectedProvinceIdRef.current);
    },
    [syncUrl],
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
      setSelectedItem(null);
      setViewState(nextRoute.view);
      viewRef.current = nextRoute.view;

      if (nextRoute.provinceId) {
        selectedProvinceIdRef.current = nextRoute.provinceId;
        setSelectedProvinceIdState(nextRoute.provinceId);
      }
    };

    window.addEventListener('popstate', applyLocation);
    return () => window.removeEventListener('popstate', applyLocation);
  }, []);

  // Navigate to province detail, then smooth-scroll to the target section once it mounts.
  // Offsets by the live sticky-header height so the section heading isn't hidden behind it.
  const scrollToSection = (sectionId: string) => {
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

  const changeHeaderView = (target: string) => {
    if (target === 'spots') {
      setActiveSubView('spots');
      setView('provinces');
    } else if (target === 'blind-travel') {
      setView('blind-travel');
    } else if (target === 'trip-room' || target === 'group-blind-travel') {
      setView('trip-room');
    } else if (
      target === 'profile' || target === 'taxi' || target === 'tours' || target === 'handbook' ||
      target === 'partnership-register' || target === 'admin' || target === 'recently-viewed' ||
      target === 'nearby-places'
    ) {
      setView(target as ViewId);
    } else if (target === 'hotels') {
      setActiveSubView('hotels');
      scrollToSection('hotels-section');
    } else if (target === 'rentals') {
      setActiveSubView('rentals');
      scrollToSection('rentals-section');
    } else if (target === 'experiences') {
      setActiveSubView('experiences');
      scrollToSection('experiences-section');
    }
  };

  const value: UIValue = {
    view,
    setView,
    activeSubView,
    setActiveSubView,
    allServicesTab,
    setAllServicesTab,
    selectedProvinceId,
    setSelectedProvinceId,
    selectProvince: (id) => {
      selectedProvinceIdRef.current = id;
      setSelectedProvinceIdState(id);
      setActiveSubView('spots');
      setSelectedItem(null);
      setViewState('province');
      viewRef.current = 'province';
      syncUrl('province', id);
    },
    navigateHome: () => setView('regions'),
    scrollToSection,
    changeHeaderView,
    selectedItem,
    viewItem: (item) => {
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
