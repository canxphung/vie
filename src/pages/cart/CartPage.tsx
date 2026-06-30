/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckSquare,
  Clock3,
  CreditCard,
  Hotel,
  MapPinned,
  PackageCheck,
  Route,
  ShoppingBag,
  Sparkles,
  Square,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { Button, Container } from '@/components/ui';
import { useCart, useI18n, useUI } from '@/hooks';
import type { BookingCartItem } from '@/types';

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')} đ`;
}

function getItemTypeLabel(type: BookingCartItem['type'], isVi: boolean) {
  if (type === 'hotel') return isVi ? 'Khách sạn' : 'Hotel';
  if (type === 'vehicle') return isVi ? 'Xe & đưa đón' : 'Transport';
  return isVi ? 'Hoạt động' : 'Experience';
}

function CartTypeIcon({ type }: { type: BookingCartItem['type'] }) {
  if (type === 'hotel') return <Hotel className="h-4 w-4" />;
  if (type === 'vehicle') return <Car className="h-4 w-4" />;
  return <MapPinned className="h-4 w-4" />;
}

function getTripStepCopy(item: BookingCartItem, index: number, isVi: boolean) {
  const step = index + 1;

  if (item.type === 'hotel') {
    return {
      label: isVi ? `Đêm ${step}` : `Night ${step}`,
      title: isVi ? 'Điểm nghỉ trong hành trình' : 'Stay anchor',
      note: isVi ? 'Giữ chỗ nghỉ để các chặng còn lại dễ sắp xếp hơn.' : 'Anchors the route so the rest of the plan is easier to arrange.',
    };
  }

  if (item.type === 'vehicle') {
    return {
      label: isVi ? `Chặng ${step}` : `Leg ${step}`,
      title: isVi ? 'Di chuyển giữa các điểm' : 'Route transport',
      note: isVi ? 'Dùng để nối khách sạn, sân bay và điểm trải nghiệm.' : 'Connects stays, airports, and experiences.',
    };
  }

  return {
    label: isVi ? `Ngày ${step}` : `Day ${step}`,
    title: isVi ? 'Trải nghiệm đáng nhớ' : 'Trip highlight',
    note: isVi ? 'Hoạt động tạo điểm nhấn cho lịch trình.' : 'Adds a memorable moment to the itinerary.',
  };
}

export default function CartPage() {
  const { language } = useI18n();
  const isVi = language === 'vi';
  const {
    items,
    openPayment,
    removeItem,
    clearCart,
    selectedItems,
    selectedCount,
    allSelected,
    isItemSelected,
    toggleItemSelected,
    setAllItemsSelected,
  } = useCart();
  const { setView, openAllServices, requireAuth } = useUI();
  const [confirmClearOpen, setConfirmClearOpen] = React.useState(false);

  // Pricing is based only on the services ticked for checkout.
  const totalCost = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const serviceTypeCount = new Set(selectedItems.map((item) => item.type)).size;
  const isBundleEligible = selectedItems.length >= 2 && serviceTypeCount >= 2;
  const bundleDiscount = isBundleEligible ? Math.round(totalCost * 0.15) : 0;
  const payableAmount = Math.max(0, totalCost - bundleDiscount);
  const hasSelection = selectedCount > 0;

  const handleCheckout = () =>
    requireAuth(() => openPayment('checkout'), isVi ? 'Đăng nhập để thanh toán.' : 'Sign in to checkout.');

  const continueShopping = () => {
    openAllServices('hotels', 'cart');
  };

  return (
    <motion.main
      key="cart-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="py-8 md:py-10"
    >
      <Container>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setView('provinces')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-natural-accent transition hover:text-natural-olive"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isVi ? 'Tiếp tục khám phá' : 'Continue exploring'}</span>
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-natural-ink md:text-4xl">
                {isVi ? 'Giỏ hàng' : 'Travel Cart'}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-500">
                {isVi
                  ? 'Kiểm tra dịch vụ đã chọn, bỏ mục không cần và chuyển sang thanh toán khi lịch trình đã ổn.'
                  : 'Review selected services, remove anything unnecessary, then continue to checkout.'}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-natural-border bg-white text-center shadow-xs">
              <div className="px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                  {isVi ? 'Dịch vụ' : 'Items'}
                </p>
                <p className="mt-1 font-mono text-lg font-black text-natural-ink">{selectedCount}</p>
              </div>
              <div className="border-x border-natural-border px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                  {isVi ? 'Ưu đãi' : 'Saving'}
                </p>
                <p className={`mt-1 font-mono text-lg font-black ${isBundleEligible ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {isBundleEligible ? '15%' : '0%'}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                  {isVi ? 'Tổng' : 'Total'}
                </p>
                <p className="mt-1 font-mono text-lg font-black text-natural-bronze">
                  {formatCurrency(payableAmount)}
                </p>
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-natural-border bg-white px-5 py-12 text-center shadow-xs">
            <div className="max-w-md space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-natural-beige text-natural-accent">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-natural-ink">
                  {isVi ? 'Giỏ hàng đang trống' : 'Your cart is empty'}
                </h2>
                <p className="text-sm leading-relaxed text-stone-500">
                  {isVi
                    ? 'Chọn khách sạn, xe hoặc hoạt động yêu thích rồi quay lại đây để gom lịch trình trước khi thanh toán.'
                    : 'Choose hotels, rides, or experiences first, then return here to review the trip before payment.'}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button type="button" variant="goldDeep" onClick={continueShopping}>
                  <Sparkles className="h-4 w-4" />
                  <span>{isVi ? 'Chọn dịch vụ' : 'Browse services'}</span>
                </Button>
                <Button type="button" variant="secondary" onClick={() => setView('regions')}>
                  <MapPinned className="h-4 w-4" />
                  <span>{isVi ? 'Về trang chủ' : 'Home'}</span>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <>
          <section className="mb-6 overflow-hidden rounded-3xl border border-natural-border bg-[#1F261F] text-white shadow-luxe">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="p-5 md:p-7">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-natural-gold">
                      <Route className="h-4 w-4" />
                      {isVi ? 'Trip board' : 'Trip board'}
                    </span>
                    <h2 className="mt-2 font-serif text-2xl font-black tracking-tight md:text-4xl">
                      {isVi ? 'Chuyến đi VietCharm của bạn' : 'Your VietCharm trip'}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                      {isVi
                        ? 'Các dịch vụ trong giỏ được gom thành từng chặng để bạn dễ nhìn lại trước khi thanh toán.'
                        : 'Selected services are grouped into route steps so the plan is easy to review before checkout.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/55">
                      {isVi ? 'Trạng thái combo' : 'Bundle status'}
                    </p>
                    <p className={`mt-1 text-sm font-black ${isBundleEligible ? 'text-emerald-300' : 'text-natural-gold'}`}>
                      {isBundleEligible
                        ? (isVi ? 'Đã đủ điều kiện giảm 15%' : '15% saving unlocked')
                        : (isVi ? 'Thêm nhóm dịch vụ để mở ưu đãi' : 'Add another service type to unlock')}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {items.slice(0, 3).map((item, index) => {
                    const step = getTripStepCopy(item, index, isVi);
                    return (
                      <div key={`${item.cartKey || item.id}-board`} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-natural-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-natural-ink">
                            {step.label}
                          </span>
                          <CartTypeIcon type={item.type} />
                        </div>
                        <h3 className="line-clamp-2 text-sm font-black leading-snug text-white">{item.name}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/62">{step.note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.08] p-5 md:p-7 lg:border-l lg:border-t-0">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                    <Clock3 className="mb-2 h-4 w-4 text-natural-gold" />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/50">
                      {isVi ? 'Số dịch vụ' : 'Services'}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-black">{selectedCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                    <CreditCard className="mb-2 h-4 w-4 text-natural-gold" />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/50">
                      {isVi ? 'Dự tính' : 'Estimate'}
                    </p>
                    <p className="mt-1 font-mono text-xl font-black text-natural-gold">{formatCurrency(payableAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-natural-border bg-white px-4 py-3 shadow-xs">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-natural-ink">
                    {isVi ? 'Dịch vụ đã chọn' : 'Selected services'}
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {isVi
                      ? `Tích chọn dịch vụ muốn thanh toán — đã chọn ${selectedItems.length}/${items.length}.`
                      : `Tick the services to pay for — ${selectedItems.length}/${items.length} selected.`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAllItemsSelected(!allSelected)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-natural-border bg-natural-bg px-3 py-2 text-xs font-bold text-natural-accent transition hover:bg-natural-beige"
                  >
                    {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    <span>{allSelected ? (isVi ? 'Bỏ chọn tất cả' : 'Unselect all') : (isVi ? 'Chọn tất cả' : 'Select all')}</span>
                  </button>
                  <Button type="button" variant="ghost" size="sm" onClick={continueShopping}>
                    <PackageCheck className="h-4 w-4" />
                    <span>{isVi ? 'Chọn thêm' : 'Add more'}</span>
                  </Button>
                </div>
              </div>

              <ul className="space-y-3">
                {items.map((item, index) => {
                  const key = item.cartKey || item.id;
                  const step = getTripStepCopy(item, index, isVi);
                  const selected = isItemSelected(key);
                  return (
                    <li
                      key={key}
                      className={`grid gap-4 rounded-2xl border bg-white p-3 shadow-xs transition sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center ${
                        selected ? 'border-natural-gold/50' : 'border-natural-border opacity-60'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-24 w-full rounded-xl border border-natural-border object-cover sm:h-20 sm:w-22"
                        />
                        <button
                          type="button"
                          onClick={() => toggleItemSelected(key)}
                          aria-pressed={selected}
                          title={
                            selected
                              ? (isVi ? 'Bỏ chọn khỏi thanh toán' : 'Exclude from checkout')
                              : (isVi ? 'Chọn để thanh toán' : 'Include in checkout')
                          }
                          className="absolute left-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/95 shadow-sm backdrop-blur-sm transition hover:scale-105"
                        >
                          {selected ? (
                            <CheckSquare className="h-4 w-4 text-natural-accent" />
                          ) : (
                            <Square className="h-4 w-4 text-stone-400" />
                          )}
                        </button>
                      </div>
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F261F] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            <Route className="h-3.5 w-3.5 text-natural-gold" />
                            {step.label}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-natural-beige px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-natural-accent">
                            <CartTypeIcon type={item.type} />
                            {getItemTypeLabel(item.type, isVi)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <UsersRound className="h-3.5 w-3.5" />
                            x{item.quantity}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 text-base font-black leading-snug text-stone-950">{item.name}</h3>
                        <p className="text-[11px] font-bold text-natural-accent">{step.title}</p>
                        {item.details && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-stone-500">
                            {item.details}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-natural-border pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                            {isVi ? 'Thành tiền' : 'Line total'}
                          </p>
                          <p className="mt-1 font-mono text-base font-black text-natural-bronze">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-stone-400">
                            {formatCurrency(item.price)} / {isVi ? 'mục' : 'item'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 px-2.5 text-xs font-black uppercase text-red-600 transition hover:bg-red-100"
                          title={isVi ? 'Xóa khỏi giỏ hàng' : 'Remove from cart'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <aside className="h-fit rounded-2xl border border-natural-border bg-white p-5 shadow-xs lg:sticky lg:top-32">
              <div className="mb-5 flex items-center gap-3 border-b border-natural-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-natural-gold/25 text-natural-bronze">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black text-natural-ink">{isVi ? 'Tóm tắt thanh toán' : 'Payment summary'}</h2>
                  <p className="text-xs text-stone-500">
                    {isBundleEligible
                      ? (isVi ? 'Ưu đãi combo được tính tự động.' : 'Bundle discount is applied automatically.')
                      : (isVi ? 'Cần ít nhất 2 nhóm dịch vụ để nhận combo.' : 'Add at least 2 service types to unlock bundle savings.')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-stone-500">{isVi ? 'Tạm tính' : 'Subtotal'}</span>
                  <span className="font-mono font-bold text-stone-900">{formatCurrency(totalCost)}</span>
                </div>
                <div className={`flex justify-between gap-3 ${isBundleEligible ? 'text-emerald-700' : 'text-stone-400'}`}>
                  <span className="font-semibold">
                    {isBundleEligible
                      ? (isVi ? 'Giảm combo 15%' : 'Bundle discount 15%')
                      : (isVi ? 'Combo chưa đủ điều kiện' : 'Bundle not eligible')}
                  </span>
                  <span className="font-mono font-bold">
                    {isBundleEligible ? `-${formatCurrency(bundleDiscount)}` : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-natural-border pt-4">
                  <span className="text-xs font-black uppercase tracking-wider text-natural-ink">
                    {isVi ? 'Cần thanh toán' : 'Payable'}
                  </span>
                  <span className="font-mono text-xl font-black text-natural-bronze">
                    {formatCurrency(payableAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-xs leading-relaxed text-emerald-800">
                <div className="mb-1 flex items-center gap-1.5 font-black">
                  <CalendarDays className="h-4 w-4" />
                  <span>{isVi ? 'Lưu ý lịch trình' : 'Trip note'}</span>
                </div>
                <p>
                  {isVi
                    ? 'Ngày nhận phòng, lịch xe và mô tả dịch vụ sẽ đi theo từng mục trong giỏ để tránh nhầm lịch.'
                    : 'Dates, ride schedules, and service details stay attached to each cart item to prevent mix-ups.'}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <Button type="button" className="w-full" size="lg" disabled={!hasSelection} onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {hasSelection
                      ? (isVi ? `Thanh toán (${selectedItems.length})` : `Checkout (${selectedItems.length})`)
                      : (isVi ? 'Chọn dịch vụ để thanh toán' : 'Select items to checkout')}
                  </span>
                </Button>
                <Button type="button" variant="secondary" className="w-full" onClick={continueShopping}>
                  <ShoppingBag className="h-4 w-4" />
                  <span>{isVi ? 'Tiếp tục chọn dịch vụ' : 'Continue shopping'}</span>
                </Button>
                <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmClearOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  <span>{isVi ? 'Xóa giỏ hàng' : 'Clear cart'}</span>
                </Button>
              </div>
            </aside>
          </div>
          </>
        )}
      </Container>

      <AnimatePresence>
        {confirmClearOpen && (
          <motion.div
            key="clear-cart-confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              className="w-full max-w-sm rounded-2xl border border-natural-border bg-white p-5 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black text-natural-ink">
                    {isVi ? 'Xóa toàn bộ giỏ hàng?' : 'Clear the whole cart?'}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">
                    {isVi
                      ? 'Các dịch vụ và lịch trình đã chọn sẽ bị xóa khỏi giỏ.'
                      : 'All selected services and schedule details will be removed.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button type="button" variant="secondary" onClick={() => setConfirmClearOpen(false)}>
                  {isVi ? 'Giữ lại' : 'Keep cart'}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    clearCart();
                    setConfirmClearOpen(false);
                  }}
                >
                  {isVi ? 'Xóa giỏ' : 'Clear'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
