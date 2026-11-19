import { TemplateData } from '@type/gift';
import { formatRupiah } from '@config/gifts';
import Image from 'next/image';

// Color theme config for featured cards (special colored borders/shadows)
const THEME_CONFIG: Record<string, {
  border: string;
  shadow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  btnPrimary: string;
  btnPrimaryHover: string;
  btnOutline: string;
  btnOutlineHover: string;
  accentGradient: string;
  highlightPill: string;
}> = {
  rose: {
    border: 'border-rose-200 hover:border-rose-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(244,63,94,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(244,63,94,0.28)]',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    btnPrimary: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-200',
    btnPrimaryHover: 'hover:from-rose-600 hover:to-pink-700',
    btnOutline: 'border-rose-200 text-rose-700 hover:bg-rose-50/70',
    btnOutlineHover: 'hover:border-rose-300',
    accentGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    highlightPill: 'bg-rose-100/90 text-rose-800 border-rose-300',
  },
  pink: {
    border: 'border-pink-200 hover:border-pink-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(236,72,153,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(236,72,153,0.28)]',
    badgeBg: 'bg-pink-50',
    badgeBorder: 'border-pink-200',
    badgeText: 'text-pink-700',
    btnPrimary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200',
    btnPrimaryHover: 'hover:from-pink-600 hover:to-rose-600',
    btnOutline: 'border-pink-200 text-pink-700 hover:bg-pink-50/70',
    btnOutlineHover: 'hover:border-pink-300',
    accentGradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
    highlightPill: 'bg-pink-100/90 text-pink-800 border-pink-300',
  },
  blue: {
    border: 'border-sky-200 hover:border-sky-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(14,165,233,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(14,165,233,0.28)]',
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200',
    badgeText: 'text-sky-700',
    btnPrimary: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-200',
    btnPrimaryHover: 'hover:from-sky-600 hover:to-blue-700',
    btnOutline: 'border-sky-200 text-sky-700 hover:bg-sky-50/70',
    btnOutlineHover: 'hover:border-sky-300',
    accentGradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    highlightPill: 'bg-sky-100/90 text-sky-800 border-sky-300',
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(168,85,247,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(168,85,247,0.28)]',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    btnPrimary: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-200',
    btnPrimaryHover: 'hover:from-purple-600 hover:to-indigo-700',
    btnOutline: 'border-purple-200 text-purple-700 hover:bg-purple-50/70',
    btnOutlineHover: 'hover:border-purple-300',
    accentGradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    highlightPill: 'bg-purple-100/90 text-purple-800 border-purple-300',
  },
  emerald: {
    border: 'border-emerald-200 hover:border-emerald-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(16,185,129,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.28)]',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    btnPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-200',
    btnPrimaryHover: 'hover:from-emerald-600 hover:to-teal-700',
    btnOutline: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50/70',
    btnOutlineHover: 'hover:border-emerald-300',
    accentGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    highlightPill: 'bg-emerald-100/90 text-emerald-800 border-emerald-300',
  },
  amber: {
    border: 'border-amber-200 hover:border-amber-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(245,158,11,0.18)] hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.28)]',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    btnPrimary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200',
    btnPrimaryHover: 'hover:from-amber-600 hover:to-orange-600',
    btnOutline: 'border-amber-200 text-amber-800 hover:bg-amber-50/70',
    btnOutlineHover: 'hover:border-amber-300',
    accentGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    highlightPill: 'bg-amber-100/90 text-amber-900 border-amber-300',
  },
  black: {
    border: 'border-slate-200 hover:border-slate-400',
    shadow: 'shadow-[0_10px_30px_-10px_rgba(15,23,42,0.15)] hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.25)]',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-200',
    badgeText: 'text-slate-900',
    btnPrimary: 'bg-gradient-to-r from-slate-900 to-zinc-900 text-white shadow-slate-200',
    btnPrimaryHover: 'hover:from-slate-800 hover:to-zinc-800',
    btnOutline: 'border-slate-300 text-slate-800 hover:bg-slate-100',
    btnOutlineHover: 'hover:border-slate-400',
    accentGradient: 'from-slate-500/10 via-zinc-500/5 to-transparent',
    highlightPill: 'bg-slate-100 text-slate-900 border-slate-300',
  },
};

interface TemplateCardProps {
  template: TemplateData;
  variant?: 'featured' | 'catalog';
  onSelect: (templateTitle: string) => void;
}

// Map template icons that use 3D SVG/PNG illustrations
const ICON_IMAGES: Record<string, string> = {
  'retro-digicam-y2k': '/icons/3d/digicam.svg',
  'love-receipt': '/icons/3d/receipt.svg',
  'maroon-birthday-surprise': '/icons/3d/padlock.svg',
  'love-arcade-letter': '/icons/3d/gamepad.svg',
  'romantic-neon-poetry': '/icons/3d/poetry.svg',
  'bouquet-of-love': '/icons/3d/bouquet.svg',
  'date-invitation': '/icons/3d/envelope.svg',
  'safe-and-sound-windah': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbZNUeNNuztJFfn95VrDynrImQdKJ2w09eIAega6IvQ&s=10',
  'foto-kita-blur': '/icons/3d/polaroid.svg',
  'kicau-mania-spesial': 'https://media.tenor.com/UkshIJcvqR0AAAAe/kicau-mania-scuba-kicau.png',
  'paper-scrapbook-memory': '/icons/3d/cake.svg',
  'vintage-camera': '/icons/3d/vintage-camera.svg',
  'polaroid-memory': '/icons/3d/polaroid.svg',
  'journey-timeline': '/icons/3d/hourglass.svg',
  'golden-wisuda': '/icons/3d/graduation.svg',
  'interactive-3d-book': '/icons/3d/book.svg',
  'classic-academic': '/icons/3d/diploma.svg',
  'interactive-2d-wedding': '/icons/3d/ring.svg',
};

import { useLanguage } from '@context/LanguageContext';

export default function TemplateCard({ template, variant = 'catalog', onSelect }: TemplateCardProps) {
  const { formatPrice, t } = useLanguage();
  const theme = THEME_CONFIG[template.colorTheme] || THEME_CONFIG.black;
  const isFeatured = variant === 'featured';
  const iconImage = ICON_IMAGES[template.id];

  // Clean title without raw emoji suffix if any
  const cleanTitle = template.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div
      className={`group relative bg-white border ${theme.border} rounded-3xl ${
        isFeatured ? 'p-6 sm:p-7' : 'p-6 sm:p-7'
      } ${theme.shadow} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden h-full`}
    >
      {/* Background Soft Glow / Gradient Accent */}
      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full bg-gradient-to-br ${theme.accentGradient} blur-2xl pointer-events-none opacity-80 group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Header: 3D Illustration Icon + Category & Price Badge */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* 3D Icon Container */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100/80 p-2 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
              {iconImage ? (
                <Image
                  src={iconImage}
                  alt={cleanTitle}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-sm"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Image
                    src="/icons/3d/digicam.svg"
                    alt={cleanTitle}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
            {isFeatured && (
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm border border-white">
                POPULER
              </span>
            )}
          </div>

          {/* Price Tag with Promo Strike */}
          <div className="flex flex-col items-end flex-shrink-0">
            {template.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-semibold tracking-tight">
                {formatPrice(template.originalPrice)}
              </span>
            )}
            <div className={`px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} shadow-xs flex items-center gap-1`}>
              <span className={`text-xs sm:text-sm font-black tracking-tight ${theme.badgeText}`}>
                {formatPrice(template.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="mb-2">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${theme.highlightPill}`}>
            {template.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug mb-2 group-hover:text-pink-600 transition-colors">
          {cleanTitle}
        </h3>

        {/* Description Wording */}
        <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-normal mb-6 line-clamp-3">
          {template.description}
        </p>
      </div>

      {/* Action Buttons: Try Demo + Select */}
      <div className="relative z-10 flex items-center gap-2.5 pt-3 border-t border-slate-100 mt-auto">
        <a
          href={template.demoUrl || '#'}
          className={`flex-1 py-2.5 px-3 text-center text-xs font-bold rounded-xl border ${theme.btnOutline} ${theme.btnOutlineHover} transition-all active:scale-[0.98] flex items-center justify-center gap-1.5`}
        >
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Preview Live</span>
        </a>
        <button
          onClick={() => onSelect(template.title)}
          className={`flex-1 py-2.5 px-3 text-center text-xs font-black rounded-xl ${theme.btnPrimary} ${theme.btnPrimaryHover} shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5`}
        >
          <span>Pilih Template</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
