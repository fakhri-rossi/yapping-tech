'use client';

import { TEMPLATE_DATA } from '@config/gifts';
import TemplateCard from './TemplateCard';
import { useLanguage } from '@context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedTemplatesProps {
  onSelectTemplate: (templateTitle: string) => void;
}

export default function FeaturedTemplates({ onSelectTemplate }: FeaturedTemplatesProps) {
  const { t } = useLanguage();
  // Take only 1 featured template
  const featured = TEMPLATE_DATA.filter((tItem) => tItem.isFeatured).slice(0, 1);

  return (
    <div id="featured" className="max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center mb-8">
        <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
          {t.catalog.featuredTag}
        </h3>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black mt-1">
          {t.catalog.featuredTitle}
        </h2>
        <p className="text-slate-600 font-medium mt-2 max-w-xl mx-auto text-sm md:text-base">
          {t.catalog.featuredSub}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {featured.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            variant="featured"
            onSelect={onSelectTemplate}
          />
        ))}

        <div className="mt-8 text-center">
          <Link
            href="/katalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
          >
            <Image
              src="/images/emoji-chat-3d.png"
              alt="Katalog"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
              unoptimized
            />
            <span>Lihat Semua Koleksi Template di Katalog</span>
            <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
