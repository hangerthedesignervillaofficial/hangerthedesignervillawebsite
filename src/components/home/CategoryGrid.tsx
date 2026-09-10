"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const DEFAULT_CATEGORIES = [
  { title: "JEWELLERY", subtitle: "Handcrafted gold & gems", mediaUrl: "/images/jewellery.jpg", link: "/jewellery", type: "image" },
  { title: "FOOTWEAR",  subtitle: "Walk in elegance",       mediaUrl: "/images/footwear.jpg",  link: "/footwear",  type: "image" },
  { title: "CLOTHING",  subtitle: "Timeless Indian fashion", mediaUrl: "/images/clothing.jpg",  link: "/clothing",  type: "image" },
];

export function CategoryGrid({ initialCategories }: { initialCategories?: any[] }) {
  const [cats, setCats] = useState<any[]>(initialCategories?.length ? initialCategories.slice(0, 3) : DEFAULT_CATEGORIES);

  useEffect(() => {
    if (initialCategories?.length) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings").select("value").eq("key", "homepage_media").single();
        if (data?.value?.category_grid?.length) {
          setCats(data.value.category_grid.slice(0, 3));
        }
      } catch { /* use default */ }
    })();
  }, [initialCategories]);

  return (
    <section id="categories" className="bg-[#F9F6F1] py-16 md:py-24">
      {/* Section header */}
      <div className="container mx-auto px-5 md:px-10 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] mb-3">
            SHOP BY CATEGORY
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">
            Explore Our World
          </h2>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-5 md:px-10">
        {/* Mobile: horizontal scroll, Desktop: 3-column grid */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2
                        md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 w-[78vw] snap-start md:w-auto md:shrink"
            >
              <Link
                href={cat.link}
                id={`category-${cat.title.toLowerCase()}`}
                className="group relative block w-full aspect-[3/4] overflow-hidden
                           border border-[#C9A962]/20 hover:border-[#C9A962]/55
                           transition-all duration-500 bg-[#EDE3D7] shadow-sm hover:shadow-lg"
              >
                {/* Media */}
                {cat.type === "video" || /\.(mp4|webm)$/i.test(cat.mediaUrl ?? "") ? (
                  <video src={cat.mediaUrl} autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.2s] ease-out group-hover:scale-107" />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[2.2s] ease-out group-hover:scale-107"
                    style={{ backgroundImage: `url(${cat.mediaUrl})` }}
                  />
                )}

                {/* Permanent soft bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                {/* Inner gold frame — visible on hover */}
                <div className="absolute inset-4 border border-[#C9A962]/0 group-hover:border-[#C9A962]/45 transition-all duration-700 pointer-events-none" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col items-center text-center gap-3">
                  {cat.subtitle && (
                    <p className="font-sans text-[9.5px] font-medium tracking-[0.22em] uppercase text-white/70 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {cat.subtitle}
                    </p>
                  )}
                  <h3 className="font-serif text-[26px] md:text-[28px] leading-tight text-white tracking-wide
                                 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.title}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-white/90 border-b border-white/40 pb-px">
                      SHOP NOW
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
