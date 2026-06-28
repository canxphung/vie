/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, MapPin, Phone, Mail, Award, Key, Calendar, ShieldCheck, Database, BarChart3, Plus, Trash2, Check, X, FileText, ClipboardList, Car, Star, Tag, Gift, BookOpen, Compass, Info, CheckCircle2, ChevronRight, Sparkles, Heart } from 'lucide-react';
import type { Language, BookingCartItem, UserAccount, PartnershipApplication, PromoVoucher, SystemBooking, ViewableItem } from '@/types';
import { TOURIST_LOCATIONS } from '@/constants/seed/touristLocations';
import { PREDEFINED_COMBOS } from '@/constants/seed/tourCombos';

// 4. COMPONENT: DEDICATED TOUR COMBOS PACKAGES
// ==========================================
interface TourCombosProps {
  language: Language;
  onAddToCart: (item: BookingCartItem) => void;
  onNavigateHome: () => void;
  onViewItem?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
  favorites?: any[];
  onToggleFavorite?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
}


export function TourCombos({ 
  language, 
  onAddToCart, 
  onNavigateHome, 
  onViewItem,
  favorites = [],
  onToggleFavorite
}: TourCombosProps) {
  const isVi = language === 'vi';
  const [successId, setSuccessId] = React.useState<string | null>(null);

  const handleBookCombo = (combo: typeof PREDEFINED_COMBOS[0]) => {
    if (onViewItem) {
      onViewItem({
        id: combo.id,
        type: 'activity',
        name: `[Tour Combo] ${combo.name}`,
        image: combo.image,
        price: combo.price,
        description: combo.includes.join('. ')
      });
    } else {
      onAddToCart({
        id: combo.id,
        type: 'activity',
        name: `[Tour Combo] ${combo.name} (${combo.days})`,
        price: combo.price,
        quantity: 1,
        image: combo.image,
        details: `${isVi ? 'Trọn gói bao gồm các dịch vụ cao cấp: ' : 'Bundled heritage package including: '} ${combo.includes[0]}.`
      });

      setSuccessId(combo.id);
      setTimeout(() => setSuccessId(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-natural-text space-y-10">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="bg-natural-gold text-natural-text text-[10px] uppercase font-black tracking-widest px-3.5 py-1 rounded-full">
          EXCLUSIVE HERITAGE BUNDLES
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐẶT COMBO TOUR DU LỊCH TIẾT KIỆM IPP' : 'SAVER HERITAGE TOUR COMBOS'}
        </h2>
        <p className="text-stone-500 text-xs leading-relaxed">
          {isVi 
            ? 'Kết hợp phòng nghỉ cao cấp, xe di chuyển riêng tư và vé tham quan di sản nổi bật với mức chiết khấu độc quyền lên đến 25% tổng hóa đơn.'
            : 'Unite premium hotel stays, private airport transfers, and verified attraction entries with absolute 25% bundling savings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PREDEFINED_COMBOS.map((combo) => (
          <div 
            key={combo.id}
            onClick={() => onViewItem?.({
              id: combo.id,
              type: 'activity',
              name: `[Tour Combo] ${combo.name}`,
              image: combo.image,
              price: combo.price,
              description: combo.includes.join('. ')
            })}
            className="bg-white border border-natural-border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={combo.image} alt={combo.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite({
                      id: combo.id,
                      type: 'activity',
                      name: `[Tour Combo] ${combo.name}`,
                      image: combo.image,
                      price: combo.price,
                      description: combo.includes.join('. ')
                    });
                  }}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md hover:scale-110 transition group/fav cursor-pointer z-10"
                  title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                >
                  <Heart 
                    className={`w-4 h-4 transition duration-200 ${
                      favorites.some(x => x.id === combo.id) 
                        ? 'text-rose-600 fill-rose-600' 
                        : 'text-stone-400 group-hover/fav:text-rose-500'
                    }`} 
                  />
                </button>
              )}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1 shadow-sm border border-stone-200">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{combo.rating}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-natural-accent font-bold text-xs tracking-wider uppercase block">{combo.days}</span>
                  <span className="text-stone-400 text-xs line-through">{combo.oldPrice.toLocaleString()}đ</span>
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 leading-snug line-clamp-2 min-h-[44px]">
                  {combo.name}
                </h3>
                
                {/* List of included items */}
                <ul className="space-y-1.5 text-stone-600 text-xs pt-1 border-t border-stone-100">
                  {combo.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400 uppercase font-bold">{isVi ? 'Giá trọn gói' : 'Bundled Price'}</span>
                  <strong className="text-xl font-serif font-black text-natural-accent">
                    {combo.price.toLocaleString()}đ <span className="text-[10px] font-sans text-stone-500">/{isVi ? 'Khách' : 'Pax'}</span>
                  </strong>
                </div>

                <button
                  onClick={() => handleBookCombo(combo)}
                  className="w-full bg-natural-accent hover:bg-natural-olive text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-md"
                >
                  {isVi ? 'ĐẶT COMBO NGAY' : 'BOOK BUNDLED PACKAGE'}
                </button>

                {successId === combo.id && (
                  <p className="text-[11px] font-bold text-emerald-800 text-center animate-bounce">
                    ✓ {isVi ? 'Đã thêm Combo Trọn gói vào Giỏ hàng!' : 'Combo successfully added to Cart!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==========================================
