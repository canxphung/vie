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

// 7. COMPONENT: ADMIN DATA & SERVICE MANAGEMENT PANEL
// ==========================================
interface AdminDashboardProps {
  language: Language;
  users: UserAccount[];
  onUpdateUserRole: (id: string, role: 'user' | 'admin') => void;
  applications: PartnershipApplication[];
  onUpdateApplicationStatus: (id: string, status: 'approved' | 'rejected') => void;
  bookings: SystemBooking[];
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  vouchers: PromoVoucher[];
  onAddNewVoucher: (v: PromoVoucher) => void;
  onDeleteVoucher: (code: string) => void;
}

export function AdminDashboard({
  language,
  users,
  onUpdateUserRole,
  applications,
  onUpdateApplicationStatus,
  bookings,
  onUpdateBookingStatus,
  vouchers,
  onAddNewVoucher,
  onDeleteVoucher,
}: AdminDashboardProps) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<'stats' | 'users' | 'partners' | 'bookings' | 'vouchers'>('stats');

  // Local state for creating new voucher
  const [vCode, setVCode] = React.useState('');
  const [vDesc, setVDesc] = React.useState('');
  const [vType, setVType] = React.useState<'percentage' | 'fixed'>('percentage');
  const [vVal, setVVal] = React.useState(10);
  const [vMin, setVMin] = React.useState(0);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim()) return;

    onAddNewVoucher({
      code: vCode.trim().toUpperCase(),
      description: vDesc.trim() || `${isVi ? 'Giảm giá' : 'Discount'} ${vCode}`,
      discountType: vType,
      value: Number(vVal),
      minSpend: Number(vMin),
      active: true
    });

    setVCode('');
    setVDesc('');
    setVVal(10);
    setVMin(0);
  };

  // Calculate high-fidelity business metrics
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.finalTotal : sum, 0);
  const totalBookingsCount = bookings.length;
  const pendingPartnershipsCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-8 text-natural-text">
      {/* Admin Title Banner */}
      <div className="bg-natural-text text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="bg-natural-gold text-natural-text text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full inline-block">
            VIETCHARM ADMIN SUITE
          </span>
          <h2 className="text-2xl font-serif font-black flex items-center gap-2">
            <Database className="w-6 h-6 text-natural-gold" />
            <span>{isVi ? 'HỆ THỐNG QUẢN TRỊ DỮ LIỆU & DỊCH VỤ' : 'CENTRAL SYSTEM DATA CONTROL'}</span>
          </h2>
          <p className="text-xs text-natural-beige/70">
            {isVi ? 'Phân tích doanh thu, duyệt đối tác, phân quyền người dùng và cấp phát mã voucher ưu đãi' : 'Review live transactions, manage local providers and update vouchers'}
          </p>
        </div>

        <div className="bg-natural-beige/15 px-4 py-2 rounded-2xl border border-white/10 text-right">
          <p className="text-[10px] text-stone-300 font-bold font-mono">SERVER STATUS: GREEN</p>
          <p className="text-xs font-semibold text-emerald-400 font-mono">DATABASE PERSISTED</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: 'stats', label: isVi ? 'Thống kê & Doanh số' : 'Live Metrics', icon: BarChart3 },
          { id: 'bookings', label: isVi ? 'Quản lý đơn đặt chỗ' : 'Reservations', icon: ClipboardList },
          { id: 'partners', label: isVi ? `Hợp tác đối tác (${pendingPartnershipsCount})` : 'Partnerships', icon: Compass },
          { id: 'users', label: isVi ? 'Quản lý người dùng' : 'User Database', icon: User },
          { id: 'vouchers', label: isVi ? 'Cấu hình Voucher' : 'Coupon Control', icon: Tag },
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                activeTab === tab.id 
                  ? 'bg-natural-accent text-white shadow-md' 
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-150'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ADMIN TABS PANELS */}

      {/* TAB 1: STATS & ANALYTICS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-natural-border p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Tổng doanh thu thực tế' : 'Total Revenue Confirmed'}</span>
              <h3 className="text-3xl font-serif font-black text-natural-accent mt-1">
                {totalRevenue.toLocaleString()} đ
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {isVi ? 'Tất cả hóa đơn confirmed hợp lệ' : '100% verified checkouts'}</p>
            </div>

            <div className="bg-white border border-natural-border p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Tổng số giao dịch' : 'Total System Orders'}</span>
              <h3 className="text-3xl font-serif font-black text-stone-800 mt-1">
                {totalBookingsCount} {isVi ? 'Hóa đơn' : 'Bookings'}
              </h3>
              <p className="text-[10px] text-stone-500 mt-1">● {isVi ? 'Bao gồm cả vé Chờ xử lý' : 'Includes all pending bookings'}</p>
            </div>

            <div className="bg-white border border-natural-border p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Thành viên đăng ký hệ thống' : 'Registered Users'}</span>
              <h3 className="text-3xl font-serif font-black text-amber-600 mt-1">
                {users.length} {isVi ? 'Tài khoản' : 'Members'}
              </h3>
              <p className="text-[10px] text-natural-accent font-bold mt-1">★ {users.filter(u => u.role === 'admin').length} Admin, {users.filter(u => u.role === 'user').length} Travelers</p>
            </div>
          </div>

          {/* Quick Mock Visual chart block */}
          <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs">
            <h4 className="font-serif font-bold text-base text-stone-800 mb-4 uppercase">
              {isVi ? 'Phân bổ cơ cấu danh mục dịch vụ' : 'Revenue Streams & Booking Shares'}
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🏨 {isVi ? 'Khách sạn & Khu nghỉ dưỡng (Hotels)' : 'Hotels Stay'}</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-natural-accent" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🚗 {isVi ? 'Dịch vụ đưa đón sân bay & Taxi (Transfer)' : 'Taxi & Car Rentals'}</span>
                  <span>20%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🎟 {isVi ? 'Vé hoạt động tham quan & Lớp học nghệ thuật (Things To Do)' : 'Activities & Sightseeing'}</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: SYSTEM BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Danh sách hóa đơn lữ hành VietCharm' : 'All System Reservations'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] font-black uppercase text-stone-400 tracking-wider">
                  <th className="pb-3">{isVi ? 'Mã đơn' : 'ID'}</th>
                  <th className="pb-3">{isVi ? 'Khách hàng' : 'Traveler'}</th>
                  <th className="pb-3">{isVi ? 'Ngày đặt' : 'Date'}</th>
                  <th className="pb-3">{isVi ? 'Dịch vụ đã đặt' : 'Items'}</th>
                  <th className="pb-3 text-right">{isVi ? 'Doanh thu' : 'Final Total'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Trạng thái' : 'Status'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Hành động' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-3 font-mono font-bold text-natural-accent">{b.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-stone-800">{b.userName}</div>
                      <div className="text-[10px] text-stone-400">{b.userEmail}</div>
                    </td>
                    <td className="py-3 text-stone-500 font-medium">{b.date}</td>
                    <td className="py-3 max-w-[200px] truncate font-medium text-stone-600">
                      {b.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 text-right font-black text-stone-900">{b.finalTotal.toLocaleString()}đ</td>
                    <td className="py-3 text-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md"
                          title="Confirm / Pay"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md"
                          title="Cancel Booking"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 3: PARTNERSHIPS APPROVALS */}
      {activeTab === 'partners' && (
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Hồ sơ đề nghị hợp tác của tiểu thương / doanh nghiệp' : 'Regional Partnership Submissions'}
          </h3>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border border-stone-200 rounded-2xl p-4 space-y-3 hover:shadow-xs transition">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-mono text-[9px] text-stone-400 font-bold">{app.id}</span>
                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">{app.brandName}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : app.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 text-stone-600">
                    <p><strong>{isVi ? 'Liên hệ:' : 'Contact:'}</strong> {app.contactName}</p>
                    <p><strong>{isVi ? 'Điện thoại:' : 'Phone:'}</strong> {app.phone}</p>
                    <p><strong>{isVi ? 'Email:' : 'Email:'}</strong> {app.email}</p>
                    <p><strong>{isVi ? 'Lĩnh vực:' : 'Domain:'}</strong> <span className="uppercase font-bold text-natural-accent">{app.type}</span></p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3 text-stone-600 italic leading-relaxed border border-stone-100">
                    "{app.description}"
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-[11px] uppercase transition shadow-xs"
                    >
                      {isVi ? 'Phê duyệt hợp tác' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'rejected')}
                      className="bg-stone-200 hover:bg-red-100 text-stone-600 hover:text-red-700 font-bold px-4 py-1.5 rounded-lg text-[11px] uppercase transition"
                    >
                      {isVi ? 'Từ chối' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Cơ sở dữ liệu người dùng VietCharm' : 'User Accounts Directory'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] font-black uppercase text-stone-400 tracking-wider">
                  <th className="pb-3">{isVi ? 'Avatar' : 'Profile'}</th>
                  <th className="pb-3">{isVi ? 'Tên đăng nhập' : 'Username'}</th>
                  <th className="pb-3">{isVi ? 'Họ và tên' : 'FullName'}</th>
                  <th className="pb-3">{isVi ? 'Email / SĐT' : 'Contact'}</th>
                  <th className="pb-3">{isVi ? 'Vai trò' : 'System Role'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Chuyển đổi vai trò' : 'Alter Privilege'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="py-3">
                      <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                    </td>
                    <td className="py-3 font-mono font-bold text-stone-700">{u.username}</td>
                    <td className="py-3 font-semibold text-stone-800">{u.fullName}</td>
                    <td className="py-3 text-stone-600">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{u.phone}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => onUpdateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="bg-stone-100 hover:bg-natural-accent hover:text-white border border-stone-200 text-stone-600 font-bold px-3 py-1 rounded-lg text-[10px] uppercase transition"
                      >
                        {u.role === 'admin' ? (isVi ? 'Hạ cấp User' : 'Revoke Admin') : (isVi ? 'Thăng cấp Admin' : 'Make Admin')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 5: VOUCHERS CONTROL */}
      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-fade-in text-xs">
          
          {/* Create new voucher form */}
          <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
              {isVi ? 'Tạo mã Voucher mới' : 'Add Promo Coupon'}
            </h3>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mã ưu đãi (viết hoa)' : 'Coupon Code'}</label>
                <input 
                  type="text"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  placeholder="Ex: QUANGNAM30"
                  className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mô tả nội dung' : 'Coupon Description'}</label>
                <input 
                  type="text"
                  value={vDesc}
                  onChange={(e) => setVDesc(e.target.value)}
                  placeholder="Ex: Giảm giá 30% tối đa 150k"
                  className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Loại chiết khấu' : 'Type'}</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as any)}
                    className="w-full border border-natural-border bg-natural-cream rounded-xl px-2 py-2 outline-none font-bold text-stone-800"
                  >
                    <option value="percentage">% {isVi ? 'Phần trăm' : 'Percentage'}</option>
                    <option value="fixed">đ {isVi ? 'Tiền mặt' : 'Fixed Cash'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Giá trị giảm' : 'Value'}</label>
                  <input 
                    type="number"
                    value={vVal}
                    onChange={(e) => setVVal(Number(e.target.value))}
                    className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none font-bold"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Chi tiêu tối thiểu (VND)' : 'Min Spend (VND)'}</label>
                <input 
                  type="number"
                  value={vMin}
                  onChange={(e) => setVMin(Number(e.target.value))}
                  className="w-full border border-natural-border bg-natural-cream rounded-xl px-3 py-2 outline-none font-bold"
                  min={0}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-text font-black py-2.5 rounded-xl uppercase tracking-wider transition shadow-md"
              >
                {isVi ? 'CẤP PHÁT VOUCHER' : 'CREATE PROMO CODE'}
              </button>
            </form>
          </div>

          {/* Active vouchers list */}
          <div className="md:col-span-2 bg-white border border-natural-border rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
              {isVi ? 'Các mã Voucher đang hoạt động' : 'Active System Promo Codes'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <div key={v.code} className="bg-natural-cream border border-stone-200 p-4 rounded-2xl flex justify-between items-center hover:shadow-md transition">
                  <div className="space-y-1">
                    <span className="font-mono font-black text-natural-accent text-sm tracking-wider block">{v.code}</span>
                    <p className="text-[11px] text-stone-600 leading-normal">{v.description}</p>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {isVi ? 'Chi tiêu từ:' : 'Min Spend:'} {v.minSpend.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                    <span className="bg-natural-gold text-natural-text text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                      {v.discountType === 'percentage' ? `-${v.value}%` : `-${v.value.toLocaleString()}đ`}
                    </span>
                    <button
                      onClick={() => onDeleteVoucher(v.code)}
                      className="text-stone-400 hover:text-red-700 p-1"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
