"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   DEFAULT SLIDES — used when CMS has no data
   Admin controls: subtitle (label), title,
   description, cta_text only.
   Image / video is set via the CMS media field.
───────────────────────────────────────────── */
const defaultSlides = [
  {
    type: "image",
    mediaUrl: "/images/hero-banner.jpg",
    subtitle: "NEW COLLECTION",
    title: "DRESSED TO MAKE AN IMPRESSION.",
    description:
      "Discover the epitome of quiet luxury with our latest bespoke collection of Indian designer wear.",
    cta_text: "EXPLORE NOW",
    showText: true,
  },
];

export function HeroSlider({ initialSlides }: { initialSlides?: any[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(initialSlides ?? defaultSlides);
  const [isPaused, setIsPaused] = useState(false);

  /* ── CMS fetch (only if SSR didn't pre-populate) ── */
  useEffect(() => {
    if (initialSlides?.length) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hero_banner")
          .single();
        if (data?.value) {
          const val = data.value;
          if (Array.isArray(val) && val.length > 0) setSlides(val);
          else if (val.mediaUrl || val.image) setSlides([val]);
        }
      } catch {/* silently fall back to default */}
    })();
  }, [initialSlides]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const t = setInterval(
      () => setCurrentIndex(p => (p + 1) % slides.length),
      5500
    );
    return () => clearInterval(t);
  }, [slides.length, isPaused]);

  const goTo = (i: number) => setCurrentIndex((i + slides.length) % slides.length);
  const slide = slides[currentIndex];
  if (!slide) return null;

  const label    = (slide.subtitle   || "").trim();
  const title    = (slide.title      || "").trim();
  const body     = (slide.description || "").trim();
  const cta      = (slide.cta_text   || "EXPLORE NOW").trim();
  const hasText  = slide.showText !== false && (label || title || body);

  return (
    <section
      aria-label="Hero carousel"
      className="relative w-full overflow-hidden bg-[#1A1310]
        h-[73svh] min-h-[73svh] max-h-[73svh]
        md:h-[88vh] md:min-h-0 md:max-h-[1000px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── SLIDE IMAGE / VIDEO ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {slide.type === "video" || /\.(mp4|webm)$/i.test(slide.mediaUrl ?? "") ? (
            <video
              src={slide.mediaUrl}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
            />
          ) : (
            <Image
              src={slide.mediaUrl ?? (slide as any).image}
              alt={slide.title || "Hero banner"}
              fill
              priority
              className="object-cover object-top md:object-[center_20%]"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── GRADIENTS ── */}
      {/* Mobile: strong base gradient (bottom 50%) */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[52%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />
      {/* Mobile: very soft top vignette */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      {/* Desktop: elegant bottom + left wash */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[58%] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none z-10" />

      {/* ── TEXT CONTENT ── */}
      {hasText && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center pointer-events-none">
          <div className="container mx-auto px-6 md:px-16 pb-[10vh] md:pb-0 pointer-events-auto">
            <motion.div
              key={`text-${currentIndex}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start gap-4 md:gap-5 max-w-[680px]"
            >
              {/* Label */}
              {label && (
                <span className="relative font-sans text-[10px] md:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] pb-1.5 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#C9A962]/45">
                  {label}
                </span>
              )}

              {/* Headline */}
              {title && (
                <h1 className="font-serif text-[34px] leading-[1.08] tracking-[-0.01em] text-white
                  md:text-[60px] md:leading-[1.06]
                  lg:text-[72px]">
                  {title}
                </h1>
              )}

              {/* Body */}
              {body && (
                <p className="font-sans text-[13px] md:text-[15px] text-white/80 font-light leading-[1.7] max-w-[440px]">
                  {body}
                </p>
              )}

              {/* CTA */}
              <Link
                href="/products"
                id="hero-cta"
                className="
                  mt-1 md:mt-3
                  inline-flex items-center justify-center gap-3
                  bg-white text-[#C9A962]
                  px-8 md:px-10 py-3.5 md:py-[14px]
                  font-sans text-[10.5px] md:text-[11px] font-bold tracking-[0.22em] uppercase
                  border border-white
                  hover:bg-transparent hover:text-white hover:border-white/70
                  transition-all duration-400
                  w-full max-w-[260px] md:max-w-none md:w-auto
                "
              >
                {cta}
                {/* diamond accent */}
                <span className="w-[5px] h-[5px] bg-[#C9A962] rotate-45 inline-block shrink-0 opacity-80" />
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── SLIDE INDICATORS REMOVED ── */}

      {/* ── PROGRESS BAR REMOVED ── */}
    </section>
  );
}
