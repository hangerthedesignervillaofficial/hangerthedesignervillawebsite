"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export function ShopByMood({ initialMoods }: { initialMoods?: any[] }) {
  const [moods, setMoods] = useState<any[]>(initialMoods || [
    { title: "EVERYDAY EDIT", mediaUrl: "/images/clothing.jpg", link: "/mood/everyday-edit", type: "image" },
    { title: "FESTIVE EDIT", mediaUrl: "/images/moments-banner.jpg", link: "/mood/festive-edit", type: "image" },
    { title: "OCCASION EDIT", mediaUrl: "/images/curated-couch.jpg", link: "/mood/occasion-edit", type: "image" },
    { title: "STATEMENT EDIT", mediaUrl: "/images/hero-banner.jpg", link: "/mood/statement-edit", type: "image" },
  ]);
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  }, [initialMoods]);

  // Default to 2nd slide (index 1) on mobile so user can swipe both left and right immediately
  useEffect(() => {
    const scrollToSecondSlide = () => {
      if (scrollContainerRef.current && moods.length > 1) {
        scrollContainerRef.current.scrollLeft = 160;
        setActiveIndex(1);
      }
    };

    scrollToSecondSlide();
    // Re-check after DOM paint / images settle
    const t1 = setTimeout(scrollToSecondSlide, 50);
    const t2 = setTimeout(scrollToSecondSlide, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [moods]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      // width of item (140) + gap (20) = 160
      const newIndex = Math.round(scrollLeft / 160);
      setActiveIndex(Math.min(Math.max(newIndex, 0), moods.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * 160,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="pt-6 pb-2 md:pt-12 md:pb-6 bg-[#FDFBF7]">
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
          <div className="relative w-full overflow-hidden mb-6">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-5 pb-6 pt-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingLeft: "calc(50vw - 70px)",
                paddingRight: "calc(50vw - 70px)",
              }}
            >
              {moods.map((mood, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.div
                    key={mood.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 snap-center"
                    style={{ width: 140 }}
                  >
                    <Link
                      href={mood.link}
                      className="group flex flex-col items-center text-center gap-4 w-full outline-none"
                    >
                      {/* Circular image */}
                      <div
                        className="relative overflow-visible transition-all duration-500 ease-[0.25,1,0.5,1]"
                        style={{
                          width: isActive ? 140 : 116,
                          height: isActive ? 140 : 116,
                          opacity: isActive ? 1 : 0.6,
                          transform: isActive ? 'scale(1)' : 'scale(0.95)',
                        }}
                      >
                        <div className="absolute inset-0 rounded-full overflow-hidden bg-[#F0E6D8]/60 shadow-[0_8px_30px_rgba(44,24,16,0.12)]">
                          {mood.type === "video" ? (
                            <video
                              src={mood.mediaUrl}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-110"
                              style={{ backgroundImage: `url(${mood.mediaUrl})` }}
                            />
                          )}
                          {/* Subtle inner gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                        </div>
                        
                        {/* Ring on hover/active */}
                        <div
                          className={`absolute -inset-1.5 rounded-full border border-[#D4AF37] transition-all duration-500 ease-out z-10 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-50 group-active:opacity-100'}`}
                        />
                      </div>

                      {/* Label */}
                      <div 
                        className="flex flex-col items-center gap-1 transition-all duration-500"
                        style={{
                          opacity: isActive ? 1 : 0.4,
                          transform: isActive ? 'translateY(0)' : 'translateY(-4px)'
                        }}
                      >
                        <h3
                          className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#2C1810] uppercase leading-tight transition-colors"
                        >
                          {mood.title.split(" ").map((word: string, idx: number) => (
                            <span key={idx} className="block leading-[1.4]">{word}</span>
                          ))}
                        </h3>
                        <span className={`text-[8px] font-semibold tracking-[0.1em] text-[#D4AF37] uppercase transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          Explore →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scroll hint dots */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {moods.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to mood ${i + 1}`}
                className={`rounded-full transition-all duration-300 ease-out focus:outline-none ${
                  i === activeIndex ? "w-5 h-1 bg-[#D4AF37]" : "w-1.5 h-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
