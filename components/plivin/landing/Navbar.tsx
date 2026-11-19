'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@context/LanguageContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b-2 border-black z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/plivin/gift"
          className="font-bold text-xl md:text-2xl tracking-tight text-black flex items-center gap-2"
        >
          <Image
            src="/favicon.svg"
            alt="plivin logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span>plivin.co</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6 font-bold text-sm">
          <Link
            href="/plivin/gift#pengalaman-scan"
            className="text-black hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>📱</span> {t.nav.howItWorks}
          </Link>
          <Link
            href="/katalog"
            className="text-black hover:text-rose-600 transition-colors"
          >
            {t.nav.catalog}
          </Link>
          <Link
            href="/faq"
            className="text-black hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>❓</span> {t.nav.faq}
          </Link>
          <a
            href={`https://api.whatsapp.com/send?phone=6281110010324&text=${encodeURIComponent(
              language === 'en'
                ? 'Hello Admin plivin.co! 👋 I would like to inquire / order a Digital Gift Website! ✨'
                : 'Halo Admin plivin.co! 👋 Saya ingin bertanya / memesan Website Kado Digital ya! ✨'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 font-extrabold text-xs lg:text-sm"
            aria-label="WhatsApp Admin"
          >
            <span className="text-base">💬</span>
            <span>{t.nav.whatsappAdmin}</span>
          </a>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-slate-100 border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-black text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="Bahasa Indonesia (IDR)"
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-black text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="English (USD)"
            >
              🇬🇧 EN
            </button>
          </div>

          <Link
            href="/plivin/gift#orderSection"
            className="bg-black text-white px-5 py-2 rounded-full border-2 border-black hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {t.nav.orderNow}
          </Link>
        </div>

        {/* Mobile Right Controls: Language Pill & Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-slate-100 border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[11px] font-black">
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'id' ? 'bg-black text-white' : 'text-slate-600'
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'en' ? 'bg-black text-white' : 'text-slate-600'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <button
            id="mobile-menu-btn"
            className="text-black focus:outline-none cursor-pointer p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t-2 border-black absolute w-full left-0 top-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col font-bold text-center">
          <Link
            href="/plivin/gift#pengalaman-scan"
            className="block py-3.5 border-b border-slate-200 text-black hover:bg-slate-50"
            onClick={() => setMenuOpen(false)}
          >
            📱 {t.nav.howItWorks}
          </Link>
          <Link
            href="/katalog"
            className="block py-3.5 border-b border-slate-200 text-black hover:bg-slate-50"
            onClick={() => setMenuOpen(false)}
          >
            🛍️ {t.nav.catalog}
          </Link>
          <Link
            href="/faq"
            className="block py-3.5 border-b border-slate-200 text-black hover:bg-slate-50"
            onClick={() => setMenuOpen(false)}
          >
            ❓ {t.nav.faq}
          </Link>
          <a
            href={`https://api.whatsapp.com/send?phone=6281110010324&text=${encodeURIComponent(
              language === 'en'
                ? 'Hello Admin plivin.co! 👋 I would like to inquire / order a Digital Gift Website! ✨'
                : 'Halo Admin plivin.co! 👋 Saya ingin bertanya / memesan Website Kado Digital ya! ✨'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 border-b border-slate-200 text-emerald-700 font-extrabold hover:bg-slate-50 flex items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(false)}
          >
            <span>💬</span> {t.nav.whatsappAdmin} (+62 811-1001-0324)
          </a>
          <a
            href="https://www.instagram.com/plivin.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 border-b border-slate-200 text-rose-600 hover:bg-slate-50 flex items-center justify-center gap-1"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Instagram @plivin.co
          </a>
          <Link
            href="/plivin/gift#orderSection"
            className="block py-4 bg-black text-white hover:bg-slate-800"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.orderNow}
          </Link>
        </div>
      )}
    </nav>
  );
}
