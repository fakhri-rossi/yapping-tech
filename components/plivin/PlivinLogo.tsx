"use client";

import React from "react";

interface PlivinLogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export function PlivinLogo({ className = "", variant = "dark" }: PlivinLogoProps) {
  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <span
        className={`font-serif tracking-tight text-xl sm:text-2xl font-bold transition-colors ${
          isLight ? "text-[#FAF8F5]" : "text-stone-950"
        }`}
      >
        plivin
      </span>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: "#C5A880" }}
      />
      <span
        className={`text-xs font-mono font-medium tracking-wider uppercase transition-colors ${
          isLight ? "text-stone-400" : "text-stone-500"
        }`}
      >
        co
      </span>
    </div>
  );
}
