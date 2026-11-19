"use client";

import React, { useState } from "react";

const FAQS = [
  {
    q: "Berapa lama proses pembuatan undangan sampai siap sebar?",
    a: "Hanya butuh 1x24 jam setelah data foto, nama pengantin, jadwal akad, dan resepsi kami terima. Untuk pesanan urgent bahkan bisa selesai dalam hitungan jam.",
  },
  {
    q: "Bagaimana cara menyebarkan undangannya ke WhatsApp tamu?",
    a: "Sangat mudah! Anda akan mendapatkan akses ke halaman 'Generator Link Tamu'. Cukup ketik nama tamu (misal: Aldi Pratama / Pak Joko), lalu klik 'Kirim WA'. Teks pesan resmi yang sopan dan tautan personal akan terisi otomatis di WhatsApp Anda.",
  },
  {
    q: "Apakah lagu latar (background music) bisa kami request sendiri?",
    a: "Tentu bisa! Anda bebas memilih lagu pop romantis, instrumental piano, lagu islami, atau lagu adat pilihan Anda. Cukup kirimkan judul lagu atau tautan audionya.",
  },
  {
    q: "Apakah ada potongan admin untuk uang angpao yang ditransfer tamu?",
    a: "Sama sekali 0%! Nomor rekening yang ditampilkan adalah rekening pribadi Anda (BCA / Mandiri / QRIS pribadi Anda). Seluruh dana langsung 100% masuk ke rekening pengantin tanpa perantara.",
  },
  {
    q: "Apakah undangan ini bisa dibuka di semua jenis smartphone?",
    a: "Ya, template Plivin dirancang dengan teknologi Next.js terkini yang super responsif, mulus di iPhone (iOS Safari), Android (Chrome), tablet, hingga laptop dengan loading sub-1 detik.",
  },
];

export function PlivinFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-[#C5A880]/20 scroll-mt-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A07A48]">
            TANYA JAWAB
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-stone-950 font-normal">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-sans">
            Semua hal yang perlu Anda ketahui sebelum memesan undangan digital Plivin.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5]/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-medium text-stone-900 hover:text-[#A07A48] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-sans text-stone-400 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
