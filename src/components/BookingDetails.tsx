/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hotel, Activity, Vehicle, Review, Language, BookingCartItem } from '../types';
import { hotelsByProvince, activitiesByProvince, vehicles, reviews as initialReviews, dictionaries } from '../data';
import { Star, MapPin, Bike, Car, CheckCircle2, ThumbsUp, Send, User, ChevronRight, Compass, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingDetailsProps {
  language: Language;
  provinceId: string;
  onAddToCart: (item: BookingCartItem) => void;
  cartItems: BookingCartItem[];
  onRemoveFromCart: (id: string) => void;
  onViewItem?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
  onViewAllServices?: (tab: 'hotels' | 'vehicles' | 'activities') => void;
  favorites?: any[];
  onToggleFavorite?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
}

export default function BookingDetails({
  language,
  provinceId,
  onAddToCart,
  cartItems,
  onRemoveFromCart,
  onViewItem,
  onViewAllServices,
  favorites = [],
  onToggleFavorite,
}: BookingDetailsProps) {
  const isVi = language === 'vi';
  const t = dictionaries[language];

  // Retrieve province data safely
  const hotels = hotelsByProvince[provinceId] || [];
  const activities = activitiesByProvince[provinceId] || [];

  // Local state for Category & Price/Budget Filters
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'heritage' | 'culinary' | 'nature' | 'adventure'>('all');
  const [selectedPriceTier, setSelectedPriceTier] = React.useState<'all' | 'under-200k' | '200k-500k' | 'over-500k'>('all');

  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      // Category mapping based on ID
      let catType = 'heritage';
      if (act.id.includes('cooking') || act.id.includes('food')) {
        catType = 'culinary';
      } else if (act.id.includes('bike') || act.id.includes('village') || act.id.includes('pottery')) {
        catType = 'nature';
      } else if (act.id.includes('cham') || act.id.includes('island') || act.id.includes('adventure')) {
        catType = 'adventure';
      }

      const matchesCat = selectedCategory === 'all' || catType === selectedCategory;

      let priceTier = 'under-200k';
      if (act.price > 500000) {
        priceTier = 'over-500k';
      } else if (act.price >= 200000) {
        priceTier = '200k-500k';
      }

      const matchesPrice = selectedPriceTier === 'all' || priceTier === selectedPriceTier;

      return matchesCat && matchesPrice;
    });
  }, [activities, selectedCategory, selectedPriceTier]);

  // Local state for interactive and dynamic reviews submission
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [newAuthor, setNewAuthor] = React.useState('');
  const [newComment, setNewComment] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const addedReview: Review = {
      id: `custom-rev-${Date.now()}`,
      author: newAuthor.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment.trim(),
      locale: language
    };

    setReviews([addedReview, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
  };

  const isItemInCart = (id: string) => {
    return cartItems.some((item) => item.id === id);
  };

  return (
    <div className="w-full bg-[#FDFCF8] py-14 px-4 space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Section: HOTELS (Khách sạn được yêu thích) in exact photo layout */}
        <section id="hotels-section" className="scroll-mt-20">
          <div className="flex justify-between items-end border-b border-[#E6E2D3] pb-4 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#4A4A35] tracking-tight uppercase">
                {t.lovedHotels}
              </h3>
              <p className="text-[#4A4A35]/70 text-xs mt-1">
                {t.hotelSubtitle}
              </p>
            </div>
            <span 
              onClick={() => onViewAllServices?.('hotels')}
              className="text-xs font-bold text-[#8C7A5B] hover:text-[#5A5A40] transition flex items-center gap-1 cursor-pointer"
            >
              {isVi ? 'Xem tất cả' : 'View all'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => {
              const inCart = isItemInCart(hotel.id);
              return (
                <div 
                  key={hotel.id} 
                  onClick={() => onViewItem?.({
                    id: hotel.id,
                    type: 'hotel',
                    name: hotel.name,
                    image: hotel.image,
                    price: hotel.pricePerNight,
                    description: hotel.description
                  })}
                  className="bg-[#F9F7F2] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-[#E6E2D3] hover:border-[#8C7A5B] transition duration-300 flex flex-col justify-between cursor-pointer"
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
                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#FDFCF8]/95 backdrop-blur-md flex items-center justify-center shadow-sm border border-[#E6E2D3] hover:scale-110 transition group/fav cursor-pointer z-10"
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
                    <div className="absolute top-3 right-3 bg-[#FDFCF8]/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#4A4A35] flex items-center gap-0.5 shadow-sm border border-[#E6E2D3]">
                      <Star className="w-3.5 h-3.5 fill-[#E3B04B] stroke-[#E3B04B]" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif font-bold text-[#4A4A35] text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                        {hotel.name}
                      </h4>
                      <p className="text-[11px] text-[#4A4A35]/80 line-clamp-2 mt-1 min-h-[32px]">
                        {hotel.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E6E2D3] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C7A5B] block mb-0.5">{isVi ? 'GIÁ CHỈ TỪ' : 'FROM ONLY'}</span>
                        <span className="font-mono font-black text-[#8C7A5B] text-sm">
                          {hotel.pricePerNight.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-[#4A4A35]/60">{t.perNight}</span>
                      </div>

                      {inCart ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCart(hotel.id);
                          }}
                          className="bg-[#F5F2ED] hover:bg-[#E6E2D3] text-[#4A4A35] px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-[#E6E2D3] cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isVi ? 'Đã thêm' : 'In Bundle'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: hotel.id,
                              type: 'hotel',
                              name: hotel.name,
                              price: hotel.pricePerNight,
                              quantity: 1,
                              image: hotel.image
                            });
                            onViewItem?.({
                              id: hotel.id,
                              type: 'hotel',
                              name: hotel.name,
                              image: hotel.image,
                              price: hotel.pricePerNight,
                              description: hotel.description
                            });
                          }}
                          className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition shadow-xs cursor-pointer"
                        >
                          {isVi ? 'Nhận phòng' : 'Book Room'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: RENTALS (Cho thuê ô tô, xe máy) - requested feature */}
        <section id="rentals-section" className="scroll-mt-20">
          <div className="flex justify-between items-end border-b border-[#E6E2D3] pb-4 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#4A4A35] tracking-tight uppercase">
                {t.rentVehicles}
              </h3>
              <p className="text-[#4A4A35]/70 text-xs mt-1">
                {isVi ? 'Hệ thống cho thuê xe tự lái hoặc xe kèm tài xế an toàn bảo mật tuyệt đối' : 'Highly reliable private car transits & daily scooters'}
              </p>
            </div>
            <span 
              onClick={() => onViewAllServices?.('vehicles')}
              className="text-xs font-bold text-[#8C7A5B] hover:text-[#5A5A40] transition flex items-center gap-1 cursor-pointer"
            >
              {isVi ? 'Xem tất cả' : 'View all'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((veh) => {
              const inCart = isItemInCart(veh.id);
              return (
                <div 
                  key={veh.id} 
                  onClick={() => onViewItem?.({
                    id: veh.id,
                    type: 'vehicle',
                    name: veh.name,
                    image: veh.image,
                    price: veh.pricePerDay,
                    description: veh.specs
                  })}
                  className="bg-[#F9F7F2] rounded-3xl overflow-hidden shadow-xs border border-[#E6E2D3] p-4 hover:shadow-lg hover:border-[#8C7A5B] transition flex gap-4 items-center cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F5F2ED] relative">
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
                      <h4 className="font-serif font-bold text-[#4A4A35] text-xs md:text-sm tracking-tight leading-snug">
                        {veh.name}
                      </h4>
                      <p className="text-[10px] text-[#4A4A35]/75 leading-relaxed line-clamp-1">
                        {veh.specs}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#E6E2D3]">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#8C7A5B]">
                          {veh.pricePerDay.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-[#4A4A35]/60">/{isVi ? 'ngày' : 'day'}</span>
                      </div>

                      {inCart ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCart(veh.id);
                          }}
                          className="bg-[#F5F2ED] hover:bg-[#E6E2D3] text-[#4A4A35] px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-[#E6E2D3] transition cursor-pointer"
                        >
                          {isVi ? 'Bỏ chọn' : 'Remove'}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: veh.id,
                              type: 'vehicle',
                              name: veh.name,
                              price: veh.pricePerDay,
                              quantity: 1,
                              image: veh.image,
                              details: isVi ? 'Phương tiện tự chọn' : 'Custom transport design'
                            });
                            onViewItem?.({
                              id: veh.id,
                              type: 'vehicle',
                              name: veh.name,
                              image: veh.image,
                              price: veh.pricePerDay,
                              description: veh.specs
                            });
                          }}
                          className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition shadow-xs cursor-pointer"
                        >
                          {isVi ? 'Chọn thuê' : 'Rent Vehicle'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: EXPERIENCES (Hoạt động & Trải nghiệm) in exact photo layout */}
        <section id="experiences-section" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#E6E2D3] pb-4 mb-8 gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#4A4A35] tracking-tight uppercase">
                {t.activitiesTitle}
              </h3>
              <p className="text-[#4A4A35]/70 text-xs mt-1">
                {t.activitiesSubtitle}
              </p>
            </div>
            
            {/* Quick stats indicator */}
            <div className="flex items-center gap-3">
              <span 
                onClick={() => onViewAllServices?.('activities')}
                className="text-xs font-bold text-[#8C7A5B] hover:text-[#5A5A40] transition flex items-center gap-1 cursor-pointer"
              >
                {isVi ? 'Xem tất cả' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-xs bg-[#F5F2ED] border border-[#E6E2D3] text-[#8C7A5B] px-3.5 py-1.5 rounded-full font-bold">
                {isVi ? `Tìm thấy ${filteredActivities.length} hoạt động` : `Found ${filteredActivities.length} activities`}
              </span>
            </div>
          </div>

          {/* Interactive filter and category bar */}
          <div className="bg-[#FAF8F5] border border-[#E6E2D3] p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            {/* Category selection */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-500 uppercase block tracking-wider">{isVi ? 'Phân loại chủ đề' : 'Filter by Theme'}</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: isVi ? 'Tất cả' : 'All' },
                  { id: 'heritage', label: isVi ? 'Di sản & Văn hóa' : 'Heritage' },
                  { id: 'culinary', label: isVi ? 'Lớp học Ẩm thực' : 'Culinary' },
                  { id: 'nature', label: isVi ? 'Sinh thái & Làng quê' : 'Eco-Nature' },
                  { id: 'adventure', label: isVi ? 'Phiêu lưu & Lặn biển' : 'Adventure' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      selectedCategory === cat.id 
                        ? 'bg-[#8C7A5B] text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-150'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget price tier selection */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-500 uppercase block tracking-wider">{isVi ? 'Lọc theo giá vé' : 'Filter by Budget'}</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: isVi ? 'Mọi ngân sách' : 'Any Budget' },
                  { id: 'under-200k', label: isVi ? 'Dưới 200,000đ' : 'Under 200k' },
                  { id: '200k-500k', label: isVi ? '200,000đ - 500,000đ' : '200k - 500k' },
                  { id: 'over-500k', label: isVi ? 'Trên 500,000đ' : 'Over 500k' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedPriceTier(tier.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      selectedPriceTier === tier.id 
                        ? 'bg-[#8C7A5B] text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-150'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-10 bg-[#FAF8F5] border border-dashed border-[#E6E2D3] rounded-3xl text-xs text-stone-400">
              <Compass className="w-8 h-8 mx-auto text-stone-300 mb-2 animate-spin" />
              <p>{isVi ? 'Không có hoạt động nào phù hợp bộ lọc hiện tại. Thử chọn lại chủ đề hoặc ngân sách khác!' : 'No activities match the current filters. Expand your budget or category.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {filteredActivities.map((act) => {
                const inCart = isItemInCart(act.id);
                return (
                  <div 
                    key={act.id} 
                    onClick={() => onViewItem?.({
                      id: act.id,
                      type: 'activity',
                      name: act.name,
                      image: act.image,
                      price: act.price,
                      description: act.description
                    })}
                    className="bg-[#F9F7F2] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-[#E6E2D3] hover:border-[#8C7A5B] transition duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-36 overflow-hidden">
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
                          className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                          title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                        >
                          <Heart 
                            className={`w-3.5 h-3.5 transition duration-200 ${
                              favorites.some(x => x.id === act.id) 
                                ? 'text-rose-600 fill-rose-600' 
                                : 'text-stone-400 group-hover/fav:text-rose-500'
                            }`} 
                          />
                        </button>
                      )}
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-serif font-bold text-[#4A4A35] text-xs tracking-tight leading-snug line-clamp-2 min-h-[34px]">
                          {act.name}
                        </h4>
                        <p className="text-[10px] text-[#4A4A35]/80 line-clamp-2 mt-0.5 min-h-[28px]">
                          {act.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E6E2D3] flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#8C7A5B] block">
                            {act.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>

                        {inCart ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromCart(act.id);
                            }}
                            className="bg-[#F5F2ED] text-[#4A4A35] px-2 py-1 rounded text-[10px] font-bold border border-[#E6E2D3] transition cursor-pointer"
                          >
                            {isVi ? 'Đã thêm' : 'Added'}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart({
                                id: act.id,
                                type: 'activity',
                                name: act.name,
                                price: act.price,
                                quantity: 1,
                                image: act.image
                              });
                              onViewItem?.({
                                id: act.id,
                                type: 'activity',
                                name: act.name,
                                image: act.image,
                                price: act.price,
                                description: act.description
                              });
                            }}
                            className="bg-[#8C7A5B]/10 hover:bg-[#8C7A5B]/20 text-[#8C7A5B] px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            {isVi ? 'Đặt vé' : 'Book Ticket'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section: CUSTOMER REVIEWS & FEEDBACK (Đánh giá từ khách hàng) */}
        <section id="reviews-section" className="bg-[#F5F2ED] border border-[#E6E2D3] p-6 md:p-8 rounded-3xl">
          <div className="mb-8 font-serif">
            <h3 className="text-xl md:text-2xl font-bold text-[#4A4A35] uppercase">
              {isVi ? 'Hồi âm từ Lữ Khách' : 'Reviews From Heritage Travelers'}
            </h3>
            <p className="text-[#4A4A35]/80 text-xs mt-1">
              {isVi ? 'Đánh giá chân thực từ khách hàng đã trải nghiệm hệ bóc tách combo tối ưu thời gian thực của VietCharm.' : 'Real verified feedback expressing travel satisfaction.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews display list */}
            <div className="lg:col-span-7 space-y-4">
              <AnimatePresence initial={false}>
                {reviews
                  .filter((r) => r.locale === language)
                  .map((rev) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#FDFCF8] p-5 rounded-3xl border border-[#E6E2D3] shadow-xs flex gap-4"
                    >
                      <img src={rev.avatar} alt="User Avatar" className="w-10 h-10 rounded-full shrink-0 object-cover border border-[#E6E2D3]" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xs font-bold text-[#4A4A35]">{rev.author}</h5>
                            <div className="flex gap-0.5 mt-0.5">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-[#E3B04B] stroke-[#E3B04B]" />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">{rev.date}</span>
                        </div>
                        <p className="text-[#4A4A35]/85 text-xs leading-relaxed mt-2.5">
                          {rev.comment}
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-[#8C7A5B] font-bold hover:text-[#5A5A40] cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Hữu ích: Thích (12)' : 'Helpful (12)'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {/* Interactive review submission form */}
            <div className="lg:col-span-5 bg-[#FDFCF8] p-6 rounded-3xl border border-[#E6E2D3] shadow-md">
              <h4 className="text-sm font-serif font-bold text-[#4A4A35] border-b border-[#E6E2D3] pb-2 mb-4 uppercase">
                {isVi ? 'Đóng góp ý kiến của bạn' : 'Express Your Feedback'}
              </h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A35]/90 mb-1">{isVi ? 'Họ tên lữ khách' : 'Your name'}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder={isVi ? 'Ex: Hoàng Minh' : 'Enter name...'}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-[#F9F7F2] border border-[#E6E2D3] rounded-xl focus:ring-1 focus:ring-[#8C7A5B] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A35]/90 mb-1">{isVi ? 'Mức độ hài lòng' : 'Rating scale'}</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`p-1 rounded-full transition ${newRating >= star ? 'text-[#E3B04B]' : 'text-[#E6E2D3]'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A35]/90 mb-1">{isVi ? 'Cảm nghĩ hành trình' : 'Detailed comments'}</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isVi ? 'Chia sẻ trải nghiệm sử dụng tính năng chỉ đường, thuê xe tự lái và combo AI tại Việt Charm...' : 'Express your journey detailed commentary...'}
                    rows={4}
                    className="w-full text-xs p-3 bg-[#F9F7F2] border border-[#E6E2D3] rounded-xl focus:ring-1 focus:ring-[#8C7A5B] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isVi ? 'Gửi đánh giá' : 'Submit Review'}</span>
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
