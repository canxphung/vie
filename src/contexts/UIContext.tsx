/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { ViewableItem } from '@/types';
import type { ViewId, SubView, ServiceTab } from '@/constants/views';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [view, setView] = React.useState<ViewId>('regions');
  const [activeSubView, setActiveSubView] = React.useState<SubView>('spots');
  const [allServicesTab, setAllServicesTab] = React.useState<ServiceTab>('attractions');
  const [selectedProvinceId, setSelectedProvinceId] = React.useState('quang-nam');
  const [selectedItem, setSelectedItem] = React.useState<ViewableItem | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.recentlyViewed, []);
  const [favorites, setFavorites] = useLocalStorage<ViewableItem[]>(STORAGE_KEYS.favorites, []);

  // Navigate to province detail, then smooth-scroll to the target section once it mounts.
  const scrollToSection = (sectionId: string) => {
    setView('province');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 150);
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
      if (view !== 'province') {
        setView('province');
        setTimeout(() => scrollToSection('hotels-section'), 300);
      } else {
        scrollToSection('hotels-section');
      }
    } else if (target === 'rentals') {
      setActiveSubView('rentals');
      if (view !== 'province') {
        setView('province');
        setTimeout(() => scrollToSection('rentals-section'), 300);
      } else {
        scrollToSection('rentals-section');
      }
    } else if (target === 'experiences') {
      setActiveSubView('experiences');
      if (view !== 'province') {
        setView('province');
        setTimeout(() => scrollToSection('experiences-section'), 300);
      } else {
        scrollToSection('experiences-section');
      }
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
      setSelectedProvinceId(id);
      setActiveSubView('spots');
      setView('province');
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
