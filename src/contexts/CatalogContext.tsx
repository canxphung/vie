/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { PartnershipApplication, PromoVoucher, SystemBooking } from '@/types';
import { DEFAULT_PARTNERSHIPS } from '@/constants/seed/partnerships';
import { DEFAULT_VOUCHERS } from '@/constants/seed/vouchers';
import { DEFAULT_SYSTEM_BOOKINGS } from '@/constants/seed/bookings';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface CatalogValue {
  applications: PartnershipApplication[];
  vouchers: PromoVoucher[];
  bookings: SystemBooking[];
  addApplication: (app: PartnershipApplication) => void;
  setApplicationStatus: (id: string, status: PartnershipApplication['status']) => void;
  setBookingStatus: (id: string, status: SystemBooking['status']) => void;
  addVoucher: (voucher: PromoVoucher) => void;
  deleteVoucher: (code: string) => void;
}

export const CatalogContext = React.createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children?: React.ReactNode }) {
  const [applications, setApplications] = useLocalStorage<PartnershipApplication[]>(
    STORAGE_KEYS.applications,
    DEFAULT_PARTNERSHIPS,
  );
  const [vouchers, setVouchers] = useLocalStorage<PromoVoucher[]>(STORAGE_KEYS.vouchers, DEFAULT_VOUCHERS);
  const [bookings, setBookings] = useLocalStorage<SystemBooking[]>(STORAGE_KEYS.bookings, DEFAULT_SYSTEM_BOOKINGS);

  const value = React.useMemo<CatalogValue>(
    () => ({
      applications,
      vouchers,
      bookings,
      addApplication: (app) => setApplications((prev) => [app, ...prev]),
      setApplicationStatus: (id, status) =>
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
      setBookingStatus: (id, status) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b))),
      addVoucher: (voucher) => setVouchers((prev) => [voucher, ...prev]),
      deleteVoucher: (code) => setVouchers((prev) => prev.filter((v) => v.code !== code)),
    }),
    [applications, vouchers, bookings, setApplications, setVouchers, setBookings],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  const ctx = React.useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within <CatalogProvider>');
  return ctx;
}
