'use client';

// Modern 3D-styled Gradient Vector Icons
function FlameIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.4" stopColor="#f97316" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C9.5 6 6 8.5 6 13.5C6 17.5 8.7 21 12 21C15.3 21 18 17.5 18 13.5C18 8 13.5 5 12 2Z"
        fill="url(#flameGrad)"
      />
      <path
        d="M12 11C10.5 13 9 14.5 9 16.5C9 18.5 10.3 20 12 20C13.7 20 15 18.5 15 16.5C15 14 13 12.5 12 11Z"
        fill="#fef08a"
        opacity="0.9"
      />
    </svg>
  );
}

function GiftIcon({ className = 'w-6 h-6 inline-block align-middle' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="giftBoxGrad" x1="2" y1="8" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="giftRibbonGrad" x1="14" y1="2" x2="14" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#facc15" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
      </defs>
      {/* Box Body */}
      <rect x="4" y="11" width="20" height="13" rx="3" fill="url(#giftBoxGrad)" stroke="#18181b" strokeWidth="2" />
      {/* Box Lid */}
      <rect x="2" y="7" width="24" height="5" rx="2" fill="url(#giftBoxGrad)" stroke="#18181b" strokeWidth="2" />
      {/* Vertical Ribbon */}
      <rect x="12" y="7" width="4" height="17" fill="url(#giftRibbonGrad)" stroke="#18181b" strokeWidth="1.5" />
      {/* Ribbon Bow */}
      <path
        d="M10 6C8 3 4 3 6 6C8 8 12 7 14 7C16 7 20 8 22 6C24 3 20 3 18 6C16 7.5 15 7.5 14 7"
        fill="url(#giftRibbonGrad)"
        stroke="#18181b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sparkleGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbcfe8" />
          <stop offset="0.5" stopColor="#f472b6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
        fill="url(#sparkleGrad)"
        stroke="#18181b"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LightningIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lightGrad" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#facc15" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <path
        d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
        fill="url(#lightGrad)"
        stroke="#18181b"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MusicIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="musicGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#be185d" />
        </linearGradient>
      </defs>
      <path
        d="M9 18V5L20 3V16"
        stroke="#18181b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3.5" fill="url(#musicGrad)" stroke="#18181b" strokeWidth="2" />
      <circle cx="17" cy="16" r="3.5" fill="url(#musicGrad)" stroke="#18181b" strokeWidth="2" />
    </svg>
  );
}

function CameraIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="camGrad" x1="2" y1="6" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect x="2" y="6" width="20" height="15" rx="3" fill="url(#camGrad)" stroke="#18181b" strokeWidth="2" />
      <circle cx="12" cy="13.5" r="4" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="12" cy="13.5" r="2" fill="#18181b" />
      <path d="M8 6L9.5 3H14.5L16 6" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function LinkChainIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="linkGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path
        d="M10 13C10.6 14.2 11.8 15 13.2 15H17C19.2 15 21 13.2 21 11C21 8.8 19.2 7 17 7H13.2C12 7 10.9 7.6 10.3 8.5M14 11C13.4 9.8 12.2 9 10.8 9H7C4.8 9 3 10.8 3 13C3 15.2 4.8 17 7 17H10.8C12 17 13.1 16.4 13.7 15.5"
        stroke="url(#linkGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfinityIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="infGrad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path
        d="M6.5 7.5C4 7.5 2 9.5 2 12C2 14.5 4 16.5 6.5 16.5C9.5 16.5 12 12 12 12C12 12 14.5 7.5 17.5 7.5C20 7.5 22 9.5 22 12C22 14.5 20 16.5 17.5 16.5C14.5 16.5 12 12 12 12C12 12 9.5 7.5 6.5 7.5Z"
        stroke="url(#infGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RocketIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rockBody" x1="6" y1="2" x2="20" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#fecdd3" />
        </linearGradient>
      </defs>
      <path
        d="M14.5 3.5C14.5 3.5 19.5 4.5 20.5 9.5C20.5 12 19 14.5 17.5 16L14 12.5L11.5 10L14.5 3.5Z"
        fill="url(#rockBody)"
        stroke="#18181b"
        strokeWidth="2"
      />
      <circle cx="16" cy="8" r="1.5" fill="#e11d48" />
      <path d="M14 12.5L10 16.5L6.5 16L7 13.5L11.5 10" fill="#f43f5e" stroke="#18181b" strokeWidth="1.8" />
      <path d="M8 18L4 21L5 17" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeCatalogIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eyeGrad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#64748b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <path
        d="M2 12C4.5 6 9.5 3 12 3C14.5 3 19.5 6 22 12C19.5 18 14.5 21 12 21C9.5 21 4.5 18 2 12Z"
        stroke="url(#eyeGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" fill="#f43f5e" stroke="#18181b" strokeWidth="1.5" />
    </svg>
  );
}

function LockSecurityIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockGrad" x1="4" y1="10" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb7185" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="16" height="12" rx="3" fill="url(#lockGrad)" stroke="#18181b" strokeWidth="2" />
      <path d="M8 10V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V10" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.5" fill="#ffffff" />
    </svg>
  );
}

import { useLanguage } from '@context/LanguageContext';
import Link from 'next/link';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <header className="text-center pt-24 sm:pt-32 md:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Trending Flash Sale Pill */}
      <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-rose-50 border-2 border-black text-rose-700 font-black text-[11px] sm:text-xs uppercase tracking-wider mb-5 sm:mb-7 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <FlameIcon className="w-4 h-4" />
        <span>{t.hero.viralBadge}</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black mb-5 sm:mb-7 leading-[1.15] sm:leading-[1.12] max-w-4xl mx-auto">
        {t.hero.headlinePart1}{' '}
        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent underline decoration-rose-500 decoration-wavy underline-offset-8">
          {t.hero.headlineHighlight}
        </span>{' '}
        {t.hero.headlinePart2}{' '}
        <GiftIcon className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 inline-block align-middle ml-1 -mt-2 drop-shadow-md" />
      </h1>

      {/* Subheadline */}
      <p className="text-slate-700 text-sm sm:text-base md:text-lg max-w-2xl sm:max-w-3xl mx-auto font-bold mb-8 sm:mb-10 leading-relaxed sm:leading-loose flex items-center justify-center flex-wrap gap-1.5">
        <span>{t.hero.subheadline}</span>
        <SparkleIcon className="w-4 h-4 inline-block text-rose-500 animate-pulse" />
      </p>

      {/* Feature Badges with Custom 3D Vector Icons */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 text-[11px] sm:text-xs font-black">
        <span className="px-3.5 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 flex items-center gap-2">
          <LightningIcon className="w-4 h-4" />
          <span>{t.hero.badge1Min}</span>
        </span>
        <span className="px-3.5 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 flex items-center gap-2">
          <MusicIcon className="w-4 h-4" />
          <span>{t.hero.badgeMusic}</span>
        </span>
        <span className="px-3.5 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 flex items-center gap-2">
          <CameraIcon className="w-4 h-4" />
          <span>{t.hero.badgeMedia}</span>
        </span>
        <span className="px-3.5 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 flex items-center gap-2">
          <LinkChainIcon className="w-4 h-4" />
          <span>{t.hero.badgeCustomLink}</span>
        </span>
        <span className="px-3.5 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 flex items-center gap-2">
          <InfinityIcon className="w-4 h-4" />
          <span>{t.hero.badgeForever}</span>
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-10 sm:mb-14 w-full max-w-md sm:max-w-none mx-auto">
        <a
          href="#orderSection"
          className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-black text-white font-black text-xs sm:text-sm md:text-base rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(244,63,94,1)] hover:bg-rose-600 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RocketIcon className="w-5 h-5" />
          <span>{t.hero.ctaOrder}</span>
        </a>
        <Link
          href="/katalog"
          className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-black text-xs sm:text-sm md:text-base rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <EyeCatalogIcon className="w-5 h-5" />
          <span>{t.hero.ctaExplore}</span>
        </Link>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl sm:max-w-3xl mx-auto pt-2 sm:pt-4">
        <div className="bg-white border-2 border-black rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-start gap-3.5 text-xs font-extrabold text-black">
          <div className="p-2.5 bg-amber-100 rounded-xl border border-black shrink-0 shadow-xs flex items-center justify-center">
            <LightningIcon className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <span className="block font-black text-black text-xs sm:text-sm mb-0.5">{t.hero.trust1Title}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">{t.hero.trust1Desc}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-start gap-3.5 text-xs font-extrabold text-black">
          <div className="p-2.5 bg-rose-100 rounded-xl border border-black shrink-0 shadow-xs flex items-center justify-center">
            <LockSecurityIcon className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <span className="block font-black text-black text-xs sm:text-sm mb-0.5">{t.hero.trust2Title}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">{t.hero.trust2Desc}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
