/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Search, SlidersHorizontal, ArrowUpDown, MapPin, Bike, Car, Compass, ArrowLeft, CheckCircle2, Heart, ChevronDown } from 'lucide-react';
import { Province, Attraction, Hotel as HotelType, Activity, Vehicle, BookingCartItem, Language, ViewableItem } from '../types';
import { provinces, attractionsByProvince, hotelsByProvince, activitiesByProvince, vehicles, dictionaries } from '../data';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { clickableCardProps } from '@/lib/a11y';

interface AllServicesViewProps {
  language: Language;
  initialTab: 'attractions' | 'hotels' | 'vehicles' | 'activities';
  onBack: () => void;
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (id: string) => void;
  cartItems: BookingCartItem[];
  onViewItem?: (item: ViewableItem) => void;
  favorites?: ViewableItem[];
  onToggleFavorite?: (item: ViewableItem) => void;
}

type SortBy = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';
type ActivityCategory = 'all' | 'heritage' | 'culinary' | 'nature' | 'adventure';

export default function AllServicesView({
  language,
  initialTab,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  cartItems,
  onViewItem,
  favorites = [],
  onToggleFavorite,
}: AllServicesViewProps) {
  const isVi = language === 'vi';
  const t = dictionaries[language];

  const activeTab = initialTab;

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProvince, setSelectedProvince] = React.useState<string>('all');
  const [isProvinceMenuOpen, setIsProvinceMenuOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortBy>('default');
  const [selectedActivityCategory, setSelectedActivityCategory] = React.useState<ActivityCategory>('all');
  const provinceMenuRef = React.useRef<HTMLDivElement>(null);

  // How many cards to show before the "Show more" button (avoids dumping the whole list).
  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  // Reset filters when switching tabs
  React.useEffect(() => {
    setSearchQuery('');
    setSelectedProvince('all');
    setIsProvinceMenuOpen(false);
    setSortBy('default');
    setSelectedActivityCategory('all');
  }, [activeTab]);

  React.useEffect(() => {
    if (!isProvinceMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!provinceMenuRef.current?.contains(event.target as Node)) {
        setIsProvinceMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isProvinceMenuOpen]);

  // Collapse back to the first page whenever the tab or any filter changes.
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, searchQuery, selectedProvince, sortBy, selectedActivityCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('all');
    setIsProvinceMenuOpen(false);
    setSortBy('default');
    setSelectedActivityCategory('all');
  };

  const selectedProvinceLabel =
    selectedProvince === 'all'
      ? (isVi ? 'Tất cả các tỉnh thành' : 'All Provinces')
      : provinces.find((prov) => prov.id === selectedProvince)?.name || selectedProvince;

  const isItemInCart = (id: string) => {
    return cartItems.some((item) => item.id === id);
  };

  // 1. Gather & Filter All Attractions
  const filteredAttractions = React.useMemo(() => {
    let list: (Attraction & { provinceName: string; provinceId: string })[] = [];
    Object.keys(attractionsByProvince).forEach((provId) => {
      const provName = provinces.find((p) => p.id === provId)?.name || provId;
      attractionsByProvince[provId].forEach((attr) => {
        list.push({ ...attr, provinceName: provName, provinceId: provId });
      });
    });

    if (selectedProvince !== 'all') {
      list = list.filter((item) => item.provinceId === selectedProvince);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedProvince, searchQuery, sortBy]);

  // 2. Gather & Filter All Hotels
  const filteredHotels = React.useMemo(() => {
    let list: (HotelType & { provinceName: string; provinceId: string })[] = [];
    Object.keys(hotelsByProvince).forEach((provId) => {
      const provName = provinces.find((p) => p.id === provId)?.name || provId;
      hotelsByProvince[provId].forEach((hotel) => {
        list.push({ ...hotel, provinceName: provName, provinceId: provId });
      });
    });

    if (selectedProvince !== 'all') {
      list = list.filter((item) => item.provinceId === selectedProvince);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedProvince, searchQuery, sortBy]);

  // 3. Gather & Filter All Vehicles
  const filteredVehicles = React.useMemo(() => {
    let list = [...vehicles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(q) || item.specs.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [searchQuery, sortBy]);

  // 4. Gather & Filter All Activities
  const filteredActivities = React.useMemo(() => {
    let list: (Activity & { provinceName: string; provinceId: string })[] = [];
    Object.keys(activitiesByProvince).forEach((provId) => {
      const provName = provinces.find((p) => p.id === provId)?.name || provId;
      activitiesByProvince[provId].forEach((act) => {
        list.push({ ...act, provinceName: provName, provinceId: provId });
      });
    });

    if (selectedProvince !== 'all') {
      list = list.filter((item) => item.provinceId === selectedProvince);
    }

    if (selectedActivityCategory !== 'all') {
      list = list.filter((act) => {
        let catType = 'heritage';
        if (act.id.includes('cooking') || act.id.includes('food')) {
          catType = 'culinary';
        } else if (act.id.includes('bike') || act.id.includes('village') || act.id.includes('pottery')) {
          catType = 'nature';
        } else if (act.id.includes('cham') || act.id.includes('island') || act.id.includes('adventure')) {
          catType = 'adventure';
        }
        return catType === selectedActivityCategory;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedProvince, selectedActivityCategory, searchQuery, sortBy]);

  const resultCount =
    activeTab === 'attractions' ? filteredAttractions.length
    : activeTab === 'hotels' ? filteredHotels.length
    : activeTab === 'activities' ? filteredActivities.length
    : filteredVehicles.length;

  React.useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEYS.returnTarget);
      if (!raw) return;

      const target = JSON.parse(raw) as { view?: string; tab?: string; itemId?: string };
      if (target.view !== 'all-services' || target.tab !== activeTab || !target.itemId) return;

      const currentList: Array<{ id: string }> =
        activeTab === 'attractions'
          ? filteredAttractions
          : activeTab === 'hotels'
            ? filteredHotels
            : activeTab === 'activities'
              ? filteredActivities
              : filteredVehicles;
      const index = currentList.findIndex((item) => item.id === target.itemId);
      if (index >= visibleCount) {
        setVisibleCount(Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE);
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEYS.returnTarget);
    }
  }, [activeTab, filteredAttractions, filteredHotels, filteredActivities, filteredVehicles, visibleCount]);

  return (
    <div id="all-services-view" className="w-full min-h-screen bg-natural-bg py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-natural-border bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-natural-accent shadow-xs transition hover:bg-natural-beige hover:text-natural-olive cursor-pointer"
            id="back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Quay lại' : 'Back'}</span>
          </button>
        </div>

        {/* Layout: filter sidebar (left) + results column (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">

          {/* Filter Sidebar */}
          <aside className="self-start rounded-3xl border border-natural-border bg-natural-cream p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-serif text-base font-black text-natural-text">
                <SlidersHorizontal className="w-4 h-4 text-natural-accent" />
                {isVi ? 'Bộ lọc' : 'Filters'}
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold uppercase tracking-wide text-stone-400 transition hover:text-natural-accent cursor-pointer"
              >
                {isVi ? 'Đặt lại' : 'Reset'}
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Search Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                  {isVi ? 'Tìm kiếm' : 'Search'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isVi ? 'Nhập tên, mô tả...' : 'Type name, location...'}
                    className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-9 text-sm focus:outline-none focus:border-natural-accent"
                  />
                </div>
              </div>

              {/* Province Filter (not applicable for vehicles, which are not province-bound) */}
              {activeTab !== 'vehicles' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                    {isVi ? 'Tỉnh thành' : 'Province'}
                  </label>
                  <div ref={provinceMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProvinceMenuOpen((open) => !open)}
                      className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-left text-sm text-natural-text transition hover:border-natural-accent focus:outline-none focus:border-natural-accent cursor-pointer"
                      aria-expanded={isProvinceMenuOpen}
                    >
                      <span className="truncate">{selectedProvinceLabel}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${isProvinceMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isProvinceMenuOpen && (
                      <div className="mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-luxe-lg">
                        <div className="max-h-60 overflow-y-auto p-1.5">
                          {[{ id: 'all', name: isVi ? 'Tất cả các tỉnh thành' : 'All Provinces' }, ...provinces].map((prov) => {
                            const isActive = selectedProvince === prov.id;
                            return (
                              <button
                                key={prov.id}
                                type="button"
                                onClick={() => {
                                  setSelectedProvince(prov.id);
                                  setIsProvinceMenuOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition cursor-pointer ${
                                  isActive
                                    ? 'bg-natural-accent text-white'
                                    : 'text-natural-text hover:bg-natural-beige'
                                }`}
                              >
                                <span className="truncate">{prov.name}</span>
                                {isActive && <CheckCircle2 className="h-4 w-4" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specialized Activities theme filter */}
              {activeTab === 'activities' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                    {isVi ? 'Chủ đề trải nghiệm' : 'Experience Theme'}
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', label: isVi ? 'Tất cả' : 'All' },
                      { id: 'heritage', label: isVi ? 'Di sản & Văn hóa' : 'Heritage' },
                      { id: 'culinary', label: isVi ? 'Lớp học Ẩm thực' : 'Culinary' },
                      { id: 'nature', label: isVi ? 'Sinh thái & Làng quê' : 'Eco-Nature' },
                      { id: 'adventure', label: isVi ? 'Phiêu lưu & Lặn biển' : 'Adventure' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedActivityCategory(cat.id as ActivityCategory)}
                        className={`w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition cursor-pointer ${
                          selectedActivityCategory === cat.id
                            ? 'bg-natural-accent text-white'
                            : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Results column */}
          <div className="min-w-0 space-y-6">

            {/* Top bar: result count + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-natural-border bg-white px-4 py-3 shadow-xs">
              <p className="text-sm text-stone-500">
                {isVi ? 'Kết quả: ' : 'Results: '}
                <span className="font-black text-natural-accent">{resultCount}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="hidden text-[11px] font-bold uppercase tracking-wide text-stone-400 sm:inline">
                  {isVi ? 'Sắp xếp theo' : 'Sort by'}
                </span>
                <div className="relative">
                  <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-white border border-stone-200 rounded-xl py-2 pl-8 pr-3 text-xs font-semibold focus:outline-none focus:border-natural-accent cursor-pointer"
                  >
                    <option value="default">{isVi ? 'Mặc định phổ biến' : 'Popularity / Default'}</option>
                    {activeTab !== 'attractions' && (
                      <>
                        <option value="price-asc">{isVi ? 'Giá tiền: Thấp đến Cao' : 'Price: Low to High'}</option>
                        <option value="price-desc">{isVi ? 'Giá tiền: Cao đến Thấp' : 'Price: High to Low'}</option>
                      </>
                    )}
                    <option value="rating-desc">{isVi ? 'Đánh giá: Cao nhất' : 'Rating: Top Rated'}</option>
                  </select>
                </div>
              </div>
            </div>

        {/* Display grids according to selected tab */}

        {/* TAB 1: ATTRACTIONS GRID */}
        {activeTab === 'attractions' && (
          <div>
            {filteredAttractions.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAttractions.slice(0, visibleCount).map((spot) => (
                  <div
                    key={spot.id}
                    {...clickableCardProps(() =>
                      onViewItem?.({
                        id: spot.id,
                        type: 'nearby-place',
                        name: spot.name,
                        image: spot.image,
                        price: 0, // Attractions are non-price spots but fully viewable
                        description: spot.description,
                      })
                    )}
                    className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-luxe-lg border border-stone-200 hover:border-natural-gold/45 transition duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={spot.image} alt={spot.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition duration-[600ms] ease-out group-hover:scale-110" />
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite({
                              id: spot.id,
                              type: 'nearby-place',
                              name: spot.name,
                              image: spot.image,
                              price: 0,
                              description: spot.description
                            });
                          }}
                          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                          title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                        >
                          <Heart 
                            className={`w-4 h-4 transition duration-200 ${
                              favorites.some(x => x.id === spot.id) 
                                ? 'text-rose-600 fill-rose-600' 
                                : 'text-stone-400 group-hover/fav:text-rose-500'
                            }`} 
                          />
                        </button>
                      )}
                      <span className="absolute bottom-3 left-3 bg-natural-accent/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.provinceName}</span>
                      </span>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-natural-text flex items-center gap-0.5 border border-natural-border shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span>{spot.rating} ({spot.reviewsCount})</span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif font-bold text-natural-text text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                          {spot.name}
                        </h4>
                        <p className="text-[11px] text-natural-text/80 line-clamp-3 mt-1 leading-relaxed">
                          {spot.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex justify-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-natural-accent">
                          {isVi ? 'Tìm hiểu chi tiết →' : 'Learn more →'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredAttractions.length > visibleCount && (
              <ShowMore isVi={isVi} remaining={filteredAttractions.length - visibleCount} onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
            )}
          </div>
        )}

        {/* TAB 2: HOTELS GRID */}
        {activeTab === 'hotels' && (
          <div>
            {filteredHotels.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.slice(0, visibleCount).map((hotel) => {
                  const inCart = isItemInCart(hotel.id);
                  return (
                    <div
                      key={hotel.id}
                      {...clickableCardProps(() =>
                        onViewItem?.({
                          id: hotel.id,
                          type: 'hotel',
                          name: hotel.name,
                          image: hotel.image,
                          price: hotel.pricePerNight,
                          description: hotel.description,
                        })
                      )}
                      className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-luxe-lg border border-stone-200 hover:border-natural-gold/45 transition duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={hotel.image} alt={hotel.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition duration-[600ms] ease-out group-hover:scale-110" />
                        {onToggleFavorite && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite({
                                id: hotel.id,
                                type: 'hotel',
                                name: hotel.name,
                                image: hotel.image,
                                price: hotel.pricePerNight,
                                description: hotel.description
                              });
                            }}
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                            title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                          >
                            <Heart 
                              className={`w-4 h-4 transition duration-200 ${
                                favorites.some(x => x.id === hotel.id) 
                                  ? 'text-rose-600 fill-rose-600' 
                                  : 'text-stone-400 group-hover/fav:text-rose-500'
                              }`} 
                            />
                          </button>
                        )}
                        <span className="absolute bottom-3 left-3 bg-natural-accent/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{hotel.provinceName}</span>
                        </span>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-natural-text flex items-center gap-0.5 border border-natural-border shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-natural-gold stroke-natural-gold" />
                          <span>{hotel.rating}</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-serif font-bold text-natural-text text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                            {hotel.name}
                          </h4>
                          <p className="text-[11px] text-natural-text/80 line-clamp-2 mt-1 leading-relaxed">
                            {hotel.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-natural-border flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-natural-accent block mb-0.5">{isVi ? 'GIÁ CHỈ TỪ' : 'FROM ONLY'}</span>
                            <span className="font-mono font-black text-natural-accent text-sm">
                              {hotel.pricePerNight.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[10px] text-stone-500">/{isVi ? 'đêm' : 'night'}</span>
                          </div>

                          {inCart ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(hotel.id);
                              }}
                              className="bg-natural-beige hover:bg-stone-200 text-natural-text px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-stone-250 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isVi ? 'Đã chọn' : 'Selected'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewItem?.({
                                  id: hotel.id,
                                  type: 'hotel',
                                  name: hotel.name,
                                  image: hotel.image,
                                  price: hotel.pricePerNight,
                                  description: hotel.description,
                                });
                              }}
                              className="bg-natural-accent hover:bg-natural-olive text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition shadow-xs cursor-pointer"
                            >
                              {isVi ? 'Đặt phòng' : 'Book'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {filteredHotels.length > visibleCount && (
              <ShowMore isVi={isVi} remaining={filteredHotels.length - visibleCount} onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
            )}
          </div>
        )}

        {/* TAB 3: EXPERIENCES / ACTIVITIES GRID */}
        {activeTab === 'activities' && (
          <div>
            {filteredActivities.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.slice(0, visibleCount).map((act) => {
                  const inCart = isItemInCart(act.id);
                  return (
                    <div
                      key={act.id}
                      {...clickableCardProps(() =>
                        onViewItem?.({
                          id: act.id,
                          type: 'activity',
                          name: act.name,
                          image: act.image,
                          price: act.price,
                          description: act.description,
                        })
                      )}
                      className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-luxe-lg border border-stone-200 hover:border-natural-gold/45 transition duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img src={act.image} alt={act.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition duration-[600ms] ease-out group-hover:scale-110" />
                        {onToggleFavorite && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite({
                                id: act.id,
                                type: 'activity',
                                name: act.name,
                                image: act.image,
                                price: act.price,
                                description: act.description
                              });
                            }}
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                            title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                          >
                            <Heart 
                              className={`w-4 h-4 transition duration-200 ${
                                favorites.some(x => x.id === act.id) 
                                  ? 'text-rose-600 fill-rose-600' 
                                  : 'text-stone-400 group-hover/fav:text-rose-500'
                              }`} 
                            />
                          </button>
                        )}
                        <span className="absolute bottom-3 left-3 bg-natural-accent/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{act.provinceName}</span>
                        </span>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-natural-text flex items-center gap-0.5 border border-natural-border shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-natural-gold stroke-natural-gold" />
                          <span>{act.rating} ({act.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-serif font-bold text-natural-text text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                            {act.name}
                          </h4>
                          <p className="text-[11px] text-natural-text/80 line-clamp-2 mt-1 leading-relaxed">
                            {act.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-natural-border flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-natural-accent block mb-0.5">{isVi ? 'VÉ CƠ BẢN' : 'STANDARD PRICE'}</span>
                            <span className="font-mono font-black text-natural-accent text-sm">
                              {act.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          {inCart ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(act.id);
                              }}
                              className="bg-natural-beige hover:bg-stone-200 text-natural-text px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-stone-250 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isVi ? 'Đã thêm' : 'In Cart'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewItem?.({
                                  id: act.id,
                                  type: 'activity',
                                  name: act.name,
                                  image: act.image,
                                  price: act.price,
                                  description: act.description,
                                });
                              }}
                              className="bg-natural-accent hover:bg-natural-olive text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition shadow-xs cursor-pointer"
                            >
                              {isVi ? 'Mua vé' : 'Buy Tickets'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {filteredActivities.length > visibleCount && (
              <ShowMore isVi={isVi} remaining={filteredActivities.length - visibleCount} onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
            )}
          </div>
        )}

        {/* TAB 4: VEHICLE RENTALS GRID */}
        {activeTab === 'vehicles' && (
          <div>
            {filteredVehicles.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.slice(0, visibleCount).map((veh) => {
                  const inCart = isItemInCart(veh.id);
                  return (
                    <div
                      key={veh.id}
                      {...clickableCardProps(() =>
                        onViewItem?.({
                          id: veh.id,
                          type: 'vehicle',
                          name: veh.name,
                          image: veh.image,
                          price: veh.pricePerDay,
                          description: veh.specs,
                        })
                      )}
                      className="group bg-white rounded-3xl overflow-hidden shadow-xs border border-natural-border p-4 hover:shadow-luxe-lg hover:border-natural-gold/45 transition duration-300 ease-out hover:-translate-y-1 flex gap-4 items-center cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-natural-beige relative">
                        <img src={veh.image} alt={veh.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition duration-[600ms] ease-out group-hover:scale-110" />
                        {onToggleFavorite && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite({
                                id: veh.id,
                                type: 'vehicle',
                                name: veh.name,
                                image: veh.image,
                                price: veh.pricePerDay,
                                description: veh.specs
                              });
                            }}
                            className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                            title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                          >
                            <Heart 
                              className={`w-3.5 h-3.5 transition duration-200 ${
                                favorites.some(x => x.id === veh.id) 
                                  ? 'text-rose-600 fill-rose-600' 
                                  : 'text-stone-400 group-hover/fav:text-rose-500'
                              }`} 
                            />
                          </button>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded-full">
                          {veh.type === 'motorbike' ? <Bike className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="font-serif font-bold text-natural-text text-xs md:text-sm tracking-tight leading-snug">
                            {veh.name}
                          </h4>
                          <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                            {veh.specs}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-natural-border">
                          <div>
                            <span className="font-mono text-xs font-bold text-natural-accent block">
                              {veh.pricePerDay.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[9px] text-natural-text/60">/{isVi ? 'ngày' : 'day'}</span>
                          </div>

                          {inCart ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(veh.id);
                              }}
                              className="bg-natural-beige hover:bg-stone-200 text-natural-text px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-stone-250 transition cursor-pointer"
                            >
                              {isVi ? 'Bỏ chọn' : 'Remove'}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewItem?.({
                                  id: veh.id,
                                  type: 'vehicle',
                                  name: veh.name,
                                  image: veh.image,
                                  price: veh.pricePerDay,
                                  description: veh.specs,
                                });
                              }}
                              className="bg-natural-accent hover:bg-natural-olive text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition shadow-xs cursor-pointer"
                            >
                              {isVi ? 'Chọn thuê' : 'Rent'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {filteredVehicles.length > visibleCount && (
              <ShowMore isVi={isVi} remaining={filteredVehicles.length - visibleCount} onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
            )}
          </div>
        )}

          </div>{/* /Results column */}
        </div>{/* /Layout grid */}
      </div>
    </div>
  );
}

// "Show more" button shown when a list has more items than are currently visible
function ShowMore({ isVi, remaining, onClick }: { isVi: boolean; remaining: number; onClick: () => void }) {
  return (
    <div className="flex justify-center pt-8">
      <button
        onClick={onClick}
        className="bg-white border border-natural-border text-natural-accent hover:bg-natural-beige hover:text-natural-olive font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-xs transition cursor-pointer"
      >
        {isVi ? `Xem thêm (${remaining})` : `Show more (${remaining})`}
      </button>
    </div>
  );
}

// Subcomponent for empty results
function NoResults({ isVi }: { isVi: boolean }) {
  return (
    <div className="text-center py-20 bg-white border border-dashed border-natural-border rounded-3xl text-stone-400">
      <Compass className="w-12 h-12 mx-auto text-stone-300 mb-3 animate-pulse" />
      <h3 className="font-bold text-natural-text text-sm mb-1">{isVi ? 'Không tìm thấy kết quả nào' : 'No results found'}</h3>
      <p className="text-xs text-stone-400">{isVi ? 'Vui lòng thử tìm kiếm hoặc điều chỉnh bộ lọc tỉnh thành khác.' : 'Please try custom keywords or other province filters.'}</p>
    </div>
  );
}
