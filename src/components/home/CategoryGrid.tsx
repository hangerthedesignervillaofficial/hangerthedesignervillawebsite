"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function CategoryGrid({ initialCategories }: { initialCategories?: any[] }) {
  const [categories, setCategories] = useState<any[]>(initialCategories || [
    { title: "CLOTHING", mediaUrl: "/images/clothing.jpg", link: "/clothing", type: "image" },
    { title: "FOOTWEAR", mediaUrl: "/images/footwear.jpg", link: "/footwear", type: "image" },
    { title: "JEWELLERY", mediaUrl: "/images/jewellery.jpg", link: "/jewellery", type: "image" },
    { title: "ACCESSORIES", mediaUrl: "/images/accessories.jpg", link: "/accessories", type: "image" },
  ]);

  useEffect(() => {
    if (initialCategories) return;
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
          
        if (data && data.value?.category_grid) {
          setCategories(data.value.category_grid);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="pt-10 pb-6 md:pt-14 md:pb-8 bg-[#FDFBF7]">
      <div className="container mx-auto px-0 md:px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-[4px] sm:gap-2 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="col-span-1"
            >
              <Link
                href={category.link}
                className="group relative block w-full aspect-square md:aspect-[3/2] overflow-hidden bg-gray-100"
              >
                {/* Background Media */}
                {category.type === 'video' ? (
                  <video src={category.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.mediaUrl})` }}
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Inner gold frame overlay on hover */}
                <div className="absolute inset-4 border border-[#D4AF37]/30 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none" />

                {/* Text Overlay - Centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-[0.25em] text-white uppercase mb-2 md:mb-3" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                    {category.title}
                  </h3>
                  <div className="overflow-hidden">
                    <span className="block font-sans text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-white/90 uppercase border-b border-white/40 pb-1 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/60 transition-colors duration-500 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      DISCOVER NOW
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
