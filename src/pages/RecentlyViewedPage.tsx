/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useI18n, useCart, useUI } from '@/hooks';

export default function RecentlyViewedPage() {
  const { isVi } = useI18n();
  const { items: cartItems, removeItem: handleRemoveFromCart } = useCart();
  const { setView, recentlyViewed, clearRecentlyViewed, viewItem: handleViewItem } = useUI();
  return (
          <motion.div
            key="recently-viewed-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-12 space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-natural-border pb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-natural-accent uppercase tracking-widest">{isVi ? 'Nhật ký lữ hành' : 'Travel History Log'}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-natural-text mt-1">
                  {isVi ? 'Dịch Vụ Đã Xem Gần Đây' : 'Recently Viewed Services'}
                </h2>
                <p className="text-natural-text/70 text-xs mt-1">
                  {isVi 
                    ? 'Danh sách các cơ sở lưu trú khách sạn, hoạt động trải nghiệm hoặc xe tự lái bạn đã tham khảo.' 
                    : 'The collection of hotels, activities, or vehicle rentals you have browsed.'}
                </p>
              </div>

              {recentlyViewed.length > 0 && (
                <button
                  onClick={() => clearRecentlyViewed()}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  🗑️ {isVi ? 'Xóa toàn bộ lịch sử' : 'Clear Browser History'}
                </button>
              )}
            </div>

            {recentlyViewed.length === 0 ? (
              <div className="text-center py-20 bg-natural-cream border border-dashed border-natural-border rounded-3xl p-6 space-y-4">
                <Clock className="w-12 h-12 text-natural-accent/50 mx-auto animate-pulse" />
                <h3 className="font-serif font-bold text-natural-text text-lg">
                  {isVi ? 'Chưa có dịch vụ nào đã xem' : 'No browsed history yet'}
                </h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">
                  {isVi 
                    ? 'Hãy khám phá các tỉnh miền Trung, click xem chi tiết các khách sạn di sản và hoạt động vui chơi để lưu trữ tại đây.' 
                    : 'Explore beautiful Central provinces, interact with historical stays and private cars to populate your logs here.'}
                </p>
                <button 
                  onClick={() => setView('provinces')} 
                  className="bg-natural-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-natural-olive transition cursor-pointer"
                >
                  {isVi ? 'Bắt đầu Khám phá ngay →' : 'Start Exploring Now →'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentlyViewed.map((item, idx) => {
                  const alreadyInCart = cartItems.some((x) => x.id === item.id);
                  return (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-natural-beige-light rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-natural-border hover:border-natural-accent transition duration-300 flex flex-col justify-between"
                    >
                      <div className="relative h-44 overflow-hidden shrink-0 bg-stone-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-natural-gold text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {item.type === 'hotel' ? (isVi ? 'Khách sạn' : 'Hotel') : 
                           item.type === 'activity' ? (isVi ? 'Trải nghiệm' : 'Activity') : 
                           (isVi ? 'Xe tự lái' : 'Rental')}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-natural-text text-sm tracking-tight leading-snug line-clamp-2 min-h-[40px]">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-[11px] text-natural-text/75 line-clamp-2 leading-relaxed min-h-[32px]">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-natural-border flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-natural-accent block font-bold uppercase tracking-wider">
                              {isVi ? 'ĐƠN GIÁ' : 'PRICE'}
                            </span>
                            <span className="font-mono font-black text-natural-accent text-sm">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          {alreadyInCart ? (
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="bg-natural-beige hover:bg-natural-border text-natural-text px-3 py-1.5 rounded-xl text-[11px] font-bold border border-natural-border transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>✓ {isVi ? 'Đã thêm' : 'Added'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleViewItem(item);
                              }}
                              className="bg-natural-accent hover:bg-natural-olive text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer"
                            >
                              {isVi ? 'Xem chi tiết' : 'View Details'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
  );
}
