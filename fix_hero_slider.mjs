import fs from 'fs';

const file = 'src/components/home/HeroSlider.tsx';
const content = `"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const defaultSlides = [
  {
    type: 'image',
    mediaUrl: "/images/hero-banner.jpg",
    subtitle: "NEW COLLECTION",
    title: "THE ART OF\\nBEING YOU",
    description: "Contemporary indian fashion, thoughtfully curated for every expression.",
  },
  {
    type: 'image',
    mediaUrl: "/images/moments-banner.jpg",
    subtitle: "FESTIVE SEASON",
    title: "DRESSED TO\\nIMPRESS",
    description: "Celebrate every occasion with timeless elegance and modern grace.",
  },
  {
    type: 'image',
    mediaUrl: "/images/clothing.jpg",
    subtitle: "THE EDIT",
    title: "CURATED\\nFOR YOU",
    description: "Hand-picked pieces from India's finest designers, made for you.",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_banner')
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
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentIndex];

  if (!slide) return null;

  return (
    <div className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-[#1A0A0E]">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {slide.type === 'video' || slide.mediaUrl?.match(/\\.(mp4|webm)$/i) ? (
            <video 
              src={slide.mediaUrl} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center md:bg-top"
              style={{ backgroundImage: \`url(\${slide.mediaUrl || slide.image})\` }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:from-black/70 md:via-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 container mx-auto px-5 md:px-12 flex flex-col justify-center items-start z-10 pointer-events-none">
        <div className="max-w-xl mt-12 md:mt-8 w-full pointer-events-auto">
          {slide.subtitle && (
            <motion.p
              key={\`sub-\${currentIndex}\`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-sans text-[9px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-4 md:mb-5 drop-shadow-md"
            >
              {slide.subtitle}
            </motion.p>
          )}

          {slide.title && (
            <motion.h2
              key={\`title-\${currentIndex}\`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif text-[40px] sm:text-[50px] md:text-[72px] lg:text-[88px] font-normal leading-[1.05] text-white mb-4 md:mb-5 whitespace-pre-line drop-shadow-lg"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {slide.title}
            </motion.h2>
          )}

          {slide.description && (
            <motion.p
              key={\`desc-\${currentIndex}\`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="block font-sans text-[13px] md:text-[14px] font-light text-gray-200/90 mb-8 md:mb-10 max-w-[280px] md:max-w-sm leading-relaxed drop-shadow-md"
            >
              {slide.description}
            </motion.p>
          )}

          <motion.div
            key={\`btns-\${currentIndex}\`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pr-6 sm:pr-0"
          >
            <Link
              href="/products"
              className="btn-shine w-full sm:w-auto bg-gradient-to-r from-[#2C1810] to-[#4A0E17] hover:from-[#3A141A] hover:to-[#5A121E] text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] px-8 py-4 md:py-3.5 font-sans text-[10px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 text-center hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#D4AF37]/15"
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              href="/products"
              className="btn-shine w-full sm:w-auto backdrop-blur-md bg-[#FDFBF7]/10 border border-[#FDFBF7]/30 hover:bg-[#FDFBF7]/20 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] text-[#FDFBF7] hover:text-[#D4AF37] px-8 py-4 md:py-3.5 font-sans text-[10px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 text-center hover:scale-[1.02] active:scale-95"
            >
              EXPLORE NEW ARRIVALS
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide Progress Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-5 md:bottom-10 md:right-10 flex items-center gap-3 z-20">
          <span className="font-sans text-[11px] text-white font-medium drop-shadow-md">0{currentIndex + 1}</span>
          <div className="w-16 md:w-20 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#D4AF37]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              key={currentIndex}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
          <span className="font-sans text-[11px] text-white/50 drop-shadow-md">0{slides.length}</span>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(file, content);
console.log("Updated HeroSlider.tsx");
