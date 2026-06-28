/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateFieldProps {
  /** Selected date as yyyy-mm-dd. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable date as yyyy-mm-dd (inclusive). */
  min?: string;
  isVi: boolean;
  ariaLabel?: string;
  /** Classes for the trigger button (so callers control field look). */
  className?: string;
  /** Align the popup to the right edge of the trigger instead of the left. */
  align?: 'left' | 'right';
  /** Show the leading calendar icon in the trigger (default true). */
  showIcon?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Local (not UTC) yyyy-mm-dd to avoid timezone off-by-one. */
function toYMD(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseYMD(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(value: string, isVi: boolean): string {
  const date = parseYMD(value);
  if (!date) return isVi ? 'Chọn ngày' : 'Select date';
  return isVi
    ? date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const WEEKDAYS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function DateField({ value, onChange, min, isVi, ariaLabel, className = '', align = 'left', showIcon = true }: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Close the popup and return focus to the trigger (keyboard users don't get stranded).
  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const selected = parseYMD(value);
  const minDate = min ? parseYMD(min) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The month currently shown in the calendar grid.
  const [viewDate, setViewDate] = React.useState(() => selected ?? today);

  // Jump the grid to the selected month whenever the value changes while closed.
  React.useEffect(() => {
    if (selected) setViewDate(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // On open, move focus into the grid without scrolling the page (avoids jumpy scroll).
  React.useEffect(() => {
    if (!open) return;
    const target = gridRef.current?.querySelector<HTMLButtonElement>('[data-autofocus="true"]');
    target?.focus({ preventScroll: true });
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset (JS: 0=Sun..6=Sat).
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const monthLabel = isVi
    ? `Tháng ${month + 1}, ${year}`
    : viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const isDisabled = (d: Date) => (minDate ? d < minDate : false);
  const sameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // Disable the "previous month" arrow once we reach the min month.
  const prevDisabled = !!minDate && year === minDate.getFullYear() && month <= minDate.getMonth();

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={className}
      >
        {showIcon && <Calendar className="w-4 h-4 text-amber-500 shrink-0" />}
        <span className="truncate">{formatDisplay(value, isVi)}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={isVi ? 'Chọn ngày' : 'Choose date'}
          className={`absolute top-full z-50 mt-2 w-[min(20rem,calc(100vw_-_1.5rem))] max-w-[calc(100vw_-_1.5rem)] rounded-2xl border border-natural-border bg-white p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Month navigation */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              disabled={prevDisabled}
              aria-label={isVi ? 'Tháng trước' : 'Previous month'}
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-natural-beige disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-natural-text" aria-live="polite">{monthLabel}</span>
            <button
              type="button"
              aria-label={isVi ? 'Tháng sau' : 'Next month'}
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-natural-beige cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday header */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {(isVi ? WEEKDAYS_VI : WEEKDAYS_EN).map((w) => (
              <span key={w} className="py-1 text-center text-[10px] font-bold uppercase text-stone-400">
                {w}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div ref={gridRef} className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <span key={`b-${idx}`} />;
              const date = new Date(year, month, day);
              const disabled = isDisabled(date);
              const isSelected = sameDay(date, selected);
              const isToday = sameDay(date, today);
              // Focus the selected day on open (or today when nothing is selected).
              const autoFocus = isSelected || (!selected && isToday);
              const fullLabel = date.toLocaleDateString(isVi ? 'vi-VN' : 'en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  data-autofocus={autoFocus || undefined}
                  aria-label={fullLabel}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(toYMD(date));
                    close();
                  }}
                  className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-natural-accent text-white shadow-sm'
                      : disabled
                        ? 'text-stone-300 cursor-not-allowed'
                        : isToday
                          ? 'bg-natural-beige text-natural-accent'
                          : 'text-stone-700 hover:bg-natural-beige'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
