"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const defaultSlides = [
  {
    type: "image",
    mediaUrl: "/images/hero-banner.jpg",
  },
  {
    type: "image",
    mediaUrl: "/images/moments-banner.jpg",
  },
  {
    type: "image",
    mediaUrl: "/images/clothing.jpg",
  },
];

export function HeroSlider({ initialSlides }: { initialSlides?: any[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(initialSlides || defaultSlides);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialSlides) return;
    async function fetchBanner() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hero_banner")
          .single();

        if (data?.value) {
          if (Array.isArray(data.value) && data.value.length > 0) {
            setSlides(data.value);
          } else if (data.value.mediaUrl) {
            setSlides([data.value]);
          }
        }
      } catch (err) {
        console.error("Failed to load hero banner", err);
      }
    }
    fetchBanner();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const goTo = (idx: number) => setCurrentIndex((idx + slides.length) % slides.length);

  const slide = slides[currentIndex];
  if (!slide) return null;

  // CMS stores: subtitle (label chip), title (big headline), subtitle (body text)
  // Map: subtitle = the small badge label, title = big heading, description = body text
  // Fallback: if no description field, use subtitle as body text
  const labelText = (slide.subtitle || "").trim();
  const titleText = (slide.title || "").trim();
  const bodyText = (slide.description || "").trim();

  return (
    <div
      className="relative h-[86vh] md:h-[92vh] w-full overflow-hidden bg-[#1A0A0E]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide background */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          {slide.type === "video" || slide.mediaUrl?.match(/\.(mp4|webm)$/i) ? (
            <video
              src={slide.mediaUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center md:bg-top"
              style={{ backgroundImage: `url(${slide.mediaUrl || (slide as any).image})` }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays - Only show if there is text/content to make text readable */}
      {(labelText || titleText || bodyText) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/40 to-transparent md:from-black/72 md:via-black/28 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 container mx-auto px-6 md:px-12 flex flex-col justify-end md:justify-center items-start z-10 pointer-events-none pb-24 md:pb-0">
        <div className="max-w-2xl w-full pointer-events-auto">
          {slide.showText !== false && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={`text-${currentIndex}`}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start gap-4 md:gap-5"
            >
              {labelText && (
                <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 md:px-4 md:py-1.5 font-sans text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase text-white shadow-sm">
                  {labelText}
                </span>
              )}
              {titleText && (
                <h1 className="font-serif text-4xl md:text-6xl lg:text-[76px] leading-[1.05] tracking-wide text-white drop-shadow-xl" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  {titleText}
                </h1>
              )}
              {bodyText && (
                <p className="font-sans text-sm md:text-base text-white/90 font-light max-w-lg leading-relaxed drop-shadow-md">
                  {bodyText}
                </p>
              )}
              {(titleText || labelText) && (
                <Link
                  href="/products"
                  className="mt-2 md:mt-4 group inline-flex items-center gap-3 border border-white/50 text-white hover:bg-white hover:text-[#1A0A0E] px-8 py-3.5 md:px-10 md:py-4 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-lg"
                >
                  Explore Now
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Slide nav arrows (desktop) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 bg-black/20 backdrop-blur-sm hover:bg-black/30 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 bg-black/20 backdrop-blur-sm hover:bg-black/30 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 stroke-[1.5]" />
          </button>
        </>
      )}

      {/* Progress dots + counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-7 left-5 md:bottom-9 flex items-center gap-4 z-20">
          <span className="font-sans text-[11px] text-white/70 font-medium tabular-nums">
            0{currentIndex + 1}
          </span>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-400 cursor-pointer rounded-full ${
                  i === currentIndex
                    ? "w-8 h-[3px] bg-[#D4AF37]"
                    : "w-2 h-[3px] bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="font-sans text-[11px] text-white/40 tabular-nums">
            0{slides.length}
          </span>
        </div>
      )}

      {/* Slide progress bar at bottom */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37]/80 to-[#D4AF37]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            key={currentIndex}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
