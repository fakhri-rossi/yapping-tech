'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterCategory } from '@config/gifts';
import Navbar from '@components/plivin/landing/Navbar';
import FilterTabs from '@components/plivin/landing/FilterTabs';
import CatalogGrid from '@components/plivin/landing/CatalogGrid';
import Footer from '@components/plivin/landing/Footer';
import FloatingWhatsAppButton from '@components/plivin/common/FloatingWhatsAppButton';
import ScrollReveal from '@components/plivin/landing/ScrollReveal';
import { useLanguage, LanguageProvider } from '@context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

function KatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as FilterCategory) || 'Semua';

  const [activeFilter, setActiveFilter] = useState<FilterCategory>(initialCategory);
  const { t } = useLanguage();

  const handleFilterChange = useCallback((category: FilterCategory) => {
    setActiveFilter(category);
  }, []);

  const handleSelectTemplate = useCallback((templateTitle: string) => {
    router.push(`/plivin/gift?template=${encodeURIComponent(templateTitle)}#orderSection`);
  }, [router]);

  return (
    <main className="flex-1 pt-28 pb-20 px-4 md:px-6 container mx-auto max-w-6xl plivin-root">
      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link
          href="/plivin/gift"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-extrabold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 transition cursor-pointer"
        >
          <span>←</span> Kembali ke Beranda
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-xs">
          <Image
            src="/images/emoji-lightning-3d.png"
            alt="Pilihan"
            width={16}
            height={16}
            className="w-4 h-4 object-contain inline-block"
            unoptimized
          />
          <span>{t.catalog.allTemplates}</span>
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Koleksi Kado Digital Interaktif
        </h1>
        <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
          Pilih konsep yang paling cocok untuk orang tersayang. Dilengkapi backsound musik romantis, amplop surat cinta, efek transisi visual, dan aktif selamanya tanpa masa kedaluwarsa.
        </p>
      </div>

      {/* Filter Tabs */}
      <ScrollReveal>
        <FilterTabs activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </ScrollReveal>

      {/* Catalog Grid */}
      <ScrollReveal>
        <CatalogGrid activeFilter={activeFilter} onSelectTemplate={handleSelectTemplate} />
      </ScrollReveal>

      {/* Bottom CTA to order */}
      <div className="text-center bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] space-y-4 max-w-3xl mx-auto relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 p-3 shadow-inner border border-rose-100 flex items-center justify-center">
          <Image
            src="/icons/3d/envelope.svg"
            alt="Pesan Kado"
            width={48}
            height={48}
            className="w-full h-full object-contain drop-shadow-sm"
            unoptimized
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Sudah Menemukan Konsep yang Pas?
        </h2>
        <p className="text-slate-600 font-medium text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          Pilih template di atas atau buka formulir instan untuk mulai merangkai foto, musik, dan kata ucapan terbaikmu.
        </p>
        <div className="pt-2">
          <Link
            href="/plivin/gift#orderSection"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Buka Formulir Pemesanan</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function KatalogPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col plivin-root overflow-x-hidden">
        <Navbar />
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-bold text-slate-500">Memuat katalog...</div>}>
          <KatalogContent />
        </Suspense>
        <Footer />
        <FloatingWhatsAppButton />
      </div>
    </LanguageProvider>
  );
}
