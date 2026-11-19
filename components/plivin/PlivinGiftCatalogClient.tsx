"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TEMPLATE_DATA, FILTER_CATEGORIES, FilterCategory } from "@config/gifts";
import { formatIDR } from "@lib/format";
import { WHATSAPP_NUMBER } from "@config/niches";
import { PlivinNavbar } from "@components/plivin/PlivinNavbar";
import { PlivinFooter } from "@components/plivin/PlivinFooter";

export function PlivinGiftCatalogClient() {
  const [selectedCat, setSelectedCat] = useState<FilterCategory>("Semua");

  const filtered = selectedCat === "Semua"
    ? TEMPLATE_DATA
    : TEMPLATE_DATA.filter(
        (t) => t.category === selectedCat || (t.categories && t.categories.includes(selectedCat))
      );

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 plivin-root font-montserrat">
      <PlivinNavbar />

      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-4">
              PLIVIN DIGITAL GIFTING SUITE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-stone-950 font-normal tracking-tight">
              Koleksi Kado Digital Interaktif <br />
              <span className="italic" style={{ color: "#A07A48" }}>
                Kirim Kejutan Lewat Satu Link.
              </span>
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
              Pilih konsep yang paling pas untuk orang tersayang. Dilengkapi backsound musik romantis, amplop surat cinta, efek transisi visual, galeri foto, dan aktif selamanya tanpa batas waktu.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-[#1C1917] text-white shadow-sm"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((item) => {
              const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Halo Plivin! Saya tertarik pesan Kado Digital template "${item.title}" (Rp${item.price.toLocaleString("id-ID")}). Boleh info cara kirim foto dan pesan ucapannya?`
              )}`;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Emoji & Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex items-center gap-1.5">
                        {item.isFeatured && (
                          <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
                            Populer
                          </span>
                        )}
                        <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-950 mb-1">
                      {item.title}
                    </h3>

                    <p className="text-xs font-medium text-[#A07A48] mb-3">
                      {item.photosRequired === 0 ? "Fokus Teks / Video" : `Memerlukan ${item.photosRequired} Foto`}
                    </p>

                    <p className="text-xs leading-relaxed text-stone-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {item.note && (
                      <div className="mb-5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600 leading-snug">
                        💡 {item.note}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Pricing & Actions */}
                  <div className="pt-4 border-t border-stone-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        {item.originalPrice && (
                          <span className="text-[11px] text-stone-400 line-through block">
                            {formatIDR(item.originalPrice)}
                          </span>
                        )}
                        <span className="text-xl font-extrabold text-stone-950 font-serif">
                          {formatIDR(item.price)}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">
                        Aktif Selamanya
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/plivin/demo/${item.id}`}
                        className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-900 transition-colors"
                      >
                        <span>Demo Live</span>
                        <span>↗</span>
                      </Link>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <span>Pesan Kado</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cross Link to Wedding Suite */}
          <div className="mt-16 rounded-3xl border border-[#C5A880]/30 bg-gradient-to-r from-white via-[#FAF8F5] to-amber-50/40 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A07A48]">
                INGIN MENGUNDANG TAMU PERNIKAHAN?
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-stone-950 font-normal mt-1">
                Eksplor Plivin Wedding Suite
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Undangan pernikahan digital sinematik dengan cover personal nama tamu, vinyl music player, dan 0% potongan hadiah langsung ke rekening pengantin.
              </p>
            </div>

            <Link
              href="/plivin#wedding-suite"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1917] text-white text-xs font-bold shadow-md hover:bg-stone-800 transition-colors shrink-0"
            >
              <span>Lihat Wedding Suite</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      <PlivinFooter />
    </div>
  );
}
