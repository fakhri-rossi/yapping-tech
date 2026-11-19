'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start loading bar animation immediately on mount
    const t1 = setTimeout(() => setLoaded(true), 60);
    // Begin smooth fade-out after 2 seconds
    const t2 = setTimeout(() => setFadeOut(true), 2000);
    // Unmount from DOM after transition completes
    const t3 = setTimeout(() => setVisible(false), 2750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-white flex flex-col items-center justify-center transition-opacity duration-700 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <h1
        className="text-black text-4xl md:text-6xl font-bold tracking-tight mb-8"
        style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif" }}
      >
        plivin.co
      </h1>
      <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full"
          style={{
            width: loaded ? '100%' : '0%',
            transition: 'width 2000ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}
