"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@config/niches";
import { PlivinLogo } from "@components/plivin/PlivinLogo";

const NAV_LINKS = [
  { id: "wedding-suite", label: "Wedding Suite", href: "/plivin#wedding-suite" },
  { id: "kado-digital", label: "Kado Digital", href: "/plivin/gift" },
  { id: "harga", label: "Paket & Harga", href: "/plivin#harga" },
  { id: "faq", label: "FAQ", href: "/plivin#faq" },
];

export function PlivinNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("wedding-suite");
  const [mobileOpen, setMobileOpen] = useState(false);

  const waOrderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Plivin! Saya tertarik konsultasi pembuatan undangan pernikahan digital eksklusif (Plivin Wedding Suite)."
  )}`;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const sectionIds = NAV_LINKS.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-6xl pointer-events-auto">
        <div
          className={`flex items-center justify-between rounded-full border transition-all duration-300 px-4 sm:px-5 py-2.5 ${
            scrolled
              ? "bg-[#FAF8F5]/95 border-[#C5A880]/30 shadow-[0_12px_36px_rgba(28,25,23,0.08)] backdrop-blur-md"
              : "bg-[#FAF8F5]/85 border-[#C5A880]/20 shadow-[0_6px_24px_rgba(28,25,23,0.04)] backdrop-blur-sm"
          }`}
        >
          {/* Brand */}
          <Link href="/plivin" className="flex items-center">
            <PlivinLogo variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-[#1C1917]/[0.03] p-1 border border-[#C5A880]/20">
            {NAV_LINKS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#1C1917] text-[#FAF8F5] shadow-sm font-semibold"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-200/50"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              href="/wedding/raditya-adinda?to=Tamu+Spesial"
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-[#A07A48] hover:bg-[#A07A48]/10 transition-colors"
            >
              Live Demo ↗
            </Link>
          </nav>

          {/* Right CTA + Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#A07A48" }}
            >
              <span>Konsultasi WA</span>
              <span>↗</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#C5A880]/30 bg-white text-stone-800 hover:bg-stone-100 transition-colors"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-2.5 rounded-3xl border border-[#C5A880]/25 bg-[#FAF8F5] p-4 shadow-[0_20px_50px_rgba(28,25,23,0.12)]">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeId === item.id
                      ? "bg-[#1C1917] text-[#FAF8F5] font-semibold"
                      : "text-stone-800 hover:bg-stone-200/50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/wedding/raditya-adinda?to=Tamu+Spesial"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#A07A48] hover:bg-[#A07A48]/10 transition-colors"
              >
                <span>Live Demo Undangan</span>
                <span>↗</span>
              </Link>
            </div>
            <div className="mt-3 pt-3 border-t border-[#C5A880]/20">
              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all"
                style={{ backgroundColor: "#A07A48" }}
              >
                Konsultasi via WhatsApp ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
