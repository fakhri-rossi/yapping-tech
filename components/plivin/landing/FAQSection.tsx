'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  category: 'cara-kerja' | 'fitur' | 'pembayaran' | 'keamanan';
  categoryLabel: string;
  question: string;
  answer: string;
  icon: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'cara-kerja',
    categoryLabel: '🚀 Pembuatan & Link',
    icon: '⚡',
    question: 'Gimana cara bikin website kado di Plivin.co?',
    answer:
      'Gampang banget dan langsung aktif! 1) Pilih template kado favoritmu. 2) Isi form pesanan (nama doi, kata ucapan, lagu YouTube, foto/video). 3) Lakukan pembayaran. Websitemu langsung aktif saat itu juga dan kamu bisa langsung atur Custom URL Link unik (misal: plivin.co/buat-sayang)!',
  },
  {
    id: 'faq-2',
    category: 'cara-kerja',
    categoryLabel: '🚀 Pembuatan & Link',
    icon: '🔗',
    question: 'Bisa bikin Custom Link URL sendiri gak?',
    answer:
      'Bisa banget! Kamu bebas tentuin nama link websitemu (contoh: plivin.co/hbd-nadia atau plivin.co/happy-anniversary). Link ini bisa kamu atur dan ganti kapan aja lewat Dashboard Klien secara gratis!',
  },
  {
    id: 'faq-3',
    category: 'fitur',
    categoryLabel: '🎵 Lagu & Video',
    icon: '🎵',
    question: 'Gimana cara masukin lagu favorit dari YouTube?',
    answer:
      'Tinggal copy-paste aja link video YouTube dari HP atau laptopmu (misal lagu kenangan kalian berdua). Lagu tersebut bakal otomatis terputar sebagai musik latar saat websitemu dibuka! Video YouTube Shorts atau link Unlisted juga bisa diputar!',
  },
  {
    id: 'faq-4',
    category: 'fitur',
    categoryLabel: '🎵 Lagu & Video',
    icon: '📹',
    question: 'Bisa upload video sendiri gak (kaya di Vintage Camera & Paper Scrapbook)?',
    answer:
      'Bisa banget! Khusus template yang mendukung video (kaya Vintage Camera dan Paper Scrapbook), kamu bisa langsung upload file video dari HP/PC (MP4, MOV), atau paste link video YouTube/Google Drive. Videonya bakal otomatis terputar di layar kado!',
  },
  {
    id: 'faq-5',
    category: 'fitur',
    categoryLabel: '🚀 Pembuatan & Link',
    icon: '⏳',
    question: 'Berapa lama masa aktif websitenya? Ada biaya bulanan gak?',
    answer:
      'Aktif selamanya tanpa biaya perpanjangan sama sekali! Cukup sekali bayar, website kado buatanmu bisa dibuka kapan aja 24/7 tanpa batas waktu.',
  },
  {
    id: 'faq-6',
    category: 'cara-kerja',
    categoryLabel: '🚀 Pembuatan & Link',
    icon: '✍️',
    question: 'Kalau pesanan udah selesai dibuat, masih bisa diedit gak?',
    answer:
      'Bisa banget! Kamu dapat akses ke Dashboard Self-Service. Kamu bebas ubah kata-kata ucapan, ganti lagu, atur foto, atau ganti link kado kapan aja kamu mau.',
  },
  {
    id: 'faq-7',
    category: 'pembayaran',
    categoryLabel: '💳 Pembayaran & Garansi',
    icon: '💳',
    question: 'Bayarnya bisa pakai apa aja?',
    answer:
      'Pembayaran diproses otomatis & instan. Kamu bisa bayar via Bank Transfer / Virtual Account (BCA, BRI, BNI, Mandiri, Permata, Danamon, CIMB Niaga, dll.), Convenience Store (Alfamart, Alfamidi, Indomaret / i.saku, Lawson, Dan+Dan), serta PayLater (Akulaku). Status langsung lunas otomatis dalam hitungan detik!',
  },
  {
    id: 'faq-8',
    category: 'keamanan',
    categoryLabel: '💳 Pembayaran & Garansi',
    icon: '🔒',
    question: 'Foto dan pesan rahasia kita aman gak?',
    answer:
      'Aman banget! Semua foto, video, dan pesan kamu disimpan di server yang aman. Website kadomu cuma bisa dibuka sama orang yang punya link kado unik buatanmu.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="my-24 scroll-mt-24 max-w-4xl mx-auto px-4">
      {/* Header Badge & Title */}
      <div className="text-center mb-10 space-y-3">
        <span className="px-4 py-1.5 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest rounded-full border-2 border-rose-500 inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)]">
          <span>❓</span> Q&A — Frequently Asked Questions
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">
          Ada Yang Bikin Kamu Penasaran? 🤔
        </h2>
        <p className="text-slate-600 font-bold text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Semua hal yang sering ditanyain seputar cara bikin website kado, lagu YouTube, custom link, sampai pembayaran ada di sini!
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="🔍 Cari pertanyaan... (misal: Custom Link, YouTube, Bayar, Selamanya)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-2xl px-5 py-3.5 pl-12 text-black font-extrabold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-500/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black font-bold text-xs bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeCategory === 'all'
                ? 'bg-black text-white -translate-y-0.5'
                : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            ⚡ Semua Pertanyaan ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('cara-kerja')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeCategory === 'cara-kerja'
                ? 'bg-rose-500 text-white -translate-y-0.5'
                : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            🚀 Pembuatan & Link
          </button>
          <button
            onClick={() => setActiveCategory('fitur')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeCategory === 'fitur'
                ? 'bg-rose-500 text-white -translate-y-0.5'
                : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            🎵 Lagu & Video
          </button>
          <button
            onClick={() => setActiveCategory('pembayaran')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeCategory === 'pembayaran'
                ? 'bg-rose-500 text-white -translate-y-0.5'
                : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            💳 Pembayaran & Garansi
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-4xl block">🔍</span>
            <h4 className="font-extrabold text-black text-base">Pertanyaan Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 font-medium">
              Coba gunakan kata kunci lain seperti &quot;Link&quot;, &quot;Lagu&quot;, &quot;YouTube&quot;, atau &quot;Bayar&quot;.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border-3 border-black rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                  isOpen
                    ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ring-2 ring-rose-500/20'
                    : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-5 md:p-6 font-extrabold flex justify-between items-center gap-4 bg-white hover:bg-rose-50/50 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm md:text-base text-black flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-rose-100 border-2 border-black flex items-center justify-center flex-shrink-0 text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {faq.icon}
                    </span>
                    <span className="leading-snug">{faq.question}</span>
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full bg-black text-white font-black text-sm flex items-center justify-center flex-shrink-0 transform transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-rose-600' : 'rotate-0'
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 md:p-6 border-t-2 border-black bg-slate-50/80 text-slate-700 text-xs md:text-sm font-medium leading-relaxed space-y-3">
                    <p>{faq.answer}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white border border-black rounded-lg text-[10px] font-black text-slate-700 shadow-xs">
                        {faq.categoryLabel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Banner at Bottom */}
      <div className="mt-12 bg-gradient-to-r from-rose-500 to-pink-600 border-4 border-black rounded-3xl p-6 md:p-8 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black flex items-center justify-center md:justify-start gap-2">
            <span>💬</span> Masih Punya Pertanyaan Lain?
          </h3>
          <p className="text-xs md:text-sm font-medium text-rose-100 leading-relaxed max-w-lg">
            Tim Admin Plivin siap ngebantu kamu 24/7! Tanya-tanya via WhatsApp, langsung dibalas ramah hitungan menit.
          </p>
        </div>
        <a
          href="https://api.whatsapp.com/send?phone=6285710785480&text=Halo%20Admin%20Plivin.co,%20saya%20mau%20tanya-tanya%20seputar%20kado%20digital%20dong!"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 bg-white hover:bg-slate-100 text-black font-extrabold text-xs md:text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-y-0.5 flex-shrink-0 flex items-center gap-2"
        >
          <span>💬</span> Chat Admin WhatsApp Sekarang
        </a>
      </div>
    </section>
  );
}
