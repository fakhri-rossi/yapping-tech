'use client';

import { useState, useRef, useEffect } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import Image from 'next/image';

/* ============================================================
   Foto Kita Blur — Cinematic Story & Memories Unblur Template
   Premium, emotional, mobile-friendly vertical memory scroll.
   ============================================================ */

export default function FotoKitaBlur({
  recipientName = 'Adinda',
  greetingText = '',
  photos = [],
  musicUrl = '/music/foto-kita-blur.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [unblurredMap, setUnblurredMap] = useState<Record<number, boolean>>({});
  const [allUnblurred, setAllUnblurred] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  const defaultStorySections = [
    {
      title: 'Awal Yang Sunyi',
      quote: 'Dulu segalanya terasa samar, sampai langkahku membawaku padamu.',
      caption: 'Momen pertama saat semesta mempertemukan kita',
    },
    {
      title: 'Hadirnya Kehangatan',
      quote: 'Senyumanmu perlahan mengurai rasa sepi yang telah lama bersarang.',
      caption: 'Setiap detik bersamamu selalu terasa berarti',
    },
    {
      title: 'Melewati Hari Bersama',
      quote: 'Bersamamu, hari-hari biasa berubah menjadi kenangan paling berharga.',
      caption: 'Tawa dan cerita yang tak pernah habis kita bagi',
    },
    {
      title: 'Rumah Terbaikku',
      quote: `Terima kasih telah hadir dan menjadi bagian terindah dalam hidupku, ${recipientName}.`,
      caption: 'Hati ini memilihmu, untuk selamanya ✨',
    },
  ];

  const parsedGreetingLines = greetingText ? greetingText.split('\n').filter((l) => l.trim().length > 0) : [];

  const storyItems = displayPhotos.map((photo, idx) => {
    const defaultSec = defaultStorySections[idx % defaultStorySections.length];
    const customQuote = parsedGreetingLines[idx] || (idx === 0 && parsedGreetingLines.length > 0 ? parsedGreetingLines.join(' ') : defaultSec.quote);

    return {
      id: idx,
      img: photo,
      title: defaultSec.title,
      quote: customQuote,
      caption: defaultSec.caption,
    };
  });

  const [particles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 3,
    }))
  );

  function handleStart() {
    setIsOpening(true);
    setTimeout(() => {
      setStarted(true);
      setIsOpening(false);
    }, 600);
  }

  function togglePhotoUnblur(index: number) {
    setUnblurredMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function handleRevealAll() {
    const nextState = !allUnblurred;
    setAllUnblurred(nextState);
    const newMap: Record<number, boolean> = {};
    storyItems.forEach((_, idx) => {
      newMap[idx] = nextState;
    });
    setUnblurredMap(newMap);
  }

  return (
    <div className="min-h-screen w-full bg-[#08080c] text-stone-100 font-sans relative overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      <style>{`
        @keyframes floatDust {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        .dust-particle {
          animation: floatDust ease-in-out infinite alternate;
        }
        .serif-font {
          font-family: 'Playfair Display', Georgia, serif;
        }
        @keyframes softPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .soft-pulse {
          animation: softPulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Universal Background Music */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={44} />

      {/* Floating Particles in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,80,180,0.15),rgba(255,255,255,0))]" />
        {particles.map((p) => (
          <div
            key={p.id}
            className="dust-particle absolute rounded-full bg-amber-200/40 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Top Floating Navigation */}
      {showBackButton !== false && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Link
            href="/plivin/gift"
            title="Kembali ke Beranda"
            className="p-2.5 rounded-2xl bg-black/60 text-white/90 border border-white/15 hover:border-white hover:bg-black/90 hover:text-white transition-all shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            title="Muat Ulang"
            className="p-2.5 rounded-2xl bg-black/60 text-white/90 border border-white/15 hover:border-white hover:bg-black/90 hover:text-white transition-all shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </button>
        </div>
      )}

      {/* Landing Envelope / Intro Overlay */}
      {!started && (
        <div
          className={`fixed inset-0 z-50 bg-[#07070b]/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
            isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
            {/* Subtle glow circle */}
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-amber-500/20 border border-white/20 flex items-center justify-center text-3xl shadow-inner soft-pulse">
              ✨
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2 font-medium">A Special Gift for</p>
            <h1 className="serif-font text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-purple-200 bg-clip-text text-transparent">
              {recipientName}
            </h1>
            <p className="text-sm text-stone-300 font-light leading-relaxed mb-8">
              Sebuah kumpulan memori dan cerita kecil yang tersimpan rapi. Buka dan singkap setiap kenangan kita bersama.
            </p>

            <button
              onClick={handleStart}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-white/95 to-amber-100 text-stone-950 font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Buka Kenangan Kita</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Story Scroll Experience */}
      {started && (
        <main className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-20 pb-32 flex flex-col items-center">
          {/* Header Banner */}
          <div className="text-center mb-10 w-full animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-light text-amber-200/90 mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Sentuh foto untuk memperjelas buram</span>
            </div>
            <h1 className="serif-font text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Kisah Kita, {recipientName}
            </h1>
            <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
              Setiap foto menyimpan cerita yang takkan pudar. Gulir ke bawah untuk menelusuri setiap momennya.
            </p>

            {/* Quick Action Button */}
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleRevealAll}
                className="px-4 py-2 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-stone-200 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{allUnblurred ? '🔒 Buramkan Semua' : '✨ Buka/Fokuskan Semua Foto'}</span>
              </button>
            </div>
          </div>

          {/* Timeline & Photo Cards */}
          <div className="w-full space-y-12">
            {storyItems.map((item, index) => {
              const isItemUnblurred = unblurredMap[index] ?? allUnblurred;

              return (
                <div
                  key={item.id}
                  className="relative group rounded-3xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-white/20"
                >
                  {/* Step Number Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-medium tracking-widest text-amber-400/80 uppercase">
                      Memory 0{index + 1}
                    </span>
                    <span className="text-[11px] text-stone-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/5">
                      {isItemUnblurred ? 'Foto Terfokus 👁️' : 'Foto Buram 🌫️'}
                    </span>
                  </div>

                  {/* Photo Container with Interactive Blur */}
                  <div
                    onClick={() => togglePhotoUnblur(index)}
                    className="relative w-full aspect-[4/5] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-stone-900 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 550px"
                      className={`object-cover transition-all duration-700 ease-out transform ${
                        isItemUnblurred
                          ? 'filter-none scale-100 brightness-100'
                          : 'filter blur-[28px] brightness-[0.45] scale-105 group-hover:scale-110'
                      }`}
                    />

                    {/* Hint overlay when blurred */}
                    {!isItemUnblurred && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
                          ✨
                        </div>
                        <p className="text-xs font-medium text-white/90 drop-shadow-md">
                          Klik untuk menyingkap foto
                        </p>
                      </div>
                    )}

                    {/* Zoom / Fullscreen Button on Corner */}
                    {isItemUnblurred && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoModal(item.img);
                        }}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 text-white/90 backdrop-blur-md border border-white/20 hover:bg-black/80 hover:text-white transition-all shadow-md text-xs flex items-center gap-1"
                        title="Perbesar Foto"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        <span>Lihat</span>
                      </button>
                    )}
                  </div>

                  {/* Story & Quote Section */}
                  <div className="mt-5 space-y-2">
                    <h2 className="serif-font text-xl font-semibold text-stone-100">
                      {item.title}
                    </h2>
                    <p className="text-sm font-light text-stone-300 leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <p className="text-xs text-amber-200/70 pt-1 font-medium">
                      — {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sweet Closing Letter Card */}
          <div className="w-full mt-16 p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl">
              💌
            </div>
            <h3 className="serif-font text-2xl font-bold text-white">
              Untuk {recipientName} Tercinta
            </h3>
            <p className="text-sm font-light text-stone-300 leading-relaxed">
              {greetingText ||
                `Terima kasih telah menemani setiap langkah dan mengukir begitu banyak cerita indah. Semoga kebahagiaan dan kehangatan selalu menyertai hari-harimu. Aku mencintaimu selamanya. 🤍`}
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-stone-400 font-mono">Forever and always</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-2 text-xs text-amber-300/90 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span>Kembali ke Atas</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={activePhotoModal}
              alt="Foto Kenangan"
              fill
              unoptimized
              className="object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 text-white border border-white/20 hover:bg-black transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

