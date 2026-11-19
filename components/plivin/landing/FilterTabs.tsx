'use client';

import { FILTER_CATEGORIES, FilterCategory } from '@config/gifts';
import { useLanguage } from '@context/LanguageContext';

interface FilterTabsProps {
  activeFilter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const { t } = useLanguage();

  const getCategoryLabel = (category: FilterCategory) => {
    switch (category) {
      case 'Semua':
        return t.catalog.filterAll;
      case 'Ulang Tahun':
        return t.catalog.filterBirthday;
      case 'Kelulusan / Wisuda':
        return t.catalog.filterGraduation;
      case 'Anniversary':
        return t.catalog.filterAnniversary;
      default:
        return category;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 px-2">
      {FILTER_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border-2 border-black text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeFilter === category
              ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-black hover:bg-slate-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
