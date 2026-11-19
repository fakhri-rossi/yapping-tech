"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";

interface CoupleSectionProps {
  config: WeddingConfig;
}

export function CoupleSection({ config }: CoupleSectionProps) {
  const { theme, groom, bride } = config;

  const profileCard = (
    person: WeddingConfig["groom"],
    initial: string,
    delay: number,
  ) => (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
    >
      {/* Photo with initial fallback */}
      <div
        className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-4 shadow-md"
        style={{
          border: `3px solid ${theme.primary}`,
          backgroundColor: `${theme.primary}10`,
        }}
      >
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.fullName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-5xl md:text-6xl"
              style={{ fontFamily: theme.fontSerif, color: theme.primary }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className="text-xl md:text-2xl mb-1"
        style={{ fontFamily: theme.fontSerif, color: theme.text }}
      >
        {person.fullName}
      </h3>

      {/* Parents */}
      <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: theme.textMuted }}>
        {person.parentNames}
      </p>

      {/* Instagram */}
      {person.instagram && (
        <p className="text-xs mt-2" style={{ color: theme.primary }}>
          {person.instagram}
        </p>
      )}
    </motion.div>
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section kicker */}
        <motion.p
          className="text-center text-xs tracking-[0.3em] uppercase mb-10"
          style={{ color: theme.textMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Mempelai
        </motion.p>

        {/* Couple cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {profileCard(groom, config.groomInitial, 0.1)}

          {/* Ampersand */}
          <motion.span
            className="text-3xl md:text-4xl"
            style={{ fontFamily: theme.fontSerif, color: theme.primary }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            &amp;
          </motion.span>

          {profileCard(bride, config.brideInitial, 0.5)}
        </div>
      </div>
    </section>
  );
}
