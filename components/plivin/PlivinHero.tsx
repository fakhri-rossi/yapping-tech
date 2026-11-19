"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function PlivinHero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-[#C5A880]/15 to-transparent blur-[120px]" />
        <div className="absolute right-[10%] top-[30%] h-[350px] w-[450px] rounded-full bg-[#EADCC8]/20 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        {/* Monogram / Category Pill */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/40 bg-[#FAF8F5] px-3.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#A07A48" }} />
          <span>PLIVIN.CO · HAUTE-COUTURE WEDDING SUITE</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-serif text-stone-950 font-normal tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Momen Sakral Anda, <br className="hidden sm:inline" />
          <span className="italic font-normal" style={{ color: "#A07A48" }}>
            Dirayakan Penuh Elegansi.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-stone-600 mb-8 sm:mb-10 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Undangan pernikahan digital sinematik bergaya editorial majalah mewah. Dilengkapi opening cover personal bertuliskan nama masing-masing tamu, pemutar musik vinyl, dan 0% potongan hadiah langsung masuk ke rekening pengantin.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/wedding/raditya-adinda?to=Bapak+Joko+%26+Partner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            style={{ backgroundColor: "#1C1917" }}
          >
            <span>Buka Demo Undangan</span>
            <span>→</span>
          </Link>

          <a
            href="#wedding-suite"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white/80 px-7 py-3.5 text-sm font-semibold text-stone-800 backdrop-blur-sm transition-colors hover:bg-white hover:border-stone-400"
          >
            Eksplor Fitur Unggulan
          </a>
        </motion.div>

        {/* Editorial Preview Card Preview Showcase */}
        <motion.div
          className="relative mx-auto max-w-3xl rounded-3xl border border-[#C5A880]/30 bg-white p-3 sm:p-5 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100">
            <Image
              src="/images/wedding/hero.jpg"
              alt="The Wedding of Raditya & Adinda"
              fill
              className="object-cover"
              priority
            />
            {/* Glass Overlay Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-200">
                  FEATURED TEMPLATE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-light mt-0.5">
                  The Wedding of Raditya &amp; Adinda
                </h3>
                <p className="text-xs text-stone-300 font-sans mt-0.5">
                  Opening Cover Personal · Vinyl Player · Direct Bank Gift · Live Wishes Wall
                </p>
              </div>

              <Link
                href="/wedding/raditya-adinda?to=Bapak+Joko+%26+Partner"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-stone-900 bg-white shadow-md hover:bg-amber-50 transition-colors shrink-0"
              >
                <span>Lihat Demo Interaktif</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
