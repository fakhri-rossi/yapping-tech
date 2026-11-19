"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
} from "react";
import Image from "next/image";
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
    const cardWidth = 280;
    const cardGap = 80;
    const computedRadius =
      radius ??
      Math.max(
        620,
        Math.round(((cardWidth + cardGap) * items.length) / (2 * Math.PI)),
      );

    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [startRotation, setStartRotation] = useState(0);
    const isHorizontalSwipeRef = useRef<boolean | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isInteractingRef = useRef(false);

    // Mac Trackpad 2-finger horizontal swipe (wheel event deltaX) support
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let wheelTimeout: NodeJS.Timeout | null = null;

      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > 4 || (e.shiftKey && Math.abs(e.deltaY) > 4)) {
          const delta = Math.abs(e.deltaX) > 4 ? e.deltaX : e.deltaY;
          e.preventDefault();
          isInteractingRef.current = true;
          setRotation((prev) => prev - delta * 0.18);

          if (wheelTimeout) clearTimeout(wheelTimeout);
          wheelTimeout = setTimeout(() => {
            isInteractingRef.current = false;
          }, 600);
        }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
        if (wheelTimeout) clearTimeout(wheelTimeout);
      };
    }, []);

    // Pointer / touch drag support with smooth axis-locking
    const handlePointerDown = (clientX: number, clientY: number) => {
      setStartX(clientX);
      setStartY(clientY);
      setStartRotation(rotation);
      isHorizontalSwipeRef.current = null;
    };

    const handlePointerMove = useCallback(
      (clientX: number, clientY: number) => {
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // If swipe direction is not determined yet, evaluate after 8px threshold
        if (isHorizontalSwipeRef.current === null) {
          if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
            if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
              isHorizontalSwipeRef.current = true;
              isInteractingRef.current = true;
              setIsDragging(true);
            } else {
              isHorizontalSwipeRef.current = false;
              return;
            }
          } else {
            return;
          }
        }

        // If vertical scrolling was detected, do not interfere with card rotation
        if (isHorizontalSwipeRef.current === false) return;

        // Smooth horizontal rotation
        setRotation(startRotation + deltaX * 0.35);
      },
      [startX, startY, startRotation],
    );

    const handlePointerUp = () => {
      setIsDragging(false);
      isHorizontalSwipeRef.current = null;
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 500);
    };

    useEffect(() => {
      const onMouseMove = (e: MouseEvent) => {
        if (isDragging || isHorizontalSwipeRef.current === null) {
          handlePointerMove(e.clientX, e.clientY);
        }
      };
      const onMouseUp = () => {
        handlePointerUp();
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const onTouchEnd = () => {
        handlePointerUp();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("touchcancel", onTouchEnd);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
      };
    }, [isDragging, handlePointerMove]);

    const anglePerItem = 360 / Math.max(1, items.length);

    // Step navigation per card with smooth alignment
    const handleStepPrev = () => {
      isInteractingRef.current = true;
      setRotation((prev) => {
        return Math.round(prev / anglePerItem) * anglePerItem + anglePerItem;
      });
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 1000);
    };

    const handleStepNext = () => {
      isInteractingRef.current = true;
      setRotation((prev) => {
        return Math.round(prev / anglePerItem) * anglePerItem - anglePerItem;
      });
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 1000);
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="region"
        aria-label="Katalog 3D Berputar"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        className={cn(
          "relative w-full h-[580px] sm:h-[680px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-visible touch-pan-y pb-20 pt-4",
          className,
        )}
        style={{ perspective: "2200px" }}
        {...props}
      >
        {/* Optional Static Header above the carousel */}
        {title && (
          <div className="absolute top-4 left-0 w-full text-center pointer-events-none z-20 px-4">
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

        <div
          className="relative w-full h-full flex items-center justify-center pt-2 pb-16 transform-gpu"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
            );
            // Hide back cards completely so only front visible cards show up cleanly
            if (normalizedAngle > 90) return null;

            const opacity = Math.max(0.2, Math.cos((normalizedAngle * Math.PI) / 180));
            const isFront = normalizedAngle < 20;

            return (
              <div
                key={item.id}
                role="group"
                aria-label={item.name}
                className="absolute w-[240px] xs:w-[260px] sm:w-[280px] h-[350px] xs:h-[370px] sm:h-[400px] transform-gpu"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${computedRadius}px)`,
                  left: "50%",
                  top: "48%",
                  marginLeft: "-120px",
                  marginTop: "-175px",
                  opacity: opacity,
                  transition: isDragging ? "none" : "opacity 0.2s linear",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Individual Card identical to the image styling */}
                <div className="relative w-full h-full rounded-2xl shadow-xl overflow-hidden group border border-white/20 bg-black/75">
                  {/* Full bleeding image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 260px, 280px"
                    unoptimized={
                      item.image.startsWith("data:") ||
                      item.image.startsWith("http")
                    }
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient shadow overlay matching the screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

                  {/* Price Tag pill on top right */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/70 border border-white/30 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-white font-ui text-[10px] sm:text-[11px] font-bold shadow-lg z-10">
                    {formatIDR(item.price)}
                  </div>

                  {/* Bottom Text Content strictly matching the screenshot typography & layout */}
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white z-10">
                    <h2 className="text-[17px] xs:text-[19px] sm:text-[22px] font-bold leading-tight tracking-tight drop-shadow-sm">
                      {item.name}
                    </h2>
                    <em className="text-[11.5px] xs:text-[12.5px] sm:text-[13px] opacity-85 block mt-0.5 sm:mt-1 not-italic font-light text-white/90 line-clamp-1">
                      {item.subtitle}
                    </em>

                    <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 border-t border-white/20 flex items-center justify-between text-xs gap-1.5">
                      <span className="text-[10px] sm:text-[11px] opacity-80 text-white/80 truncate">
                        Harga: <strong className="text-white font-bold">{formatIDR(item.price)}</strong>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onAddToCart && (
                          <button
                            type="button"
                            title="Tambah ke Keranjang"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isFront) return;
                              onAddToCart(item);
                            }}
                            className="inline-flex items-center justify-center h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer"
                          >
                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true">
                              <path
                                d="M6 7h11l-1 9.5a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 16.5L6 7Z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <path
                                d="M8.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                              <path
                                d="M11.5 10.5v4M9.5 12.5h4"
                                stroke="currentColor"
                                strokeWidth="1.4"
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
                              if (!isFront) return;
                              if (onOrderClick) {
                                onOrderClick(item);
                              } else if (item.onOrder) {
                                item.onOrder();
                              }
                            }}
                            className="inline-flex items-center gap-1 bg-white text-black hover:bg-white/90 font-ui text-[9.5px] sm:text-[10.5px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
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
                              if (!isFront) e.preventDefault();
                            }}
                            className="inline-flex items-center gap-1 bg-white text-black hover:bg-white/90 font-ui text-[9.5px] sm:text-[10.5px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
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

        {/* Navigation Step Buttons (Geser per Card) */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3 bg-surface/80 border border-line px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={handleStepPrev}
            aria-label="Geser ke buket sebelumnya"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white shadow-xs active:scale-90 cursor-pointer"
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

          <span className="font-ui text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-muted px-1 select-none font-medium whitespace-nowrap">
            Geser Card
          </span>

          <button
            type="button"
            onClick={handleStepNext}
            aria-label="Geser ke buket berikutnya"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white shadow-xs active:scale-90 cursor-pointer"
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
    );
  },
);

CircularGallery.displayName = "CircularGallery";
