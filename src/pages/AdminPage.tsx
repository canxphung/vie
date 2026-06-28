/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { useI18n, useAuth, useCatalog, useUI } from '@/hooks';

export default function AdminPage() {
  const { language, isVi } = useI18n();
  const { currentUser, users, setUserRole } = useAuth();
  const { applications, vouchers, bookings, setApplicationStatus, setBookingStatus, addVoucher, deleteVoucher } = useCatalog();
  const { setView } = useUI();
  return (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            {currentUser?.role === 'admin' ? (
              <AdminDashboard 
                language={language}
                users={users}
                onUpdateUserRole={(userId, newRole) => setUserRole(userId, newRole)}
                applications={applications}
                onUpdateApplicationStatus={(appId, newStatus) => setApplicationStatus(appId, newStatus)}
                bookings={bookings}
                onUpdateBookingStatus={(bkId, newStatus) => setBookingStatus(bkId, newStatus)}
                vouchers={vouchers}
                onAddNewVoucher={(newV) => addVoucher(newV)}
                onDeleteVoucher={(vCode) => deleteVoucher(vCode)}
              />
            ) : (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">{isVi ? 'Không có quyền truy cập!' : 'Access Denied!'}</h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">{isVi ? 'Bạn cần tài khoản có quyền Quản trị viên để truy cập trang thông số dữ liệu này.' : 'Administrator role required to query service catalogs.'}</p>
                <button onClick={() => setView('regions')} className="bg-natural-accent text-white px-5 py-2 rounded-xl text-xs font-bold transition">
                  {isVi ? 'Quay về trang chủ' : 'Return home'}
                </button>
              </div>
            )}
          </motion.div>
  );
}
