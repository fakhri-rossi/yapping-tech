"use client";

import React from "react";
import Link from "next/link";
import { PlivinLogo } from "@components/plivin/PlivinLogo";

export function PlivinFooter() {
  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-stone-800 pt-16 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <PlivinLogo variant="light" />
            <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed max-w-sm">
              Platform undangan pernikahan digital sinematik &amp; gifting suite eksklusif. Menghadirkan pengalaman sakral yang elegan dengan teknologi performa sub-1 detik.
            </p>
            <p className="text-[11px] font-mono tracking-wider text-amber-200/80">
              In-House Venture by Yapping Techflow
            </p>
          </div>

          {/* Produk & Template */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">
              Produk &amp; Demo
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              <li>
                <Link href="/wedding/raditya-adinda?to=Tamu+Spesial" className="hover:text-amber-300 transition-colors">
                  Live Demo Undangan ↗
                </Link>
              </li>
              <li>
                <Link href="/wedding/raditya-adinda/generator" className="hover:text-amber-300 transition-colors">
                  Generator Link Tamu
                </Link>
              </li>
              <li>
                <a href="#wedding-suite" className="hover:text-amber-300 transition-colors">
                  Wedding Suite Features
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-amber-300 transition-colors">
                  Paket &amp; Harga
                </a>
              </li>
            </ul>
          </div>

          {/* Ekosistem Yapping */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">
              Ekosistem Terhubung
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              <li>
                <Link href="/komose" className="hover:text-amber-300 transition-colors">
                  Platform Komose (Toko Online)
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-amber-300 transition-colors">
                  Katalog Template Toko
                </Link>
              </li>
              <li>
                <Link href="/cms" className="hover:text-amber-300 transition-colors">
                  Demo CMS Toko
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors text-stone-500">
                  Yapping Techflow Holding ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-sans">
          <p>© {new Date().getFullYear()} Plivin.co · An In-House Venture by Yapping Techflow. All rights reserved.</p>
          <p>Designed with Haute-Couture Digital Aesthetics in Jakarta, Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
