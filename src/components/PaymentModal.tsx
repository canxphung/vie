/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookingCartItem, Language } from '../types';
import { dictionaries } from '../data';
import { ShieldAlert, CreditCard, Lock, CheckCircle2, Ticket, QrCode, Trash2, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  language: Language;
  cartItems: BookingCartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  language,
  cartItems,
  onRemoveItem,
  onClearCart,
  onClose,
}: PaymentModalProps) {
  const isVi = language === 'vi';
  const t = dictionaries[language];

  const [paymentStep, setPaymentStep] = React.useState<'cart' | 'checkout' | 'success'>('cart');
  const [gateway, setGateway] = React.useState<'vnpay' | 'momo' | 'visa'>('visa');
  const [cardNo, setCardNo] = React.useState('');
  const [cardHolder, setCardHolder] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');

  // Voucher discount states (STT 9)
  const [voucherCode, setVoucherCode] = React.useState('');
  const [voucherDiscount, setVoucherDiscount] = React.useState(0);
  const [appliedVoucher, setAppliedVoucher] = React.useState<string | null>(null);
  const [voucherError, setVoucherError] = React.useState('');

  const totalCost = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round(totalCost * 0.15); // VIP member bundle discount
  const basePayableAmount = totalCost - discountAmount;
  const payableAmount = Math.max(0, basePayableAmount - voucherDiscount);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);

    const steps = isVi 
      ? [
          'Kết nối cổng thanh toán 3D Secure v2...',
          'Mã hóa thông tin tài khoản ngân hàng SSL 256-bit...',
          'Xác nhận số dư thành công...',
          'Phân bổ dòng tiền đến các hãng xe & khách sạn miền Trung...',
          'Biên dịch và phát hành Thẻ Vé Điện Tử VietCharm QR...'
        ]
      : [
          'Contacting 3D Secure v2 gateway servers...',
          'Encrypting billing parameters under SSL 256-bit algorithm...',
          'Asserting account balances...',
          'Disbursing balances to local Central agency partners...',
          'Issuing verified E-Ticket & security bar receipts...'
        ];

    let stepIdx = 0;
    setLoadingText(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingText(steps[stepIdx]);
      }
    }, 850);

    setTimeout(() => {
      clearInterval(interval);
      setPaymentLoading(false);
      setPaymentStep('success');
    }, 4500);
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-amber-200 shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-5 text-stone-400 hover:text-stone-800 text-2xl font-black transition z-10"
        >
          ×
        </button>

        {/* Outer content container */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Overview and Edit Cart */}
          {paymentStep === 'cart' && (
            <motion.div
              key="cart-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl md:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-1.5 uppercase">
                  <span>{isVi ? 'Hành Trình Trọn Gói Chọn Lọc' : 'Selected Vacation Bundle'}</span>
                  <span className="text-xs bg-amber-500 text-stone-900 px-2 py-0.5 rounded font-black font-mono">15% OFF</span>
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  {isVi ? 'Kiểm tra tóm tắt giỏ vé trước khi lướt sang bước giao dịch bảo mật trực tuyến.' : 'Verify your items list before passing to secure payment gate.'}
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <Ticket className="w-12 h-12 text-stone-300 mx-auto animate-pulse" />
                  <p className="text-stone-500 text-xs">{isVi ? 'Không có dịch vụ nào trong gói.' : 'No selections loaded yet. Go add some hotels, rides or excursions!'}</p>
                  <button 
                    onClick={onClose} 
                    className="bg-natural-gold-deep hover:bg-natural-gold-dark text-stone-950 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    {isVi ? 'Quay lại khám phá' : 'Go discover'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items Roster Scrollable */}
                  <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 border-b border-stone-100 pb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-150">
                        <div className="flex gap-3 items-center">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md shrink-0 border border-stone-200" />
                          <div>
                            <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h5>
                            <span className="text-[10px] font-mono uppercase bg-amber-100/50 text-natural-bronze px-1.5 py-0.5 rounded font-bold">
                              {item.type === 'hotel' ? (isVi ? 'Khách sạn' : 'Hotel') : item.type === 'vehicle' ? (isVi ? 'Thuê Xe tự lái' : 'Ride Rental') : (isVi ? 'Tour di sản' : 'Excursion')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-bold text-stone-800">
                            {item.price.toLocaleString('vi-VN')} đ
                          </span>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-300 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Voucher coupon area (STT 9) */}
                  <div className="bg-natural-cream border border-stone-200 p-4 rounded-2xl space-y-2.5">
                    <label className="text-[11px] font-bold text-stone-700 uppercase block tracking-wider flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-natural-accent" />
                      <span>{isVi ? 'Khuyến mãi & Mã giảm giá (Voucher)' : 'Promotional & Voucher Code'}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value.toUpperCase());
                          setVoucherError('');
                        }}
                        placeholder={isVi ? 'Nhập mã: VIETCHARM15, HOIANWELCOME, GENZTRAVEL...' : 'Enter code (e.g., VIETCHARM15)'}
                        className="flex-1 text-xs border border-stone-300 rounded-xl px-3.5 py-2 outline-none focus:border-natural-accent font-mono"
                        disabled={!!appliedVoucher}
                      />
                      {appliedVoucher ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedVoucher(null);
                            setVoucherDiscount(0);
                            setVoucherCode('');
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3.5 py-2 rounded-xl font-bold transition cursor-pointer"
                        >
                          {isVi ? 'Xóa mã' : 'Remove'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = voucherCode.trim().toUpperCase();
                            if (trimmed === 'VIETCHARM15') {
                              const disc = Math.round(basePayableAmount * 0.15);
                              setVoucherDiscount(disc);
                              setAppliedVoucher('VIETCHARM15');
                              setVoucherError('');
                            } else if (trimmed === 'HOIANWELCOME') {
                              const disc = 100000;
                              setVoucherDiscount(disc);
                              setAppliedVoucher('HOIANWELCOME');
                              setVoucherError('');
                            } else if (trimmed === 'GENZTRAVEL') {
                              const disc = Math.round(basePayableAmount * 0.20);
                              setVoucherDiscount(disc);
                              setAppliedVoucher('GENZTRAVEL');
                              setVoucherError('');
                            } else if (trimmed === '') {
                              setVoucherError(isVi ? 'Vui lòng nhập mã giảm giá!' : 'Please enter a promo code!');
                            } else {
                              setVoucherError(isVi ? 'Mã giảm giá này không hợp lệ hoặc đã hết hạn!' : 'Invalid voucher code or expired!');
                            }
                          }}
                          className="bg-natural-accent hover:bg-natural-olive text-white text-xs px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                        >
                          {isVi ? 'Áp dụng' : 'Apply'}
                        </button>
                      )}
                    </div>
                    {voucherError && <p className="text-[10px] font-semibold text-red-500">{voucherError}</p>}
                    {appliedVoucher && (
                      <p className="text-[10px] font-semibold text-emerald-600">
                        {isVi 
                          ? `✓ Đã áp dụng mã ${appliedVoucher} thành công: Giảm thêm -${voucherDiscount.toLocaleString('vi-VN')}đ!` 
                          : `✓ Code ${appliedVoucher} applied successfully: Extra -${voucherDiscount.toLocaleString('vi-VN')}đ off!`}
                      </p>
                    )}
                  </div>

                  {/* Pricing summaries card info */}
                  <div className="bg-amber-500/5 border border-amber-200/50 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-xs font-medium">
                    <div className="space-y-1">
                      <p className="text-stone-500">{isVi ? 'Tổng tiền gốc:' : 'Initial cost:'} <span className="font-mono line-through font-bold">{totalCost.toLocaleString('vi-VN')} đ</span></p>
                      <p className="text-emerald-600 font-bold">{isVi ? 'Tiết kiệm combo (15%):' : 'Bundle savings (15%):'} <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')} đ</span></p>
                      {voucherDiscount > 0 && (
                        <p className="text-emerald-700 font-extrabold">{isVi ? `Mã voucher (${appliedVoucher}):` : `Voucher applied (${appliedVoucher}):`} <span className="font-mono">-{voucherDiscount.toLocaleString('vi-VN')} đ</span></p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-stone-400 uppercase font-bold">{isVi ? 'CẦN THANH TOÁN' : 'PAYABLE TOTAL'}</p>
                      <p className="text-xl font-mono font-black text-natural-bronze">{payableAmount.toLocaleString('vi-VN')} đ</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button 
                      onClick={onClearCart}
                      className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
                    >
                      {isVi ? 'Xóa giỏ hàng để đặt lại' : 'Clear selections'}
                    </button>
                    <button 
                      onClick={() => setPaymentStep('checkout')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                    >
                      <span>{isVi ? 'TIẾN HÀNH THANH TOÁN' : 'PROCEED TO CHECKOUT'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Secure Payment Form Gate (Chức năng thanh toán bảo mật) */}
          {paymentStep === 'checkout' && (
            <motion.div
              key="checkout-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Payment Processing loading banner screen if applied */}
              {paymentLoading && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 rounded-3xl z-40">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <Lock className="w-4 h-4 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
                  <h4 className="text-sm font-black text-stone-900 mt-6">{isVi ? 'Đang xử lý thanh toán bảo mật...' : 'Encrypting payment details...'}</h4>
                  <p className="text-xs text-stone-500 mt-2 max-w-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {loadingText}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-xl md:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-1.5">
                  <Lock className="w-6 h-6 text-emerald-600" />
                  <span>{t.securePayment}</span>
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  {isVi ? 'Hệ thống bảo mật đa lớp SSL 256-bit đạt tiêu chuẩn bảo vệ dữ liệu thẻ PCI-DSS.' : 'Secure, PCI-DSS compliant direct merchant account settlement.'}
                </p>
              </div>

              {/* Gateway Selection Chips */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway('visa')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    gateway === 'visa' 
                      ? 'border-natural-gold-deep bg-amber-500/5 text-stone-900' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-700" />
                  <span className="text-[10px] font-bold">Thẻ Quốc Tế</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGateway('vnpay')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    gateway === 'vnpay' 
                      ? 'border-natural-gold-deep bg-amber-500/5 text-stone-900' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-700" />
                  <span className="text-[10px] font-bold">VNPAY QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGateway('momo')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    gateway === 'momo' 
                      ? 'border-natural-gold-deep bg-amber-500/5 text-stone-900' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pink-700" />
                  <span className="text-[10px] font-bold">Ví MoMo</span>
                </button>
              </div>

              {/* Payment Details form */}
              <form onSubmit={handlePaySubmit} className="space-y-4">
                {gateway === 'visa' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">{isVi ? 'Số thẻ Visa / Mastercard / JCB' : 'Credit Card Number'}</label>
                      <input 
                        type="text" 
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value.replace(/\D/g, '').substring(0, 16))}
                        placeholder="4221 0953 8412 5593"
                        className="w-full text-xs border border-stone-300 rounded px-3 py-2 outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">{isVi ? 'Ngày hết hạn' : 'Expiration date'}</label>
                        <input 
                          type="text" 
                          placeholder="12/28"
                          className="w-full text-xs border border-stone-300 rounded px-3 py-2 outline-none focus:border-amber-400 text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">CVC / CVV</label>
                        <input 
                          type="password" 
                          placeholder="***"
                          maxLength={3}
                          className="w-full text-xs border border-stone-300 rounded px-3 py-2 outline-none focus:border-amber-400 text-center"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">{isVi ? 'Chủ tài khoản (Không dấu)' : 'Cardholder Name'}</label>
                      <input 
                        type="text" 
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NGUYEN VAN A"
                        className="w-full text-xs border border-stone-300 rounded px-3 py-2 outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-stone-50 border border-stone-150 rounded-xl space-y-2">
                    <Smartphone className="w-8 h-8 text-natural-bronze mx-auto animate-bounce" />
                    <h5 className="text-xs font-bold text-stone-900">{isVi ? 'Cổng quét QR chuyển khoá tức thì' : 'Instant Scan Code Dispatch'}</h5>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                      {isVi 
                        ? 'Hệ thống sẽ đồng khóa sinh mã giảm giá QR động. Vui lòng bấm Xác Nhận để mở giao diện quét QR hóa đơn bảo mật.' 
                        : 'Dynamic QR receipt bill will instantly spawn. Click confirm checkout to assert scanner visual window.'}
                    </p>
                  </div>
                )}

                {/* Secure certificate footnotes */}
                <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-[10px] text-stone-600 leading-relaxed space-y-1 block">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {isVi ? 'VietCharm Verified Secure Transaction' : 'Verified Secure Escrow Assured'}
                  </p>
                  <p>{isVi ? 'Tiền nạp của bạn được giam ký quỹ qua 3 ngân hàng đối tác liên kết trước khi kết thúc kỳ dạo du lịch thành công.' : 'Your transactions are securely escrowed through official central treasury networks to ensure maximum buyer protection.'}</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-stone-100">
                  <button 
                    type="button" 
                    onClick={() => setPaymentStep('cart')}
                    className="w-1/3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-bold py-2.5 rounded-xl transition text-xs border border-stone-200 text-center"
                  >
                    {isVi ? 'Quay lại' : 'Go back'}
                  </button>
                  <button 
                    type="submit"
                    className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl transition text-xs shadow-md text-center flex items-center justify-center gap-2"
                  >
                    <span>{isVi ? `XÁC NHẬN THANH TOÁN ${payableAmount.toLocaleString('vi-VN')} đ` : `CONFIRM SECURE CHECHOUT ${payableAmount.toLocaleString('vi-VN')} đ`}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS AND DIGITAL TICKET QR (Thẻ Vé Điện Tử VietCharm) */}
          {paymentStep === 'success' && (
            <motion.div
              key="success-step"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-300 shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight">{t.paymentSuccess}</h3>
                <p className="text-[11px] text-stone-500 font-bold mt-1 uppercase tracking-widest">{isVi ? 'mã số đặt chỗ: VCHARM-84953' : 'Booking reference: VCHARM-84953'}</p>
              </div>

              {/* Verified Digital E-Ticket display */}
              <div className="bg-[#FAF9F5] border-2 border-dashed border-amber-300 p-6 rounded-2xl relative max-w-sm mx-auto text-left shadow-md">
                {/* Visual side notches representing old school tickets */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-dashed border-amber-300" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-dashed border-amber-300" />
                
                <div className="border-b border-stone-200 pb-3 mb-4 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="text-stone-900 font-black tracking-tight">{t.eTicket}</h4>
                    <span className="text-[9px] uppercase text-natural-bronze font-black">{isVi ? 'Liên kết đối tác miền Trung' : 'Central Vietnam Vendor Network'}</span>
                  </div>
                  <Ticket className="w-5 h-5 text-amber-500" />
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase font-bold">{isVi ? 'DANH SÁCH DỊCH VỤ' : 'LOADED SERVICES'}</p>
                    <div className="space-y-1 mt-1 text-[11px] text-stone-700 font-medium">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="line-clamp-1 max-w-[200px]">● {item.name}</span>
                          <span className="font-mono text-stone-900 font-bold">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-stone-200 pt-3 text-[11px]">
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase block font-bold">{isVi ? 'GIAO DỊCH' : 'ESCROW STATUS'}</span>
                      <span className="text-emerald-600 font-black flex items-center gap-0.5 mt-0.5">
                        <Lock className="w-3.5 h-3.5" />
                        {isVi ? 'ĐÃ PHỦ SSL' : 'SSL LOCKED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase block font-bold">{isVi ? 'THỜI GIAN ĐẶT' : 'TIMESTAMP'}</span>
                      <span className="font-mono text-stone-800 font-bold block mt-0.5">2026-06-22</span>
                    </div>
                  </div>

                  {/* QR code generator vector representations */}
                  <div className="border-t border-stone-200 pt-4 flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white border border-amber-200 rounded-lg shadow-sm">
                      {/* Responsive clean SVG for simulated vector QR Code */}
                      <svg width="100" height="100" viewBox="0 0 100 100" className="text-stone-950 fill-current">
                        <rect width="100" height="100" fill="white" />
                        {/* QR outlines corner markers */}
                        <rect x="5" y="5" width="25" height="25" fill="#3A3845" />
                        <rect x="10" y="10" width="15" height="15" fill="white" />
                        <rect x="13" y="13" width="9" height="9" fill="#3A3845" />

                        <rect x="70" y="5" width="25" height="25" fill="#3A3845" />
                        <rect x="75" y="10" width="15" height="15" fill="white" />
                        <rect x="78" y="13" width="9" height="9" fill="#3A3845" />

                        <rect x="5" y="70" width="25" height="25" fill="#3A3845" />
                        <rect x="10" y="75" width="15" height="15" fill="white" />
                        <rect x="13" y="78" width="9" height="9" fill="#3A3845" />

                        {/* Random mock QR dots */}
                        <rect x="40" y="10" width="5" height="10" fill="#3A3845" />
                        <rect x="50" y="5" width="10" height="5" fill="#3A3845" />
                        <rect x="70" y="40" width="15" height="5" fill="#3A3845" />
                        <rect x="40" y="50" width="5" height="20" fill="#3A3845" />
                        <rect x="50" y="70" width="10" height="10" fill="#3A3845" />
                        <rect x="80" y="70" width="15" height="15" fill="#3A3845" />
                        <rect x="25" y="45" width="10" height="10" fill="#3A3845" />
                        <rect x="65" y="50" width="5" height="10" fill="#3A3845" />
                        <rect x="50" y="45" width="10" height="15" fill="#3A3835" />
                        <rect x="85" y="45" width="10" height="5" fill="#3A3845" />
                      </svg>
                    </div>
                    <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">{isVi ? 'QUÉT ĐỂ NHẬN PHÒNG / NHẬN XE' : 'SCAN AT LOUNGE CHECH-IN'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 max-w-sm mx-auto pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const originalCart = [...cartItems];
                    window.print();
                  }}
                  className="w-1/2 border border-stone-200 hover:bg-stone-50 text-stone-700 py-2.5 rounded-xl font-bold transition text-xs shadow-xs"
                >
                  {isVi ? 'In hóa đơn' : 'Print ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    onClose();
                  }}
                  className="w-1/2 bg-natural-ink-soft hover:bg-[#2A2835] text-white py-2.5 rounded-xl font-black transition text-xs shadow-md"
                >
                  {isVi ? 'Trở về màn hình chủ' : 'Explore further'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
