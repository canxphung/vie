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
import { DateField } from '@/components/ui';

// 3. COMPONENT: TAXI & TRANSPORT ENGINE WITH DISTANCE ESTIMATOR
// ==========================================
interface TaxiBookingProps {
  language: Language;
  onAddToCart: (item: BookingCartItem) => void;
  onNavigateHome: () => void;
}


export function TaxiBooking({ language, onAddToCart, onNavigateHome }: TaxiBookingProps) {
  const isVi = language === 'vi';
  const [pickup, setPickup] = React.useState(TOURIST_LOCATIONS[0].id);
  const [dropoff, setDropoff] = React.useState(TOURIST_LOCATIONS[2].id);
  const [vehicleType, setVehicleType] = React.useState<'vios-4' | 'xpander-7' | 'sirius-moto'>('vios-4');
  const [bookingDate, setBookingDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = React.useState('14:00');
  const [specialNote, setSpecialNote] = React.useState('');
  const [bookedMsg, setBookedMsg] = React.useState(false);

  // Approximate coordinate distance calculator
  const pickupLoc = TOURIST_LOCATIONS.find(l => l.id === pickup) || TOURIST_LOCATIONS[0];
  const dropoffLoc = TOURIST_LOCATIONS.find(l => l.id === dropoff) || TOURIST_LOCATIONS[2];

  // Simple Euclidean distance multiplier for local terrain
  const calculatedDistance = React.useMemo(() => {
    const latDiff = pickupLoc.lat - dropoffLoc.lat;
    const lngDiff = pickupLoc.lng - dropoffLoc.lng;
    const rawDist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // 1 degree ~ 111km
    return Math.max(parseFloat(rawDist.toFixed(1)), 2.5); // Minimum 2.5km distance
  }, [pickupLoc, dropoffLoc]);

  const pricePerKm = vehicleType === 'vios-4' ? 12000 : vehicleType === 'xpander-7' ? 16000 : 6000;
  const totalCost = Math.round(calculatedDistance * pricePerKm);

  const handleBookTaxi = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleName = vehicleType === 'vios-4' 
      ? 'Taxi 4 Chỗ Toyota Vios (VietCharm Transfer)' 
      : vehicleType === 'xpander-7' 
      ? 'Taxi 7 Chỗ Mitsubishi Xpander (VietCharm Transfer)' 
      : 'Xe Ôm Công Nghệ Sirius/Vision (VietCharm Transfer)';

    onAddToCart({
      id: `taxi-${Date.now()}`,
      type: 'vehicle',
      name: `${vehicleName} [${pickupLoc.name} ➔ ${dropoffLoc.name}]`,
      price: totalCost,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
      details: `${isVi ? 'Ngày đưa đón' : 'Scheduled at'}: ${bookingDate} ${bookingTime}. ${isVi ? 'Quãng đường:' : 'Dist:'} ${calculatedDistance}km.`
    });

    setBookedMsg(true);
    setTimeout(() => setBookedMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-natural-text">
      <div className="text-center space-y-2 mb-8">
        <span className="bg-natural-accent text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
          VIETCHARM TAXI & AIRPORT TRANSFER
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐẶT XE TAXI & ĐƯA ĐÓN SÂN BAY' : 'AIRPORT TAXI & PRIVATE TRANSFER'}
        </h2>
        <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
          {isVi 
            ? 'Cổng tính phí tự động chuẩn xác theo km. Xe sạch sẽ, máy lạnh mát rượi, tài xế bản địa cực am hiểu Hội An và Đà Nẵng.'
            : 'Get instant exact distance calculations and flat-rate transparent billing with polite multilingual drivers.'}
        </p>
      </div>

      {bookedMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-center mb-6 animate-bounce">
          ✓ {isVi ? 'Đã thêm dịch vụ đưa đón vào Giỏ hàng! Vui lòng mở giỏ hàng thanh toán thẻ vé.' : 'Taxi ride successfully added to Cart! Proceed to secure checkout.'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Booking parameters Form */}
        <form onSubmit={handleBookTaxi} className="bg-white border border-natural-border p-6 rounded-3xl space-y-5 shadow-xs">
          <h3 className="font-serif font-bold text-base text-natural-accent border-b border-natural-border pb-2 uppercase flex items-center gap-1.5">
            <Car className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>{isVi ? 'Thông tin lộ trình' : 'Route Details'}</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Điểm Đón (Pick-up Location)' : 'Pick-up'}</label>
              <select 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2.5 font-medium text-stone-800 outline-none"
              >
                {TOURIST_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Điểm Đến (Drop-off Location)' : 'Drop-off'}</label>
              <select 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2.5 font-medium text-stone-800 outline-none"
              >
                {TOURIST_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Ngày đưa đón' : 'Date'}</label>
                <DateField
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={setBookingDate}
                  isVi={isVi}
                  ariaLabel={isVi ? 'Ngày đưa đón' : 'Date'}
                  className="flex w-full items-center gap-1.5 border border-natural-border bg-natural-cream rounded-xl px-3 py-2 text-stone-800 cursor-pointer"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Giờ đón' : 'Time'}</label>
                <input 
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 text-stone-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Chọn Loại Phương Tiện' : 'Vehicle Type'}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('vios-4')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'vios-4' ? 'bg-natural-accent text-white border-natural-accent' : 'bg-white border-natural-border hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe 4 Chỗ' : '4-Seater'}</span>
                  <span className="text-[9px] block opacity-85">12,000đ/km</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('xpander-7')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'xpander-7' ? 'bg-natural-accent text-white border-natural-accent' : 'bg-white border-natural-border hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe 7 Chỗ' : '7-Seater'}</span>
                  <span className="text-[9px] block opacity-85">16,000đ/km</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('sirius-moto')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'sirius-moto' ? 'bg-natural-accent text-white border-natural-accent' : 'bg-white border-natural-border hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe ôm Sirius' : 'Sirius Moto'}</span>
                  <span className="text-[9px] block opacity-85">6,000đ/km</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Ghi chú cho tài xế (VD: Sân bay ga quốc tế...)' : 'Driver Notes'}</label>
              <input 
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Ex: Đón tôi ở cột số 5, ga đến quốc nội Đà Nẵng..."
                className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pickup === dropoff}
            className="w-full bg-natural-gold hover:bg-natural-gold-dark disabled:opacity-50 text-natural-text font-black py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-md"
          >
            {pickup === dropoff 
              ? (isVi ? 'Vui lòng chọn 2 điểm khác nhau' : 'Select different locations') 
              : (isVi ? 'Xác nhận đặt xe lữ hành' : 'Confirm & Add to Cart')}
          </button>
        </form>

        {/* Dynamic Calculation Visualization Mock Map Route */}
        <div className="bg-natural-beige border border-natural-border p-6 rounded-3xl flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-natural-border pb-2 uppercase">
              {isVi ? 'Chi tiết chi phí & hành trình' : 'Dynamic Fare Indexing'}
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="bg-white rounded-xl p-3 border border-stone-150 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold uppercase">{isVi ? 'Quãng đường tối ưu:' : 'Route Distance:'}</span>
                  <span className="font-black text-stone-800">{calculatedDistance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold uppercase">{isVi ? 'Đơn giá loại xe:' : 'Fare Rate:'}</span>
                  <span className="font-mono font-bold text-stone-800">{pricePerKm.toLocaleString()} đ / km</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 font-bold text-stone-900">
                  <span className="uppercase">{isVi ? 'Cước xe ước tính:' : 'Base Subtotal:'}</span>
                  <span>{totalCost.toLocaleString()} đ</span>
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-xl p-3 border border-dashed border-amber-300 space-y-1.5 text-[11px] leading-relaxed">
                <strong className="text-amber-800 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> {isVi ? 'ƯU ĐÃI KHÔNG PHỤ PHÍ' : 'FLAT-RATE PROTECTION'}
                </strong>
                <p className="text-stone-600">
                  {isVi 
                    ? 'Giá trên là trọn gói đã bao gồm phí cầu đường BOT sân bay Đà Nẵng, cam kết không phát sinh bất kỳ chi phí ẩn nào khi di chuyển dọc đường.'
                    : 'The rate listed is 100% flat-rate, including all regional highway tolls, airport gate tariffs and luggage protection.'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-natural-border pt-4 mt-6 space-y-2 text-center text-xs">
            <p className="text-stone-500 font-serif italic">
              {isVi 
                ? 'Tự động gán tài xế phản hồi nhanh trong 5 phút sau khi thanh toán.'
                : 'Guaranteed polite driver assigned within 5 mins of cart checkout.'}
            </p>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-natural-accent font-bold hover:underline"
            >
              ← {isVi ? 'Quay về dạo chơi di sản' : 'Browse other experiences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
