"use client";

import { motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";

interface OpeningCoverProps {
  config: WeddingConfig;
  guestName: string;
  onOpen: () => void;
}

export function OpeningCover({ config, guestName, onOpen }: OpeningCoverProps) {
  const { theme, groom, bride, groomInitial, brideInitial } = config;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ backgroundColor: theme.background }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Monogram */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <span
          className="text-4xl md:text-5xl tracking-wide"
          style={{ fontFamily: theme.fontSerif, color: theme.primary }}
        >
          {groomInitial}
        </span>
        <span
          className="text-2xl md:text-3xl mx-3"
          style={{ fontFamily: theme.fontSerif, color: theme.textMuted }}
        >
          &amp;
        </span>
        <span
          className="text-4xl md:text-5xl tracking-wide"
          style={{ fontFamily: theme.fontSerif, color: theme.primary }}
        >
          {brideInitial}
        </span>
      </motion.div>

      {/* The Wedding Of */}
      <motion.p
        className="text-[10px] tracking-[0.35em] uppercase mb-3"
        style={{ color: theme.textMuted, fontFamily: theme.fontSans }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        The Wedding of
      </motion.p>

      {/* Couple Names */}
      <motion.h1
        className="text-3xl md:text-5xl text-center leading-tight mb-2"
        style={{ fontFamily: theme.fontSerif, color: theme.text }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {groom.name}
        <span className="block text-lg md:text-2xl my-1" style={{ color: theme.textMuted }}>
          &amp;
        </span>
        {bride.name}
      </motion.h1>

      {/* Ornamental divider */}
      <motion.div
        className="flex items-center gap-3 my-6"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="w-12 h-px" style={{ backgroundColor: `${theme.primary}50` }} />
        <span className="text-xs" style={{ color: theme.primary }}>✦</span>
        <div className="w-12 h-px" style={{ backgroundColor: `${theme.primary}50` }} />
      </motion.div>

      {/* Guest name */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.textMuted }}>
          Kepada Yth.
        </p>
        <p className="text-[10px] tracking-[0.15em] mb-2" style={{ color: theme.textMuted }}>
          Bapak/Ibu/Saudara/i
        </p>
        <p
          className="text-xl md:text-2xl"
          style={{ fontFamily: theme.fontSerif, color: theme.text }}
        >
          {guestName || "Tamu Undangan"}
        </p>
      </motion.div>

      {/* Open button */}
      <motion.button
        onClick={onOpen}
        className="px-8 py-3 rounded-full text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: theme.primary }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Buka Undangan
      </motion.button>
    </motion.div>
  );
}
