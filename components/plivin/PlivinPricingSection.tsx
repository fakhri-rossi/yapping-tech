"use client";

import React from "react";
import { WHATSAPP_NUMBER } from "@config/niches";

const PACKAGES = [
  {
    name: "Intimate",
    badge: "Akad & Small Gathering",
    price: "249.000",
    originalPrice: "499.000",
    popular: false,
    desc: "Pilihan tepat untuk perayaan akad nikah atau resepsi intimate bersama keluarga inti.",
    features: [
      "Layar Opening Cover Elegan",
      "Personalisasi hingga 150 Nama Tamu",
      "Pemutar Musik Latar Romantis",
      "Galeri Foto Prewedding (6 Foto)",
      "Form Konfirmasi RSVP & Doa Restu",
      "Navigasi Google Maps 1-Klik",
      "Masa Aktif 6 Bulan",
    ],
  },
  {
    name: "Signature",
    badge: "Paling Populer & Lengkap",
    price: "399.000",
    originalPrice: "799.000",
    popular: true,
    desc: "Standar kemewahan Plivin terlengkap. Fitur tanpa batas untuk perayaan resepsi besar.",
    features: [
      "Semua Fitur Paket Intimate",
      "Unlimited Nama Tamu (Bebas Tambah)",
      "Floating Vinyl Player (Bebas Pilih Lagu)",
      "Generator Link WhatsApp Otomatis",
      "0% Potongan Angpao (BCA, Mandiri, QRIS)",
      "Dinding Seluruh Doa Tamu (Live Feed)",
      "Interactive Love Story Timeline",
      "Save to Google Calendar 1-Klik",
      "Masa Aktif 1 Tahun",
    ],
  },
  {
    name: "Royal Bespoke",
    badge: "Custom Domain & WO Suite",
    price: "699.000",
    originalPrice: "1.299.000",
    popular: false,
    desc: "Pengalaman VIP eksklusif dengan custom domain sendiri dan sinkronisasi meja resepsi WO.",
    features: [
      "Semua Fitur Paket Signature",
      "Custom Domain Pribadi (.com / .id)",
      "Check-in QR Code Tamu Meja Resepsi",
      "Dashboard Rekap RSVP Real-Time untuk WO",
      "Integrasi Database Cloud Neon",
      "Prioritas Pengerjaan Kilat (24 Jam Jadi)",
      "Masa Aktif Selamanya (Everlasting Memory)",
    ],
  },
];

export function PlivinPricingSection() {
  return (
    <section id="harga" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF8F5] scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A07A48]">
            INVESTASI MOMEN SEKALI SEUMUR HIDUP
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif text-stone-950 font-normal">
            Pilihan Paket Transparan. <br />
            <span className="italic" style={{ color: "#A07A48" }}>
              Tanpa Biaya Tersembunyi.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
            Seluruh paket sudah termasuk bantuan tim desain Plivin untuk input foto, teks, dan musik hingga siap sebar.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const pitch = encodeURIComponent(
              `Halo Plivin! Saya tertarik memesan undangan digital Paket ${pkg.name} (Rp${pkg.price}). Boleh dibantu proses dan langkah pengisian datanya?`
            );
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${pitch}`;

            return (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.popular
                    ? "bg-[#1C1917] text-white shadow-2xl ring-2 ring-[#C5A880] lg:-translate-y-2"
                    : "bg-white text-stone-900 border border-stone-200/90 shadow-sm"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-[#C5A880] text-stone-950 shadow-md">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`text-2xl font-serif font-bold ${
                        pkg.popular ? "text-white" : "text-stone-950"
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    {!pkg.popular && (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-600">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs leading-relaxed mb-6 ${
                      pkg.popular ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {pkg.desc}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-stone-200/20">
                    <span
                      className={`text-xs line-through block mb-0.5 ${
                        pkg.popular ? "text-stone-500" : "text-stone-400"
                      }`}
                    >
                      Rp{pkg.originalPrice}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">Rp</span>
                      <span className="text-4xl font-extrabold tracking-tight font-serif">
                        {pkg.price}
                      </span>
                      <span
                        className={`text-xs ${
                          pkg.popular ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        /acara
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                    {pkg.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          className={`font-bold mt-0.5 ${
                            pkg.popular ? "text-amber-300" : "text-[#A07A48]"
                          }`}
                        >
                          ✓
                        </span>
                        <span
                          className={
                            pkg.popular ? "text-stone-200" : "text-stone-700"
                          }
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-full text-xs font-bold tracking-wide uppercase text-center transition-all ${
                    pkg.popular
                      ? "bg-gradient-to-r from-amber-400 to-[#C5A880] text-stone-950 hover:brightness-105 shadow-md"
                      : "bg-[#1C1917] text-white hover:bg-stone-800 shadow-sm"
                  }`}
                >
                  Pilih Paket {pkg.name} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
