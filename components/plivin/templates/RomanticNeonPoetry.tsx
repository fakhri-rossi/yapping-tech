'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

export default function RomanticNeonPoetry({
  recipientName = 'Sayang',
  greetingText,
  musicUrl = '/music/sound.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'visible' | 'fade-out'>('visible');

  const messages = greetingText
    ? greetingText.split('\n').filter((l) => l.trim().length > 0)
    : [
        `Halo, ${recipientName}...`,
        'Di hari spesialmu ini,',
        'Aku cuma mau ngingetin satu hal,',
        'Dunia ini lebih indah karena ada kamu.',
        'Selamat Ulang Tahun,',
        'Semoga semua mimpimu terwujud,',
        'Dan semoga aku selalu ada di sampingmu',
        'Untuk merayakannya setiap tahun.',
        'I love you. 🤍',
      ];

  // Particle generator
  const [particles] = useState<Array<{ id: number; width: number; left: number; top: number; delay: number; duration: number }>>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      width: Math.random() * 4 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
    }))
  );

  // Text slideshow interval
  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentLineIndex((prev) => (prev + 1) % messages.length);
        setFadeState('visible');
      }, 1000);
    }, 4000);

    return () => clearInterval(timer);
  }, [started, messages.length]);

  function handleStart() {
    setStarted(true);
  }

  return (
    <div className="relative min-h-screen w-full h-full flex flex-col flex-1 bg-[#0a0a0a] text-white items-center justify-center overflow-hidden font-sans">
      {/* Universal Audio/YouTube Player */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37] animate-pulse"
            style={{
              width: `${p.width}px`,
              height: `${p.width}px`,
              left: `${p.left}vw`,
              top: `${p.top}vh`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons (Kembali & Refresh) - Icon Only */}
      {showBackButton !== false && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Link
            href="/plivin/gift"
            title="Kembali ke Beranda"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            title="Muat Ulang"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </button>
        </div>
      )}

      {/* Start Button Screen */}
      {!started ? (
        <button
          onClick={handleStart}
          className="z-10 px-10 py-4 text-lg font-semibold bg-transparent border-2 border-[#d4af37] text-[#d4af37] rounded-lg tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#0a0a0a] hover:shadow-[0_0_25px_#d4af37] transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          ✨ Sentuh Untuk Memulai ✨
        </button>
      ) : (
        /* Message Display */
        <div className="z-10 text-center max-w-2xl px-6">
          <p
            className={`text-2xl md:text-4xl font-serif text-[#d4af37] tracking-wide leading-relaxed drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all duration-1000 ${
              fadeState === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`}
          >
            {messages[currentLineIndex]}
          </p>
        </div>
      )}
    </div>
  );
}
