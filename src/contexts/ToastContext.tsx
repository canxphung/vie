/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'info' | 'error';

export interface ToastInput {
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastItem extends ToastInput {
  id: string;
  type: ToastType;
}

export interface ToastValue {
  showToast: (toast: ToastInput) => void;
}

export const ToastContext = React.createContext<ToastValue | null>(null);

const TOAST_ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-natural-border bg-white text-natural-text',
  error: 'border-red-200 bg-red-50 text-red-900',
};

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback((toast: ToastInput) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const nextToast: ToastItem = {
      id,
      type: toast.type || 'info',
      title: toast.title,
      message: toast.message,
    };

    setToasts((prev) => [nextToast, ...prev].slice(0, 4));
    window.setTimeout(() => dismissToast(id), 3800);
  }, [dismissToast]);

  const value = React.useMemo<ToastValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 md:right-6">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type];
          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${TOAST_STYLES[toast.type]}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black leading-snug">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-xs font-medium leading-relaxed text-current/75">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-current/65 transition hover:bg-black/5 hover:text-current"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
