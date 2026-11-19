"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const SUITE_FEATURES = [
  {
    icon: "✉️",
    title: "Opening Cover Personal",
    desc: "Setiap tamu disapa hangat dengan nama mereka langsung di layar pembuka ('Kepada Yth. Bapak Joko & Keluarga'). Animasi amplop terbuka secara teatrikal.",
  },
  {
    icon: "🎶",
    title: "Vinyl Music Player",
    desc: "Latar musik waltz/romantis otomatis berputar halus begitu undangan dibuka. Piringan vinyl berputar di sudut layar tanpa mengganggu pandangan.",
  },
  {
    icon: "💳",
    title: "0% Potongan Angpao",
    desc: "Tamu dapat mentransfer tanda kasih langsung ke rekening BCA/Mandiri mempelai dengan tombol salin nomor rekening instan. Uang 100% utuh tanpa potongan pihak ketiga.",
  },
  {
    icon: "📜",
    title: "Live Wishes Wall",
    desc: "Buku tamu modern tempat tamu mengonfirmasi kehadiran (Hadir/Tidak/Ragu) serta menitipkan doa restu yang langsung tayang secara live di dinding undangan.",
  },
  {
    icon: "📍",
    title: "Navigasi & Kalender 1-Klik",
    desc: "Detail akad dan resepsi dilengkapi tombol penunjuk arah Google Maps langsung dan tombol 'Save the Date' ke Google Calendar para tamu.",
  },
  {
    icon: "⚙️",
    title: "Wedding Planner Generator",
    desc: "Mempelai & WO mendapatkan akses ke halaman generator untuk membuat ratusan link personal per nama tamu dan template chat WhatsApp siap kirim dalam 1 detik.",
  },
];

export function PlivinWeddingSuiteSection() {
  return (
    <section id="wedding-suite" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-y border-[#C5A880]/20 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A07A48]">
            THE PLIVIN WEDDING EXPERIENCE
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif text-stone-950 font-normal">
            Bukan Undangan Biasa. <br />
            <span className="italic" style={{ color: "#A07A48" }}>
              Sebuah Karya Seni Bernilai Sakral.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
            Kami merancang setiap detail agar tamu merasakan kehangatan dan kemewahan perayaan pernikahan Anda sejak detik pertama mereka menyentuh layar smartphone.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SUITE_FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="rounded-3xl border border-stone-200/90 bg-[#FAF8F5]/80 p-6 sm:p-8 hover:bg-[#FAF8F5] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-900/5 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div>
                <span className="text-3xl mb-4 block">{feat.icon}</span>
                <h3 className="text-lg font-serif font-bold text-stone-950 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold text-[#A07A48]">
                <span>Tersedia di Paket Plivin</span>
                <span>✓</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick CTA to Generator */}
        <div className="mt-14 rounded-3xl border border-[#C5A880]/30 bg-gradient-to-r from-[#FAF8F5] to-amber-50/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A07A48]">
              FITUR UNTUK WEDDING PLANNER &amp; MEMPELAI
            </span>
            <h4 className="text-xl font-serif font-bold text-stone-950 mt-1">
              Coba Generator Link Tamu Plivin
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Ketik nama tamu undangan Anda dan dapatkan link personal seketika lengkap dengan template teks WhatsApp siap kirim.
            </p>
          </div>

          <Link
            href="/wedding/raditya-adinda/generator"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1917] px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-stone-800 transition-colors shrink-0 text-center"
          >
            <span>Buka Generator Tamu</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
