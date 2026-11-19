"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";
import { OpeningCover } from "@components/templates/wedding/OpeningCover";
import { MusicPlayer } from "@components/templates/wedding/MusicPlayer";
import { WeddingHero } from "@components/templates/wedding/WeddingHero";
import { CoupleSection } from "@components/templates/wedding/CoupleSection";
import { EventDetails } from "@components/templates/wedding/EventDetails";
import { WeddingGift } from "@components/templates/wedding/WeddingGift";
import { WishesWall } from "@components/templates/wedding/WishesWall";

interface WeddingExperienceProps {
  config: WeddingConfig;
  guestName: string;
}

export function WeddingExperience({ config, guestName }: WeddingExperienceProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  return (
    <div
      className="min-h-dvh"
      style={{
        backgroundColor: config.theme.background,
        color: config.theme.text,
        fontFamily: config.theme.fontSans,
      }}
    >
      {/* Opening Cover Gate */}
      <AnimatePresence mode="wait">
        {!isOpened && (
          <OpeningCover
            config={config}
            guestName={guestName}
            onOpen={handleOpen}
          />
        )}
      </AnimatePresence>

      {/* Main Content - Only visible after opening */}
      {isOpened && (
        <>
          {/* Floating Music Player */}
          <MusicPlayer
            audioSrc={config.audioSrc}
            autoPlay
            accentColor={config.theme.primary}
          />

          {/* Hero - Quote & Countdown */}
          <WeddingHero config={config} />

          {/* Couple Profiles */}
          <CoupleSection config={config} />

          {/* Event Schedule */}
          <EventDetails config={config} />

          {/* Photo Gallery - Editorial Dynamic Grid */}
          {config.gallery.length > 0 && (
            <section className="py-20 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <p
                    className="text-xs tracking-[0.3em] uppercase mb-2"
                    style={{ color: config.theme.textMuted }}
                  >
                    Momen Bahagia
                  </p>
                  <h2
                    className="text-2xl sm:text-4xl font-light tracking-wide"
                    style={{ fontFamily: config.theme.fontSerif }}
                  >
                    Galeri Prewedding
                  </h2>
                </div>

                {/* Dynamic Bento & Masonry Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Photo 1: Tall Vertical (Spans 2 rows on desktop) */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl md:row-span-2 aspect-[3/4] md:aspect-auto shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={config.gallery[0]?.src || "/images/wedding/gallery-1.jpg"}
                      alt={config.gallery[0]?.alt || "Prewedding Photo 1"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Timeless Romance
                      </span>
                    </div>
                  </motion.div>

                  {/* Photo 2: Wide Landscape */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl aspect-[16/10] sm:col-span-2 md:col-span-2 shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Image
                      src={config.gallery[1]?.src || "/images/wedding/gallery-2.jpg"}
                      alt={config.gallery[1]?.alt || "Prewedding Photo 2"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Sunset Promise
                      </span>
                    </div>
                  </motion.div>

                  {/* Photo 3: Square */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl aspect-square shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Image
                      src={config.gallery[2]?.src || "/images/wedding/gallery-3.jpg"}
                      alt={config.gallery[2]?.alt || "Prewedding Photo 3"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Pure Intimacy
                      </span>
                    </div>
                  </motion.div>

                  {/* Photo 4: Vertical Standard */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl aspect-[3/4] shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    <Image
                      src={config.gallery[3]?.src || "/images/wedding/gallery-4.jpg"}
                      alt={config.gallery[3]?.alt || "Prewedding Photo 4"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Cherished Vows
                      </span>
                    </div>
                  </motion.div>

                  {/* Photo 5: Landscape Panoramic (Spans 2 cols on tablet/desktop) */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl aspect-[16/9] sm:col-span-2 md:col-span-2 shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Image
                      src={config.gallery[4]?.src || "/images/wedding/gallery-5.jpg"}
                      alt={config.gallery[4]?.alt || "Prewedding Photo 5"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Eternal Elegance
                      </span>
                    </div>
                  </motion.div>

                  {/* Photo 6: Square Fine Art */}
                  <motion.div
                    className="relative group overflow-hidden rounded-2xl aspect-square shadow-md border"
                    style={{ borderColor: `${config.theme.primary}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    <Image
                      src={config.gallery[5]?.src || "/images/wedding/gallery-6.jpg"}
                      alt={config.gallery[5]?.alt || "Prewedding Photo 6"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-wider">
                        Two Souls
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* Love Story */}
          {config.loveStory.length > 0 && (
            <section className="py-16 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-4"
                  style={{ color: config.theme.textMuted }}
                >
                  Perjalanan Cinta Kami
                </p>
                <div className="space-y-8 mt-8">
                  {config.loveStory.map((chapter, i) => (
                    <div key={i} className="relative pl-8 text-left border-l-2" style={{ borderColor: `${config.theme.primary}40` }}>
                      <div
                        className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2"
                        style={{ borderColor: config.theme.primary, backgroundColor: config.theme.background }}
                      />
                      <span
                        className="text-xs font-medium tracking-wider"
                        style={{ color: config.theme.primary }}
                      >
                        {chapter.year}
                      </span>
                      <h3
                        className="text-lg mt-1 mb-1"
                        style={{ fontFamily: config.theme.fontSerif }}
                      >
                        {chapter.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: config.theme.textMuted }}
                      >
                        {chapter.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Digital Gift */}
          <WeddingGift config={config} />

          {/* Wishes Wall */}
          <WishesWall
            accentColor={config.theme.primary}
            fontSerif={config.theme.fontSerif}
          />

          {/* Closing / Footer */}
          <footer className="py-16 px-6 text-center">
            <div className="max-w-md mx-auto">
              <p
                className="text-2xl md:text-3xl mb-2"
                style={{ fontFamily: config.theme.fontSerif }}
              >
                Terima Kasih
              </p>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: config.theme.textMuted }}
              >
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                kepada kedua mempelai.
              </p>
              <p
                className="text-lg"
                style={{ fontFamily: config.theme.fontSerif, color: config.theme.primary }}
              >
                {config.groom.name} & {config.bride.name}
              </p>
              <div className="mt-10 pt-6 border-t" style={{ borderColor: `${config.theme.primary}20` }}>
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: config.theme.textMuted }}>
                  Powered by
                </p>
                <p className="text-xs font-bold mt-1" style={{ color: config.theme.textMuted }}>
                  plivin.co
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: `${config.theme.textMuted}80` }}>
                  An ecosystem by Yapping Techflow
                </p>

                {/* Planner / Admin Shortcut */}
                <div className="mt-4">
                  <Link
                    href={`/wedding/${config.slug}/generator`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors border hover:bg-stone-100"
                    style={{ borderColor: `${config.theme.primary}30`, color: config.theme.textMuted }}
                  >
                    <span>⚙️</span>
                    <span>Generator Link Tamu</span>
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
