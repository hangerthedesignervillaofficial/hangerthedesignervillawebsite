"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    image: "/images/hero-banner.jpg",
    subtitle: "NEW COLLECTION",
    title: "THE ART OF\nBEING YOU",
    description: "Contemporary indian fashion, thoughtfully curated for every expression.",
  },
  {
    image: "/images/moments-banner.jpg",
    subtitle: "FESTIVE SEASON",
    title: "DRESSED TO\nIMPRESS",
    description: "Celebrate every occasion with timeless elegance and modern grace.",
  },
  {
    image: "/images/clothing.jpg",
    subtitle: "THE EDIT",
    title: "CURATED\nFOR YOU",
    description: "Hand-picked pieces from India's finest designers, made for you.",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentIndex];

  return (
    <div className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden bg-[#1A0A0E]">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Content */}
      <div className="absolute inset-0 container mx-auto px-6 lg:px-12 flex flex-col justify-center items-start">
        <div className="max-w-xl mt-8">
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D4AF37] mb-5"
          >
            {slide.subtitle}
          </motion.p>

          <motion.h2
            key={`title-${currentIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-[32px] sm:text-[42px] md:text-[64px] lg:text-[80px] font-normal leading-[1.05] text-white mb-5 whitespace-pre-line"
          >
            {slide.title}
          </motion.h2>

          <motion.p
            key={`desc-${currentIndex}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden md:block font-sans text-[13px] md:text-[14px] font-light text-gray-200/90 mb-10 max-w-sm leading-relaxed"
          >
            {slide.description}
          </motion.p>

          <motion.div
            key={`btns-${currentIndex}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex gap-3"
          >
            <Link
              href="/products"
              className="bg-gradient-to-r from-[#2C1810] to-[#4A0E17] hover:from-[#4A0E17] hover:to-[#6B1A24] text-[#D4AF37] border border-[#D4AF37]/25 px-8 py-3.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 text-center hover:scale-105 active:scale-95 shadow-lg shadow-[#D4AF37]/5"
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              href="/products"
              className="hidden md:block border border-[#D4AF37]/35 bg-[#FDFBF7]/5 hover:bg-[#FDFBF7]/15 hover:border-[#D4AF37]/70 text-[#D4AF37] px-8 py-3.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 text-center hover:scale-105 active:scale-95"
            >
              EXPLORE NEW ARRIVALS
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide Progress Indicator */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:right-10 flex items-center gap-3">
        <span className="font-sans text-[11px] text-white font-medium">0{currentIndex + 1}</span>
        <div className="w-16 md:w-20 h-[1.5px] bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            key={currentIndex}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
        <span className="font-sans text-[11px] text-white/40">0{slides.length}</span>
      </div>
    </div>
  );
}
