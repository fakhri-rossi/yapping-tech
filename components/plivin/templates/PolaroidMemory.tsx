'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Image from 'next/image';

export default function PolaroidMemory({
  recipientName = 'Sayangku',
greetingText = 'Setiap foto punya ceritanya sendiri, dan aku bersyukur kamu ada di semua cerita favoritku.',
  photos = [],
  musicUrl = '/music/sempurnanya-aku.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [activePhoto, setActivePhoto] = useState<{ img: string; caption: string } | null>(null);

  const defaultPhotos = [
    { img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', caption: 'Pertama kali ketemu' },
    { img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', caption: 'First Date kita!' },
    { img: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop', caption: 'Liburan bareng kamu' },
    { img: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=800&auto=format&fit=crop', caption: 'Ketawa mulu sama kamu' },
    { img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', caption: `Happy Anniversary Sayang!` },
  ];

  const photoItems = photos.length > 0
    ? photos.map((url, idx) => ({
        img: url,
        caption: defaultPhotos[idx % defaultPhotos.length].caption,
      }))
    : defaultPhotos;

  function handleStart() {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setStarted(true);
      setIsOpening(false);
    }, 700);
  }

  return (
    <div className="min-h-screen w-full h-full flex flex-col flex-1 bg-[#f4eee1] text-[#4a3b32] relative overflow-x-hidden font-sans">
      <style>{`
        @keyframes polaroidFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .polaroid-float-anim {
          animation: polaroidFloat 4s ease-in-out infinite;
        }

        @keyframes polaroidOpenExit {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0px); }
          30% { transform: scale(1.08) rotate(-2deg); }
          60% { transform: scale(1.18) rotate(3deg); opacity: 0.8; }
          100% { transform: scale(1.4) rotate(-5deg); opacity: 0; filter: blur(10px); }
        }

        .polaroid-opening {
          animation: polaroidOpenExit 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes polaroidPopIn {
          0% { transform: translateY(50px) scale(0.7) rotate(var(--rot-start, -10deg)); opacity: 0; }
          70% { transform: translateY(-8px) scale(1.03) rotate(var(--rot-target, 0deg)); opacity: 1; }
          100% { transform: translateY(0) scale(1) rotate(var(--rot-target, 0deg)); opacity: 1; }
        }

        .polaroid-card-anim {
          animation: polaroidPopIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .header-anim {
          animation: headerDrop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes headerDrop {
          0% { transform: translateY(-30px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Background Vintage Noise Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={44} />

      {/* Navigation Buttons (Kembali & Refresh) - Icon Only for Demo */}
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

      {/* Intro Screen */}
      {!started && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fdfbf7]/95 backdrop-blur-md p-4 ${
            isOpening ? 'polaroid-opening pointer-events-none' : ''
          }`}
        >
          <div className="text-center max-w-sm w-full bg-[#fdfbf7] border-2 border-[#cbd5e1] rounded-2xl p-8 shadow-[0_20px_40px_rgba(74,59,50,0.15)] relative">
            {/* Washi tape decoration */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-yellow-200/80 border border-black/10 shadow-xs -rotate-2"
              style={{ clipPath: 'polygon(0 0, 100% 5%, 98% 95%, 2% 100%)' }}
            />

            <div className="mb-4 text-6xl polaroid-float-anim select-none">
              {isOpening ? '✨' : '💌'}
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-[#4a3b32] font-bold mb-2">
              Album Spesial
            </h2>
            <p className="text-xs text-[#7d685c] mb-6 leading-relaxed">
              Sebuah kumpulan potret memori manis yang diabadikan khusus untuk <strong className="text-[#4a3b32]">{recipientName}</strong>.
            </p>

            <button
              onClick={handleStart}
              disabled={isOpening}
              className="w-full py-3.5 px-6 rounded-xl bg-[#4a3b32] hover:bg-[#362b24] active:scale-95 text-[#fdfbf7] font-semibold text-sm hover:scale-[1.03] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isOpening ? '✨' : '📸'}</span>
              <span>{isOpening ? 'Membuka Album... ✨' : 'Buka Kenangan Kita ✨'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-20 pb-32 flex flex-col items-center relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-xl header-anim">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
            🌸 Gallery of Moments
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-[#4a3b32] mb-4 -rotate-2 font-bold tracking-tight">
            Memori Kita
          </h1>
          <p className="text-[#7d685c] text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto">
            {greetingText}
          </p>
        </div>

        {/* Polaroid Gallery Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl w-full">
          {photoItems.map((item, idx) => {
            const rotations = [-4, 3, -2, 5, -5, 2];
            const rot = rotations[idx % rotations.length];
            const delaySec = 0.15 + idx * 0.12;

            return (
              <div
                key={idx}
                onClick={() => setActivePhoto(item)}
                className="polaroid-card-anim w-72 md:w-80 bg-[#fdfbf7] p-4 pb-14 rounded-xs shadow-xl relative transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-30 hover:shadow-2xl cursor-pointer group"
                style={
                  {
                    '--rot-target': `${rot}deg`,
                    '--rot-start': `${rot * 2}deg`,
                    animationDelay: `${delaySec}s`,
                    transform: `rotate(${rot}deg)`,
                  } as React.CSSProperties
                }
              >
                {/* Tape */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-yellow-100/80 border border-black/5 shadow-xs backdrop-blur-xs group-hover:bg-yellow-200 transition-colors"
                  style={{
                    clipPath: 'polygon(0 5%, 100% 0, 98% 95%, 2% 100%)',
                    transform: `translateX(-50%) rotate(${idx % 2 === 0 ? -3 : 3}deg)`,
                  }}
                />

                {/* Polaroid Image */}
                <div className="relative w-full aspect-square bg-slate-200 overflow-hidden shadow-inner rounded-xs">
                  <Image
                    src={item.img}
                    alt={item.caption}
                    fill
                    className="object-cover filter sepia-[30%] contrast-105 brightness-95 group-hover:filter-none group-hover:scale-105 transition-all duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      🔍 Perbesar
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-4 text-center font-serif text-xl md:text-2xl text-[#4a3b32] font-semibold tracking-wide">
                  {item.caption}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Photo Detail Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-[#fdfbf7] p-5 pb-10 rounded-xl max-w-md w-full shadow-2xl relative cursor-default transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#4a3b32] font-bold flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>
            <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden shadow-inner mb-4">
              <Image
                src={activePhoto.img}
                alt={activePhoto.caption}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <h3 className="font-serif text-2xl text-[#4a3b32] text-center font-bold">
              {activePhoto.caption}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
