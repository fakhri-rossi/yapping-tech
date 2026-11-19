'use client';

import Navbar from '@components/plivin/landing/Navbar';
import FAQSection from '@components/plivin/landing/FAQSection';
import Footer from '@components/plivin/landing/Footer';
import FloatingWhatsAppButton from '@components/plivin/common/FloatingWhatsAppButton';
import { LanguageProvider } from '@context/LanguageContext';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col plivin-root overflow-x-hidden">
        <Navbar />

        <main className="flex-1 pt-28 pb-20 px-4 md:px-6 container mx-auto max-w-5xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              href="/plivin/gift"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-extrabold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 transition cursor-pointer"
            >
              <span>←</span> Kembali ke Beranda
            </Link>
          </div>

          {/* Dedicated FAQ Section */}
          <FAQSection />

          {/* Bottom CTA to order */}
          <div className="mt-16 text-center bg-white border-4 border-black rounded-3xl p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 max-w-3xl mx-auto">
            <span className="text-5xl block animate-bounce">🎁</span>
            <h2 className="text-2xl md:text-4xl font-black text-black tracking-tight">
              Sudah Paham &amp; Siap Bikin Kado Romantis?
            </h2>
            <p className="text-slate-600 font-bold text-xs md:text-sm max-w-lg mx-auto">
              Pilih template favoritmu dan buat kado ucapan digital estetik dalam waktu kurang dari 1 menit!
            </p>
            <div className="pt-2">
              <Link
                href="/plivin/gift#orderSection"
                className="inline-block px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm md:text-base rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-1"
              >
                🚀 Pesan Kado Sekarang (Mulai Rp 25rb)
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        <FloatingWhatsAppButton />
      </div>
    </LanguageProvider>
  );
}
