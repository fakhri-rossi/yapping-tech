'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Image from 'next/image';

interface GenericTemplateProps extends TemplateProps {
  title?: string;
  themeColor?: string;
  emoji?: string;
}

export default function GenericTemplate({
  recipientName = 'Sahabatku',
  greetingText = 'Selamat Ulang Tahun! Semoga hari-harimu selalu dipenuhi kebahagiaan dan tawa.',
  photos = [],
  musicUrl = '/music/sound.mp3',
  title = 'Special Gift Experience',
  themeColor = 'bg-slate-900',
  emoji = '🎁',
  showBackButton = true,
}: GenericTemplateProps) {
  const [started, setStarted] = useState(false);

  function handleStart() {
    setStarted(true);
  }

  return (
    <div className={`min-h-screen ${themeColor} text-white relative overflow-hidden flex flex-col items-center justify-center font-sans p-6`}>
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} />

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

      {!started ? (
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{title}</h1>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            Kejutan spesial disiapkan khusus untuk <span className="font-bold text-white">{recipientName}</span>!
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-white text-black font-extrabold text-lg rounded-xl shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            Buka Kado Sekarang ✨
          </button>
        </div>
      ) : (
        <div className="max-w-2xl w-full text-center space-y-8 animate-fadeIn">
          <div className="text-6xl animate-pulse">{emoji}</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Untuk {recipientName}</h2>

          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 text-lg md:text-xl leading-relaxed font-medium">
            {greetingText}
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                  <Image src={photo} alt={`Photo ${i}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
