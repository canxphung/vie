/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Container, DateField } from '@/components/ui';
import type { BookingSearchCriteria } from '@/types';

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

interface ProvinceSearchBarProps {
  isVi: boolean;
  labels: {
    heroSearchTitle: string;
    searchPlaceholder: string;
    checkIn: string;
    checkOut: string;
    guestsNum: string;
    searchBtn: string;
  };
  value: BookingSearchCriteria;
  onSearch: (criteria: BookingSearchCriteria) => void;
}

export function ProvinceSearchBar({ isVi, labels, value, onSearch }: ProvinceSearchBarProps) {
  const initialDates = React.useMemo(() => {
    const today = new Date();
    const checkIn = addDays(today, 1);
    const checkOut = addDays(checkIn, 4);
    return {
      checkIn: formatDateInput(checkIn),
      checkOut: formatDateInput(checkOut),
      minCheckIn: formatDateInput(today),
    };
  }, []);
  const [searchQuery, setSearchQuery] = React.useState(value.query);
  const [checkInDate, setCheckInDate] = React.useState(value.checkInDate || initialDates.checkIn);
  const [checkOutDate, setCheckOutDate] = React.useState(value.checkOutDate || initialDates.checkOut);
  const [guestsCount, setGuestsCount] = React.useState(value.guestsCount || 1);
  const [roomsCount, setRoomsCount] = React.useState(value.roomsCount || 1);
  const [showGuestsDropdown, setShowGuestsDropdown] = React.useState(false);

  React.useEffect(() => {
    setSearchQuery(value.query);
    setCheckInDate(value.checkInDate || initialDates.checkIn);
    setCheckOutDate(value.checkOutDate || initialDates.checkOut);
    setGuestsCount(value.guestsCount || 1);
    setRoomsCount(value.roomsCount || 1);
  }, [initialDates.checkIn, initialDates.checkOut, value]);
  const minCheckOutDate = React.useMemo(() => {
    const parsedCheckIn = new Date(`${checkInDate}T00:00:00`);
    return formatDateInput(addDays(parsedCheckIn, 1));
  }, [checkInDate]);

  const handleCheckInChange = (value: string) => {
    setCheckInDate(value);
    if (checkOutDate <= value) {
      const parsedCheckIn = new Date(`${value}T00:00:00`);
      setCheckOutDate(formatDateInput(addDays(parsedCheckIn, 1)));
    }
  };

  const handleSearch = () => {
    onSearch({
      query: searchQuery.trim(),
      checkInDate,
      checkOutDate,
      guestsCount,
      roomsCount,
    });
  };

  return (
    <Container className="-translate-y-10 sm:-translate-y-14 relative z-30">
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl border border-amber-200 flex flex-col md:flex-row gap-4 items-stretch justify-between">
        <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:pr-4">
          <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{labels.heroSearchTitle}</span>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full text-xs sm:text-sm font-bold bg-transparent outline-none text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:px-4">
          <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{labels.checkIn}</span>
          <DateField
            value={checkInDate}
            min={initialDates.minCheckIn}
            onChange={handleCheckInChange}
            isVi={isVi}
            ariaLabel={labels.checkIn}
            className="flex w-full items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-700 cursor-pointer"
          />
        </div>

        <div className="flex-1 space-y-1 border-b md:border-b-0 md:border-r border-stone-150 pb-3 md:pb-0 md:px-4">
          <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{labels.checkOut}</span>
          <DateField
            value={checkOutDate}
            min={minCheckOutDate}
            onChange={setCheckOutDate}
            isVi={isVi}
            ariaLabel={labels.checkOut}
            className="flex w-full items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-700 cursor-pointer"
          />
        </div>

        <div className="flex-1 space-y-1 border-b md:border-b-0 pb-3 md:pb-0 md:px-4 relative">
          <span className="text-[10px] uppercase font-black text-stone-400 block tracking-wider">{labels.guestsNum}</span>
          <button
            type="button"
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            className="flex items-center justify-between w-full text-left bg-transparent hover:bg-stone-50/50 p-1 -m-1 rounded-lg transition duration-150 group"
          >
            <span className="text-xs sm:text-sm font-bold text-stone-700 block">
              {isVi
                ? `${guestsCount} Khách, ${roomsCount} Phòng`
                : `${guestsCount} ${guestsCount > 1 ? 'Guests' : 'Guest'}, ${roomsCount} ${roomsCount > 1 ? 'Rooms' : 'Room'}`}
            </span>
            <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition" />
          </button>

          {showGuestsDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowGuestsDropdown(false)} />
              <div className="absolute left-0 md:right-0 top-full mt-2 w-64 bg-white border border-natural-border rounded-2xl shadow-xl p-4 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-800 block">{isVi ? 'Số khách' : 'Guests'}</span>
                    <span className="text-[10px] text-stone-500 block">{isVi ? 'Người lớn & trẻ em' : 'Adults & children'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={guestsCount <= 1} onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition text-sm cursor-pointer">-</button>
                    <span className="w-4 text-center text-xs font-bold text-stone-800">{guestsCount}</span>
                    <button type="button" disabled={guestsCount >= 20} onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))} className="w-8 h-8 rounded-full border border-natural-accent flex items-center justify-center text-natural-accent font-bold hover:bg-amber-50/50 transition text-sm cursor-pointer">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-800 block">{isVi ? 'Số phòng' : 'Rooms'}</span>
                    <span className="text-[10px] text-stone-500 block">{isVi ? 'Số phòng ngủ cần đặt' : 'Rooms needed'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={roomsCount <= 1} onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition text-sm cursor-pointer">-</button>
                    <span className="w-4 text-center text-xs font-bold text-stone-800">{roomsCount}</span>
                    <button type="button" disabled={roomsCount >= 10} onClick={() => setRoomsCount(Math.min(10, roomsCount + 1))} className="w-8 h-8 rounded-full border border-natural-accent flex items-center justify-center text-natural-accent font-bold hover:bg-amber-50/50 transition text-sm cursor-pointer">+</button>
                  </div>
                </div>

                <button type="button" onClick={() => setShowGuestsDropdown(false)} className="w-full bg-natural-accent hover:bg-natural-olive text-white py-2 rounded-xl text-xs font-bold transition duration-200 uppercase tracking-wider shadow-sm cursor-pointer">
                  {isVi ? 'Áp dụng' : 'Apply'}
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="bg-natural-gold-deep hover:bg-natural-gold-dark text-stone-950 font-black px-6 py-3 rounded-2xl transition shadow-md md:w-fit uppercase text-xs md:text-sm tracking-wide self-center shrink-0"
        >
          {labels.searchBtn}
        </button>
      </div>
    </Container>
  );
}
