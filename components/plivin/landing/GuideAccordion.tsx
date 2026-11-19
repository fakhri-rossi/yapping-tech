'use client';

import { useState } from 'react';
import { FilterCategory } from '@config/gifts';
import Image from 'next/image';
import { useLanguage } from '@context/LanguageContext';

interface OccasionCard {
  id: string;
  category: FilterCategory;
  targetAudience: ('pacar' | 'sahabat' | 'wisuda' | 'semua')[];
  imageSrc: string;
  badgeId: string;
  badgeEn: string;
  badgeColor: string;
  headerBg: string;
  titleId: string;
  titleEn: string;
  recommendedTemplates: { title: string; priceIdr: number }[];
  accentColor: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    id: 'ulang-tahun',
    category: 'Ulang Tahun',
    targetAudience: ['pacar', 'sahabat', 'semua'],
    imageSrc: '/images/occasions/birthday.jpg',
    badgeId: 'Populer',
    badgeEn: 'Popular',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-500',
    headerBg: 'from-amber-100/90 via-rose-50/50 to-white',
    titleId: 'Ulang Tahun',
    titleEn: 'Birthday',
    recommendedTemplates: [
      { title: 'Secret Maroon Birthday', priceIdr: 19500 },
      { title: 'Paper Scrapbook Memory', priceIdr: 28500 },
      { title: 'Romantic Neon Poetry', priceIdr: 14500 },
    ],
    accentColor: 'border-rose-500 hover:shadow-[5px_5px_0px_0px_rgba(244,63,94,1)]',
  },
  {
    id: 'anniversary',
    category: 'Anniversary',
    targetAudience: ['pacar', 'semua'],
    imageSrc: '/images/occasions/anniversary.jpg',
    badgeId: 'Romantis',
    badgeEn: 'Romance',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-500',
    headerBg: 'from-pink-100/90 via-rose-50/50 to-white',
    titleId: 'Anniversary & Cinta',
    titleEn: 'Anniversary & Romance',
    recommendedTemplates: [
      { title: 'Love Arcade & Secret Letter', priceIdr: 18500 },
      { title: 'Bouquet of Love', priceIdr: 24500 },
      { title: 'Date Invitation', priceIdr: 24500 },
    ],
    accentColor: 'border-pink-500 hover:shadow-[5px_5px_0px_0px_rgba(236,72,153,1)]',
  },
  {
    id: 'wisuda',
    category: 'Kelulusan / Wisuda',
    targetAudience: ['wisuda', 'sahabat', 'semua'],
    imageSrc: '/images/occasions/graduation.jpg',
    badgeId: 'Wisuda',
    badgeEn: 'Graduation',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-500',
    headerBg: 'from-sky-100/90 via-indigo-50/50 to-white',
    titleId: 'Wisuda & Kelulusan',
    titleEn: 'Graduation Tribute',
    recommendedTemplates: [
      { title: 'Golden Wisuda', priceIdr: 18500 },
      { title: 'Good Ending Windah', priceIdr: 22500 },
      { title: 'Classic Academic', priceIdr: 18500 },
    ],
    accentColor: 'border-sky-600 hover:shadow-[5px_5px_0px_0px_rgba(2,132,199,1)]',
  },
];

interface GuideProps {
  onFilterChange?: (category: FilterCategory) => void;
  onSelectTemplate?: (templateTitle: string) => void;
}

export default function GuideAccordion({ onFilterChange, onSelectTemplate }: GuideProps) {
  const [selectedTarget, setSelectedTarget] = useState<'semua' | 'pacar' | 'sahabat' | 'wisuda'>('semua');
  const { language, formatPrice, t } = useLanguage();

  const handleOccasionClick = (category: FilterCategory) => {
    onFilterChange?.(category);
    const catalogEl = document.getElementById('katalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTemplateClick = (title: string) => {
    if (onSelectTemplate) {
      onSelectTemplate(title);
    } else {
      const orderEl = document.getElementById('orderSection');
      if (orderEl) orderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredOccasions = OCCASIONS.filter((occ) => {
    if (selectedTarget === 'semua') return true;
    return occ.targetAudience.includes(selectedTarget);
  });

  const filterTabs = language === 'en'
    ? [
        { id: 'semua', label: 'All Occasions' },
        { id: 'pacar', label: 'Partner / Couple' },
        { id: 'sahabat', label: 'Best Friends' },
        { id: 'wisuda', label: 'Graduates' },
      ]
    : [
        { id: 'semua', label: 'Semua Momen' },
        { id: 'pacar', label: 'Pasangan / Pacar' },
        { id: 'sahabat', label: 'Sahabat / Bestie' },
        { id: 'wisuda', label: 'Teman Wisuda' },
      ];

  return (
    <div id="panduan" className="max-w-6xl mx-auto scroll-mt-24 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight">
          {t.guide.title}
        </h2>
        <p className="text-slate-600 font-bold text-xs sm:text-sm">
          {t.guide.subtitle}
        </p>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTarget(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-black transition cursor-pointer ${
                selectedTarget === tab.id
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(244,63,94,1)] -translate-y-0.5'
                  : 'bg-white text-slate-800 hover:bg-slate-100 shadow-xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {filteredOccasions.map((item) => {
          const occTitle = language === 'en' ? item.titleEn : item.titleId;
          const occBadge = language === 'en' ? item.badgeEn : item.badgeId;

          return (
            <div
              key={item.id}
              className={`bg-white border-3 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${item.accentColor}`}
            >
              {/* Card Header with 3D Artwork */}
              <div className={`p-5 bg-gradient-to-b ${item.headerBg} border-b-2 border-black flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 relative rounded-xl overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white shrink-0">
                    <Image
                      src={item.imageSrc}
                      alt={occTitle}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                      {occBadge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-black leading-tight mt-1">
                      {occTitle}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Recommended Template Quick Links */}
              <div className="p-4 sm:p-5 space-y-2 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {language === 'en' ? 'Popular Templates:' : 'Template Populer:'}
                </span>
                {item.recommendedTemplates.map((tItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTemplateClick(tItem.title)}
                    className="w-full p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-black rounded-xl text-left transition flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <span className="text-xs font-black text-black group-hover:text-rose-600 truncate">
                      {tItem.title}
                    </span>
                    <span className="text-[10px] font-black text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                      {formatPrice(tItem.priceIdr)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Card Footer Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOccasionClick(item.category)}
                  className="w-full py-2.5 px-3 rounded-xl font-black bg-black hover:bg-rose-600 text-white text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{language === 'en' ? `View All ${occTitle}` : `Lihat Semua ${occTitle}`}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
