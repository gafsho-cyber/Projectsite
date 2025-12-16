import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; type: ToastType; title: string; message?: string }

const ToastContext = createContext<{ notify: (t: Toast) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers: Record<string, number> = {} as any;
    toasts.forEach((t) => {
      if (!timers[t.id]) {
        timers[t.id] = window.setTimeout(() => {
          setToasts((s) => s.filter((x) => x.id !== t.id));
        }, 4000);
      }
    });
    return () => {
      Object.values(timers).forEach((id) => clearTimeout(id));
    };
  }, [toasts]);

  const notify = useCallback((t: Toast) => {
    setToasts((s) => [...s, t]);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full p-3 rounded shadow-lg text-sm ${t.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : t.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-white border'}`}>
            <div className="font-semibold">{t.title}</div>
            {t.message && <div className="text-xs mt-1">{t.message}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return {
    success: (title: string, message?: string) => ctx.notify({ id: `${Date.now()}`, type: 'success', title, message }),
    error: (title: string, message?: string) => ctx.notify({ id: `${Date.now()}`, type: 'error', title, message }),
    info: (title: string, message?: string) => ctx.notify({ id: `${Date.now()}`, type: 'info', title, message }),
  };
}
