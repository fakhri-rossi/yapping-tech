"use client";

import { useState } from "react";
import Link from "next/link";
import { WeddingConfig } from "@type/wedding";

interface WeddingGuestLinkGeneratorProps {
  config: WeddingConfig;
}

export function WeddingGuestLinkGenerator({ config }: WeddingGuestLinkGeneratorProps) {
  const [guestInput, setGuestInput] = useState("");
  const [salutation, setSalutation] = useState("Bapak/Ibu/Saudara/i");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Quick preset tamu
  const [guestList, setGuestList] = useState<string[]>([
    "Aldi Pratama",
    "Bapak Joko & Keluarga",
    "Sarah Amanda",
    "Dimas & Partner",
  ]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const baseUrl = `${origin}/wedding/${config.slug}`;

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestInput.trim()) return;
    setGuestList((prev) => [guestInput.trim(), ...prev]);
    setGuestInput("");
  };

  const handleRemoveGuest = (index: number) => {
    setGuestList((prev) => prev.filter((_, i) => i !== index));
  };

  const generateWhatsappMessage = (name: string, url: string) => {
    const text = `Kepada Yth. ${salutation} ${name},

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir di acara pernikahan kami:

*The Wedding of ${config.groom.name} & ${config.bride.name}*

Untuk informasi detail mengenai waktu, lokasi, dan konfirmasi kehadiran, silakan buka tautan undangan digital berikut:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih,
*${config.groom.name} & ${config.bride.name}*`;

    return encodeURIComponent(text);
  };

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {});
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 font-sans text-stone-900"
      style={{ backgroundColor: config.theme.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/50">
                PLIVIN WEDDING PLANNER
              </span>
              <span className="text-xs text-stone-500">Guest Link Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
              Generator Link Undangan Tamu
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Buat link unik personal dan template chat WhatsApp siap kirim per tamu.
            </p>
          </div>

          <Link
            href={`/wedding/${config.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-sm"
          >
            <span>Lihat Undangan Asli</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Input Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-4">
              1. Tambah Nama Tamu
            </h2>
            <form onSubmit={handleAddGuest} className="flex gap-2 mb-4">
              <input
                type="text"
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                placeholder="Contoh: Aldi Pratama / Pak Budi & Keluarga"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs tracking-wide transition-colors"
              >
                + Tambah
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
              <span className="font-medium text-stone-700">Format Panggilan:</span>
              {["Bapak/Ibu/Saudara/i", "Sahabat", "Keluarga Besar", "Teman-teman"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSalutation(s)}
                  className={`px-3 py-1 rounded-full border text-xs transition-all ${
                    salutation === s
                      ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
                Info Mempelai
              </h2>
              <p className="text-base font-serif font-bold text-stone-900">
                {config.groom.name} &amp; {config.bride.name}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Slug: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">{config.slug}</code>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <span className="text-[11px] text-stone-500">Total Tamu di List:</span>
              <p className="text-2xl font-bold text-stone-900">{guestList.length} Orang</p>
            </div>
          </div>
        </div>

        {/* Guest Links Table / Cards */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
              2. Daftar Link Tamu Siap Sebar ({guestList.length})
            </h2>
            <span className="text-xs text-stone-500">Klik tombol WA untuk chat langsung</span>
          </div>

          <div className="divide-y divide-stone-100">
            {guestList.length === 0 ? (
              <div className="p-8 text-center text-sm text-stone-400 italic">
                Belum ada nama tamu. Masukkan nama di formulir atas.
              </div>
            ) : (
              guestList.map((name, index) => {
                const guestUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
                const waLink = `https://wa.me/?text=${generateWhatsappMessage(name, guestUrl)}`;

                return (
                  <div
                    key={`${name}-${index}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          {index + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                          {name}
                        </h3>
                      </div>

                      {/* URL Preview */}
                      <p className="mt-1 ml-8 text-xs font-mono text-amber-800 break-all bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-200/50 inline-block">
                        {guestUrl}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center ml-8 sm:ml-0">
                      {/* Preview in New Tab */}
                      <a
                        href={guestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors"
                        title="Buka Undangan"
                      >
                        Buka ↗
                      </a>

                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(guestUrl, index)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          copiedIndex === index
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-stone-200 bg-white hover:bg-stone-100 text-stone-700"
                        }`}
                      >
                        {copiedIndex === index ? "✓ Tersalin" : "Salin Link"}
                      </button>

                      {/* WhatsApp Share */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Kirim WA</span>
                        <span>↗</span>
                      </a>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGuest(index)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                        title="Hapus"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
