'use client';

import { useEffect, useState } from 'react';
import { LIVE_ORDER_BUYERS } from '@config/gifts';

export default function LiveOrderToast() {
  const [toast, setToast] = useState<{ name: string; template: string; target: string } | null>(null);
  const [exiting, setExiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= LIVE_ORDER_BUYERS.length) return;

    const showTimer = setTimeout(() => {
      setToast(LIVE_ORDER_BUYERS[currentIndex]);
      setExiting(false);

      const dismissTimer = setTimeout(() => {
        setExiting(true);
        const hideTimer = setTimeout(() => {
          setToast(null);
          setCurrentIndex((prev) => prev + 1);
        }, 500);
        return () => clearTimeout(hideTimer);
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }, currentIndex === 0 ? 3500 : 10000);

    return () => clearTimeout(showTimer);
  }, [currentIndex]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[999999] bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] max-w-sm flex items-center gap-3 transition-all duration-500 ease-out ${
        exiting
          ? 'translate-y-[150%] scale-90 opacity-0'
          : 'animate-slide-up'
      }`}
    >
      <div className="w-10 h-10 bg-rose-100 border border-black rounded-lg flex items-center justify-center text-xl shrink-0">
        🎉
      </div>
      <div className="text-xs">
        <p className="font-bold text-black">{toast.name} baru saja memesan!</p>
        <p className="text-slate-600 font-medium">
          Template <span className="text-rose-600 font-bold">{toast.template}</span> untuk{' '}
          {toast.target}.
        </p>
      </div>
    </div>
  );
}
