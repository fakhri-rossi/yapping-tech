"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeddingWish } from "@type/wedding";

interface WishesWallProps {
  accentColor?: string;
  fontSerif?: string;
}

const ATTENDANCE_STYLES: Record<WeddingWish["attendance"], { label: string; bg: string; text: string }> = {
  hadir: { label: "Hadir", bg: "#dcfce7", text: "#166534" },
  tidak: { label: "Tidak Hadir", bg: "#fee2e2", text: "#991b1b" },
  ragu: { label: "Masih Ragu", bg: "#fef9c3", text: "#854d0e" },
};

export function WishesWall({ accentColor = "#C5A880", fontSerif }: WishesWallProps) {
  const [wishes, setWishes] = useState<WeddingWish[]>([
    {
      id: "sample-1",
      name: "Budi & Keluarga",
      message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, wa rahmah.",
      attendance: "hadir",
      timestamp: 1,
      timeAgo: "1 hari lalu",
    },
    {
      id: "sample-2",
      name: "Tante Ani",
      message: "Barakallah ya! Semoga langgeng dan selalu bahagia.",
      attendance: "hadir",
      timestamp: 2,
      timeAgo: "12 jam lalu",
    },
    {
      id: "sample-3",
      name: "Dimas Sahabat Kampus",
      message: "Akhirnya bro! Selamat ya, semoga rezekinya lancar dan segera diberi momongan.",
      attendance: "ragu",
      timestamp: 3,
      timeAgo: "1 jam lalu",
    },
  ]);

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<WeddingWish["attendance"]>("hadir");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim()) return;

      const now = Date.now();
      const wish: WeddingWish = {
        id: `wish-${now}`,
        name: name.trim(),
        message: message.trim(),
        attendance,
        timestamp: now,
        timeAgo: "Baru saja",
      };

      setWishes((prev) => [wish, ...prev]);
      setName("");
      setMessage("");
      setAttendance("hadir");
    },
    [name, message, attendance],
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section kicker */}
        <p
          className="text-center text-xs tracking-[0.3em] uppercase mb-2"
          style={{ color: `${accentColor}99` }}
        >
          Ucapan &amp; Doa Restu
        </p>
        <h2
          className="text-center text-2xl md:text-3xl mb-8"
          style={{ fontFamily: fontSerif || "inherit", color: "#1C1917" }}
        >
          Buku Tamu Digital
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 md:p-6 rounded-2xl mb-8 space-y-4"
          style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}15` }}
        >
          {/* Name */}
          <div>
            <label className="block text-xs mb-1.5 tracking-wider" style={{ color: `${accentColor}99` }}>
              Nama Anda
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white border outline-none focus:ring-1"
              style={{ borderColor: `${accentColor}30`, color: "#1C1917" }}
            />
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-xs mb-1.5 tracking-wider" style={{ color: `${accentColor}99` }}>
              Konfirmasi Kehadiran
            </label>
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as WeddingWish["attendance"])}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white border outline-none focus:ring-1"
              style={{ borderColor: `${accentColor}30`, color: "#1C1917" }}
            >
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak Hadir</option>
              <option value="ragu">Masih Ragu</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs mb-1.5 tracking-wider" style={{ color: `${accentColor}99` }}>
              Ucapan &amp; Doa
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              placeholder="Tuliskan ucapan dan doa restu Anda..."
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white border outline-none focus:ring-1 resize-none"
              style={{ borderColor: `${accentColor}30`, color: "#1C1917" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: accentColor }}
          >
            Kirim Ucapan
          </button>
        </form>

        {/* Wishes list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {wishes.length === 0 && (
              <p className="text-center text-sm italic" style={{ color: `${accentColor}60` }}>
                Belum ada ucapan. Jadilah yang pertama!
              </p>
            )}
            {wishes.map((wish) => {
              const style = ATTENDANCE_STYLES[wish.attendance];
              return (
                <motion.div
                  key={wish.id}
                  layout
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${accentColor}05`, border: `1px solid ${accentColor}10` }}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {wish.name}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#44403c" }}>
                    {wish.message}
                  </p>
                  <p className="text-[10px] mt-2" style={{ color: `${accentColor}70` }}>
                    {wish.timeAgo || "Baru saja"}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
