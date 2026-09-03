"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const labelText = slide.subtitle || "";
  const titleText = slide.title || "";
  const bodyText = slide.description || "";

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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/40 to-transparent md:from-black/72 md:via-black/28" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      {/* Content */}
      <div className="absolute inset-0 container mx-auto px-5 md:px-12 flex flex-col justify-center items-start z-10 pointer-events-none">
        <div className="max-w-xl mt-10 md:mt-6 w-full pointer-events-auto">
          {labelText && (
            <motion.p
              key={`sub-${currentIndex}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-sans text-[9px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-[#D4AF37] mb-4 md:mb-5 drop-shadow-md"
            >
              {labelText}
            </motion.p>
          )}

          {titleText && (
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="font-serif text-[38px] sm:text-[52px] md:text-[72px] lg:text-[90px] font-normal leading-[1.04] text-white mb-4 md:mb-5 whitespace-pre-line drop-shadow-lg"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {titleText}
            </motion.h1>
          )}

          {bodyText && (
            <motion.p
              key={`desc-${currentIndex}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="block font-sans text-[13px] md:text-[14px] font-light text-gray-200/88 mb-8 md:mb-10 max-w-[300px] md:max-w-sm leading-[1.75] drop-shadow-md"
            >
              {bodyText}
            </motion.p>
          )}

          {(titleText || bodyText || labelText) && (
            <motion.div
              key={`btns-${currentIndex}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pr-6 sm:pr-0"
            >
              <Link
                href="/products"
                className="btn-shine w-full sm:w-auto bg-gradient-to-r from-[#2C1810] to-[#4A0E17] hover:from-[#3A141A] hover:to-[#5A121E] text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] px-8 py-4 md:py-3.5 font-sans text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-500 text-center hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#D4AF37]/12"
              >
                SHOP THE COLLECTION
              </Link>
              <Link
                href="/new-arrivals"
                className="btn-shine w-full sm:w-auto backdrop-blur-md bg-[#FDFBF7]/10 border border-[#FDFBF7]/30 hover:bg-[#FDFBF7]/18 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.18)] text-[#FDFBF7] hover:text-[#D4AF37] px-8 py-4 md:py-3.5 font-sans text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-500 text-center hover:scale-[1.02] active:scale-95"
              >
                NEW ARRIVALS
              </Link>
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
