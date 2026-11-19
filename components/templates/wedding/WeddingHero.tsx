"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";

interface WeddingHeroProps {
  config: WeddingConfig;
}

function formatEventDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildGoogleCalendarUrl(event: WeddingConfig["events"][0]): string {
  const start = event.date.replace(/-/g, "") + "T" + event.timeStart.replace(":", "") + "00";
  const end = event.date.replace(/-/g, "") + "T" + event.timeEnd.replace(":", "") + "00";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    location: `${event.venue}, ${event.address}`,
    details: `${event.title} di ${event.venue}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function WeddingHero({ config }: WeddingHeroProps) {
  const { theme, quote, events } = config;
  const targetEvent = events[0];
  const targetDate = new Date(`${targetEvent.date}T${targetEvent.timeStart}:00`);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calc();
    intervalRef.current = setInterval(calc, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEvent.date, targetEvent.timeStart]);

  const countdownItems = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Ayat / Quote */}
        <motion.blockquote
          className="text-sm md:text-base leading-relaxed italic mb-3"
          style={{ fontFamily: theme.fontSerif, color: theme.text }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          &ldquo;{quote.text}&rdquo;
        </motion.blockquote>
        <motion.p
          className="text-xs tracking-wider"
          style={{ color: theme.primary }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          — {quote.source}
        </motion.p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-10">
          <div className="w-16 h-px" style={{ backgroundColor: `${theme.primary}40` }} />
          <span className="text-xs" style={{ color: theme.primary }}>◆</span>
          <div className="w-16 h-px" style={{ backgroundColor: `${theme.primary}40` }} />
        </div>

        {/* Editorial Couple Photo Banner */}
        <motion.div
          className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-3xl overflow-hidden mb-10 shadow-xl border"
          style={{ borderColor: `${theme.primary}30` }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/wedding/hero.jpg"
            alt="The Wedding of Raditya & Adinda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 justify-center">
            <span
              className="text-white text-xl md:text-2xl font-light tracking-wider"
              style={{ fontFamily: theme.fontSerif }}
            >
              {config.groom.name} &amp; {config.bride.name}
            </span>
          </div>
        </motion.div>

        {/* Event Date */}
        <motion.p
          className="text-xs tracking-[0.2em] uppercase mb-6"
          style={{ color: theme.textMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {formatEventDate(targetEvent.date)}
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="grid grid-cols-4 gap-3 md:gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="py-4 rounded-xl"
              style={{
                backgroundColor: `${theme.primary}08`,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              <span
                className="block text-2xl md:text-4xl font-light"
                style={{ fontFamily: theme.fontSerif, color: theme.text }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className="block text-[10px] tracking-wider uppercase mt-1"
                style={{ color: theme.textMuted }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Save the Date */}
        <motion.a
          href={buildGoogleCalendarUrl(targetEvent)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase transition-colors hover:opacity-80"
          style={{
            border: `1.5px solid ${theme.primary}`,
            color: theme.primary,
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <span>📅</span>
          Save the Date
        </motion.a>
      </div>
    </section>
  );
}
