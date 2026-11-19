"use client";

import React, { useState, useEffect, useCallback, type HTMLAttributes } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn, formatIDR } from "@lib/format";

export interface GalleryItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  badge?: string;
  whatsappUrl?: string;
  onOrder?: () => void;
  originalProduct?: any;
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  title?: string;
  subtitle?: string;
  onAddToCart?: (item: GalleryItem) => void;
  onOrderClick?: (item: GalleryItem) => void;
}

export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius,
      autoRotateSpeed = 0,
      title,
      subtitle,
      onAddToCart,
      onOrderClick,
      ...props
    },
    ref,
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: "center",
      containScroll: false,
      loop: true,
      skipSnaps: false,
      dragFree: false,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canPrev, setCanPrev] = useState(true);
    const [canNext, setCanNext] = useState(true);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
      (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      },
      [emblaApi],
    );

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Katalog Buket Pilihan"
        className={cn(
          "relative w-full max-w-full overflow-hidden select-none py-2",
          className,
        )}
        {...props}
      >
        {/* Optional Header */}
        {title && (
          <div className="w-full text-center mb-6 px-4">
            <h3 className="text-ink font-ui text-[18px] sm:text-[24px] font-bold tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-muted text-[11px] sm:text-[12px] font-body mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 2D Flat Carousel Viewport */}
        <div className="overflow-hidden px-4 sm:px-6 w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 items-stretch py-4">
            {items.map((item, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className="pl-4 flex-[0_0_82%] xs:flex-[0_0_72%] sm:flex-[0_0_340px] md:flex-[0_0_360px] min-w-0 transition-all duration-300"
                  style={{
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.72,
                  }}
                  onClick={() => scrollTo(index)}
                >
                  <div className="relative w-full h-[380px] xs:h-[420px] sm:h-[460px] rounded-2xl shadow-lg overflow-hidden group border border-white/20 bg-stone-900">
                    {/* Full cover image */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80vw, 360px"
                      priority={index === 0}
                      unoptimized={
                        item.image.startsWith("data:") ||
                        item.image.startsWith("http")
                      }
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

                    {/* Badge if available */}
                    {item.badge && (
                      <div className="absolute top-3 left-3 rounded-full bg-accent text-white font-ui text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 shadow-md z-10">
                        {item.badge}
                      </div>
                    )}

                    {/* Price Tag pill on top right */}
                    <div className="absolute top-3 right-3 rounded-full bg-black/75 border border-white/30 backdrop-blur-md px-3 py-1 text-white font-ui text-[11px] sm:text-[12px] font-bold shadow-lg z-10">
                      {formatIDR(item.price)}
                    </div>

                    {/* Bottom Card Content */}
                    <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white z-10">
                      <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight drop-shadow-sm text-white">
                        {item.name}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] opacity-85 block mt-1 font-light text-white/90 line-clamp-2">
                        {item.subtitle}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs gap-2">
                        <span className="text-[11px] sm:text-[12px] text-white/80">
                          Harga: <strong className="text-white font-bold">{formatIDR(item.price)}</strong>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {onAddToCart && (
                            <button
                              type="button"
                              title="Tambah ke Keranjang"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(item);
                              }}
                              className="inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer"
                            >
                              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                                <path
                                  d="M6 7h11l-1 9.5a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 16.5L6 7Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M8.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M11.5 10.5v4M9.5 12.5h4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          )}

                          {onOrderClick || item.onOrder ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOrderClick) {
                                  onOrderClick(item);
                                } else if (item.onOrder) {
                                  item.onOrder();
                                }
                              }}
                              className="inline-flex items-center gap-1 bg-white text-black hover:bg-white/90 font-ui text-[10.5px] sm:text-[11.5px] font-bold px-3 py-1.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                              <span>Pesan Sekarang</span>
                              <span>→</span>
                            </button>
                          ) : item.whatsappUrl ? (
                            <a
                              href={item.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="inline-flex items-center gap-1 bg-white text-black hover:bg-white/90 font-ui text-[10.5px] sm:text-[11.5px] font-bold px-3 py-1.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                              <span>Pesan</span>
                              <span>→</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation & Indicator */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-surface/90 border border-line px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Geser ke buket sebelumnya"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white shadow-xs active:scale-90 disabled:opacity-40 cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true">
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="font-ui text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted px-2 select-none font-medium whitespace-nowrap">
              {selectedIndex + 1} / {items.length}
            </span>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Geser ke buket berikutnya"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white shadow-xs active:scale-90 disabled:opacity-40 cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";
