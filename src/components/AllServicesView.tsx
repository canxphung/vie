/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Star, Search, SlidersHorizontal, ArrowUpDown, MapPin, Bike, Car, Hotel, Compass, ArrowLeft, CheckCircle2, Heart } from 'lucide-react';
import { Province, Attraction, Hotel as HotelType, Activity, Vehicle, BookingCartItem, Language } from '../types';
import { provinces, attractionsByProvince, hotelsByProvince, activitiesByProvince, vehicles, dictionaries } from '../data';

interface AllServicesViewProps {
  language: Language;
  initialTab: 'attractions' | 'hotels' | 'vehicles' | 'activities';
  onBack: () => void;
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (id: string) => void;
  cartItems: BookingCartItem[];
  onViewItem?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
  favorites?: any[];
  onToggleFavorite?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
}

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

  // Selected tab state
  const [activeTab, setActiveTab] = React.useState<'attractions' | 'hotels' | 'vehicles' | 'activities'>(initialTab);

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProvince, setSelectedProvince] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'default' | 'price-asc' | 'price-desc' | 'rating-desc'>('default');
  const [selectedActivityCategory, setSelectedActivityCategory] = React.useState<'all' | 'heritage' | 'culinary' | 'nature' | 'adventure'>('all');

  // Reset filters when switching tabs
  React.useEffect(() => {
    setSearchQuery('');
    setSelectedProvince('all');
    setSortBy('default');
    setSelectedActivityCategory('all');
  }, [activeTab]);

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

  return (
    <div id="all-services-view" className="w-full min-h-screen bg-natural-bg py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation back and header banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-natural-border pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-full bg-white border border-natural-border text-natural-accent hover:bg-natural-beige hover:text-natural-olive transition shadow-xs cursor-pointer flex items-center justify-center"
              id="back-to-home-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-natural-accent block">VietCharm Services</span>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-natural-text">
                {isVi ? 'Danh Mục Toàn Bộ Dịch Vụ Hệ Thống' : 'System Wide Services Catalog'}
              </h1>
            </div>
          </div>

          {/* Quick stats banner */}
          <div className="bg-natural-cream border border-natural-border rounded-2xl p-3 flex gap-6 text-xs text-stone-600">
            <div>
              <span className="font-bold text-natural-accent block text-base leading-none">
                {Object.values(attractionsByProvince).reduce((acc, curr) => acc + curr.length, 0)}
              </span>
              <span>{isVi ? 'Điểm Đến' : 'Attractions'}</span>
            </div>
            <div className="border-l border-stone-200"></div>
            <div>
              <span className="font-bold text-natural-accent block text-base leading-none">
                {Object.values(hotelsByProvince).reduce((acc, curr) => acc + curr.length, 0)}
              </span>
              <span>{isVi ? 'Khách Sạn' : 'Hotels'}</span>
            </div>
            <div className="border-l border-stone-200"></div>
            <div>
              <span className="font-bold text-natural-accent block text-base leading-none">
                {Object.values(activitiesByProvince).reduce((acc, curr) => acc + curr.length, 0)}
              </span>
              <span>{isVi ? 'Trải Nghiệm' : 'Activities'}</span>
            </div>
            <div className="border-l border-stone-200"></div>
            <div>
              <span className="font-bold text-natural-accent block text-base leading-none">{vehicles.length}</span>
              <span>{isVi ? 'Thuê Xe' : 'Vehicles'}</span>
            </div>
          </div>
        </div>

        {/* Categories Tab Navigation exactly styled as premium buttons */}
        <div className="flex flex-wrap gap-2.5 border-b border-natural-border pb-4">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'attractions'
                ? 'bg-natural-accent text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-natural-cream'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isVi ? 'Điểm Đến Nổi Bật' : 'Featured Spots'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'hotels'
                ? 'bg-natural-accent text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-natural-cream'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>{isVi ? 'Khách Sạn Ưa Thích' : 'Loved Hotels'}</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-natural-accent text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-natural-cream'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{isVi ? 'Hoạt Động & Trải Nghiệm' : 'Experiences & Tours'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-natural-accent text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-natural-cream'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{isVi ? 'Dịch Vụ Cho Thuê Xe' : 'Vehicle Rentals'}</span>
          </button>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="bg-natural-cream border border-natural-border p-4 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
              {isVi ? 'Tìm kiếm tên dịch vụ hoặc địa điểm:' : 'Search service name or keyword:'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVi ? 'Nhập tên, mô tả...' : 'Type name, location...'}
                className="w-full bg-white border border-stone-200 rounded-xl py-2 px-9 text-xs focus:outline-none focus:border-natural-accent"
              />
            </div>
          </div>

          {/* Province Filter (Only applicable for non-vehicles) */}
          {activeTab !== 'vehicles' ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                {isVi ? 'Bộ lọc theo tỉnh miền Trung:' : 'Filter by Province:'}
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-natural-accent"
              >
                <option value="all">{isVi ? 'Tất cả các tỉnh thành' : 'All Provinces'}</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Motorbike vs Car type filter for vehicles */
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                {isVi ? 'Thời gian thuê tối thiểu:' : 'Rental Duration:'}
              </label>
              <div className="text-xs bg-white border border-stone-200 rounded-xl py-2 px-3 text-stone-500 font-medium">
                {isVi ? 'Không giới hạn ngày thuê' : 'Unlimited rental days'}
              </div>
            </div>
          )}

          {/* Sort option */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
              {isVi ? 'Sắp xếp hiển thị:' : 'Sort by:'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-natural-accent"
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

        {/* Specialized Activities Categories filter (Horizontal bars) */}
        {activeTab === 'activities' && (
          <div className="bg-white border border-stone-200 p-3 rounded-2xl flex flex-wrap gap-2 items-center text-xs">
            <span className="font-bold text-stone-500 uppercase mr-2">{isVi ? 'Chủ đề trải nghiệm:' : 'Experience Theme:'}</span>
            {[
              { id: 'all', label: isVi ? 'Tất cả' : 'All' },
              { id: 'heritage', label: isVi ? 'Di sản & Văn hóa' : 'Heritage' },
              { id: 'culinary', label: isVi ? 'Lớp học Ẩm thực' : 'Culinary' },
              { id: 'nature', label: isVi ? 'Sinh thái & Làng quê' : 'Eco-Nature' },
              { id: 'adventure', label: isVi ? 'Phiêu lưu & Lặn biển' : 'Adventure' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedActivityCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  selectedActivityCategory === cat.id
                    ? 'bg-natural-accent text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Display grids according to selected tab */}
        
        {/* TAB 1: ATTRACTIONS GRID */}
        {activeTab === 'attractions' && (
          <div>
            {filteredAttractions.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAttractions.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() =>
                      onViewItem?.({
                        id: spot.id,
                        type: 'nearby-place',
                        name: spot.name,
                        image: spot.image,
                        price: 0, // Attractions are non-price spots but fully viewable
                        description: spot.description,
                      })
                    }
                    className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200 hover:border-natural-accent transition duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={spot.image} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
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
          </div>
        )}

        {/* TAB 2: HOTELS GRID */}
        {activeTab === 'hotels' && (
          <div>
            {filteredHotels.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredHotels.map((hotel) => {
                  const inCart = isItemInCart(hotel.id);
                  return (
                    <div
                      key={hotel.id}
                      onClick={() =>
                        onViewItem?.({
                          id: hotel.id,
                          type: 'hotel',
                          name: hotel.name,
                          image: hotel.image,
                          price: hotel.pricePerNight,
                          description: hotel.description,
                        })
                      }
                      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200 hover:border-natural-accent transition duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition" />
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
                          <p className="text-[11px] text-natural-text/80 line-clamp-3 mt-1 leading-relaxed">
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
          </div>
        )}

        {/* TAB 3: EXPERIENCES / ACTIVITIES GRID */}
        {activeTab === 'activities' && (
          <div>
            {filteredActivities.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredActivities.map((act) => {
                  const inCart = isItemInCart(act.id);
                  return (
                    <div
                      key={act.id}
                      onClick={() =>
                        onViewItem?.({
                          id: act.id,
                          type: 'activity',
                          name: act.name,
                          image: act.image,
                          price: act.price,
                          description: act.description,
                        })
                      }
                      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200 hover:border-natural-accent transition duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img src={act.image} alt={act.name} className="w-full h-full object-cover hover:scale-105 transition" />
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
                          <p className="text-[11px] text-natural-text/80 line-clamp-3 mt-1 leading-relaxed">
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
          </div>
        )}

        {/* TAB 4: VEHICLE RENTALS GRID */}
        {activeTab === 'vehicles' && (
          <div>
            {filteredVehicles.length === 0 ? (
              <NoResults isVi={isVi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((veh) => {
                  const inCart = isItemInCart(veh.id);
                  return (
                    <div
                      key={veh.id}
                      onClick={() =>
                        onViewItem?.({
                          id: veh.id,
                          type: 'vehicle',
                          name: veh.name,
                          image: veh.image,
                          price: veh.pricePerDay,
                          description: veh.specs,
                        })
                      }
                      className="bg-white rounded-3xl overflow-hidden shadow-xs border border-natural-border p-4 hover:shadow-lg hover:border-natural-accent transition flex gap-4 items-center cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-natural-beige relative">
                        <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
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
          </div>
        )}

      </div>
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
