"use client";

import { motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";

interface EventDetailsProps {
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

export function EventDetails({ config }: EventDetailsProps) {
  const { theme, events } = config;

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section kicker */}
        <motion.p
          className="text-center text-xs tracking-[0.3em] uppercase mb-10"
          style={{ color: theme.textMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Rangkaian Acara
        </motion.p>

        {/* Event cards */}
        <div className="space-y-8">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="text-center p-6 md:p-8 rounded-2xl"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.primary}15`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              {/* Event title */}
              <h3
                className="text-xl md:text-2xl mb-3"
                style={{ fontFamily: theme.fontSerif, color: theme.text }}
              >
                {event.title}
              </h3>

              {/* Date */}
              <p className="text-sm mb-1" style={{ color: theme.text }}>
                {formatEventDate(event.date)}
              </p>

              {/* Time */}
              <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
                {event.timeStart} – {event.timeEnd} WIB
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 my-4">
                <div className="w-8 h-px" style={{ backgroundColor: `${theme.primary}30` }} />
                <span className="text-[8px]" style={{ color: theme.primary }}>✦</span>
                <div className="w-8 h-px" style={{ backgroundColor: `${theme.primary}30` }} />
              </div>

              {/* Venue */}
              <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                {event.venue}
              </p>
              <p className="text-xs mb-5" style={{ color: theme.textMuted }}>
                {event.address}
              </p>

              {/* Maps button */}
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-colors hover:opacity-80"
                style={{
                  border: `1.5px solid ${theme.primary}`,
                  color: theme.primary,
                }}
              >
                <span>📍</span>
                Buka Google Maps
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
