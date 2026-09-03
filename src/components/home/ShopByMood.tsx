"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function ShopByMood({ initialMoods }: { initialMoods?: any[] }) {
  const [moods, setMoods] = useState<any[]>(initialMoods || [
    { title: "EVERYDAY EDIT", mediaUrl: "/images/clothing.jpg", link: "/mood/everyday-edit", type: "image" },
    { title: "FESTIVE EDIT", mediaUrl: "/images/moments-banner.jpg", link: "/mood/festive-edit", type: "image" },
    { title: "OCCASION EDIT", mediaUrl: "/images/curated-couch.jpg", link: "/mood/occasion-edit", type: "image" },
    { title: "STATEMENT EDIT", mediaUrl: "/images/hero-banner.jpg", link: "/mood/statement-edit", type: "image" },
  ]);

  useEffect(() => {
    if (initialMoods) return;
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();

        if (data && data.value?.moods) {
          setMoods(data.value.moods);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="pt-8 pb-4 md:pt-14 md:pb-6 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── Desktop Layout ────────────────────────────────────────── */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 md:mb-10 text-left border-b border-[#D4AF37]/15 pb-4"
          >
            <h2 className="font-serif text-2xl md:text-[32px] font-normal tracking-[0.2em] text-[#2C1810] uppercase mb-1">
              SHOP BY MOOD
            </h2>
            <p className="font-sans text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase">
              Find your vibe. Shop your moment.
            </p>
          </motion.div>

          <div className="grid grid-cols-4 gap-6 lg:gap-8">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={mood.link}
                  className="group relative block w-full aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm border border-[#D4AF37]/15"
                >
                  {mood.type === "video" ? (
                    <video src={mood.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${mood.mediaUrl})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-3.5 border border-[#D4AF37]/35 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 z-10 transition-transform duration-350 group-hover:translate-x-1">
                    <span className="font-sans text-[8px] font-semibold tracking-[0.2em] text-[#D4AF37] mb-1.5 uppercase block">
                      CURATED EDIT
                    </span>
                    <h3 className="font-serif text-sm lg:text-base font-normal tracking-[0.1em] text-white uppercase mb-1.5 leading-none" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                      {mood.title}
                    </h3>
                    <span className="font-sans text-[8.5px] tracking-[0.1em] text-gray-300 font-semibold flex items-center gap-0.5 group-hover:text-[#D4AF37] transition-colors">
                      EXPLORE NOW <span className="text-[10px] transition-transform duration-350 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile Layout ─────────────────────────────────────────── */}
        <div className="block md:hidden">
          {/* Section heading — centered on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-5 text-center"
          >
            <h2 className="font-serif text-[22px] font-normal tracking-[0.22em] text-[#2C1810] uppercase mb-1 leading-tight">
              SHOP BY MOOD
            </h2>
            {/* Gold ornament line */}
            <div className="flex items-center justify-center gap-3 mt-2 mb-1">
              <div className="h-[0.5px] w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className="text-[#D4AF37] text-[9px]">✦</span>
              <div className="h-[0.5px] w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>
            <p className="font-sans text-[8px] font-bold tracking-[0.25em] text-[#9B8E85] uppercase">
              Find your vibe. Shop your moment.
            </p>
          </motion.div>

          {/* Horizontal snap-scroll container */}
          <div
            className="flex overflow-x-auto gap-4 pb-5 pt-1 -mx-4 px-4 scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {moods.map((mood, index) => (
              <motion.div
                key={mood.title}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <Link
                  href={mood.link}
                  className="group relative block w-[160px] aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm border border-[#D4AF37]/15"
                >
                  {mood.type === "video" ? (
                    <video
                      src={mood.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${mood.mediaUrl})` }}
                    />
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Subtle inner gold border */}
                  <div className="absolute inset-2.5 border border-[#D4AF37]/30 pointer-events-none" />

                  {/* Text Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-start gap-1">
                    <span className="font-sans text-[7px] font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                      CURATED EDIT
                    </span>
                    <h3
                      className="font-serif text-[13px] font-normal tracking-[0.1em] text-white uppercase leading-tight"
                      style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                    >
                      {mood.title}
                    </h3>
                    <span className="text-[7px] font-semibold tracking-[0.1em] text-white/90 uppercase mt-0.5 border-b border-white/30 pb-0.5">
                      EXPLORE →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll hint dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {moods.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === 0 ? "w-4 h-1 bg-[#D4AF37]" : "w-1 h-1 bg-[#D4AF37]/30"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
