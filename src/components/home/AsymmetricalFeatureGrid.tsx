"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function AsymmetricalFeatureGrid({ initialData }: { initialData?: any[] }) {
  const [categories, setCategories] = useState<any[]>(initialData || [
    { title: "CLOTHING", subtitle: "CONTEMPORARY INDIAN SILHOUETTES", mediaUrl: "/images/clothing.jpg", link: "/clothing", type: "image" },
    { title: "JEWELLERY", subtitle: "MAKE THE DETAIL COUNT", mediaUrl: "/images/jewellery.jpg", link: "/jewellery", type: "image" },
    { title: "FOOTWEAR", subtitle: "STEP INTO SOMETHING EXTRAORDINARY", mediaUrl: "/images/footwear.jpg", link: "/footwear", type: "image" }
  ]);

  useEffect(() => {
    if (initialData) return;
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
          
        if (data && data.value?.asymmetrical) {
          setCategories(data.value.asymmetrical);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Desktop Layout: 3 Column Premium Banner Cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden h-[460px] lg:h-[500px] shadow-md border border-[#D4AF37]/15"
            >
              {/* Background Media */}
              {cat.type === 'video' ? (
                <video src={cat.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.mediaUrl})` }}
                />
              )}
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors duration-300" />
              
              {/* Gold border frame overlay inside */}
              <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none group-hover:border-[#D4AF37]/45 transition-colors duration-300" />

              {/* Text Center Box */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                <span className="font-sans text-[10px] font-semibold tracking-[0.25em] text-[#D4AF37] mb-3 uppercase">
                  {cat.title === "CLOTHING" ? "DESIGNER WEAR" : cat.title === "JEWELLERY" ? "ROYAL ORNAMENTS" : "LUXURY FOOTWEAR"}
                </span>
                <h3 className="font-serif text-3xl lg:text-4xl font-normal tracking-[0.15em] text-white uppercase mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  {cat.title}
                </h3>
                <p className="font-sans text-[10px] lg:text-[11px] text-gray-300 tracking-wider font-light max-w-[200px] mb-8 leading-relaxed">
                  {cat.subtitle}
                </p>
                <Link 
                  href={cat.link}
                  className="font-sans text-[9px] font-bold tracking-[0.2em] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0A0E] text-white px-5 py-2.5 transition-all duration-300 uppercase cursor-pointer"
                >
                  SHOP NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Layout: Editorial Overlapping Magazine Style */}
        <div className="flex md:hidden flex-col gap-12 pt-4 pb-8">
          {categories.map((cat, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-col"
              >
                {/* Image Section */}
                <div className={`relative w-[85%] aspect-[4/5] shadow-sm border border-[#D4AF37]/15 overflow-hidden ${isEven ? 'self-start' : 'self-end'}`}>
                  {cat.type === 'video' ? (
                    <video src={cat.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${cat.mediaUrl})` }}
                    />
                  )}
                  {/* Subtle inner gold border */}
                  <div className="absolute inset-2 border border-[#D4AF37]/20 pointer-events-none" />
                </div>

                {/* Overlapping Text Card */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-[70%] bg-[#FDFBF7]/95 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(44,24,16,0.08)] border border-[#D4AF37]/20 ${
                    isEven ? 'right-0 text-right items-end' : 'left-0 text-left items-start'
                  } flex flex-col`}
                >
                  <span className="font-sans text-[7px] font-bold tracking-[0.25em] text-[#D4AF37] mb-1.5 uppercase">
                    {cat.title === "CLOTHING" ? "DESIGNER WEAR" : cat.title === "JEWELLERY" ? "ROYAL ORNAMENTS" : "LUXURY FOOTWEAR"}
                  </span>
                  <h3 className="font-serif text-[17px] font-normal tracking-[0.12em] text-[#2C1810] uppercase mb-3 leading-tight" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                    {cat.title}
                  </h3>
                  <Link 
                    href={cat.link}
                    className="font-sans text-[8px] font-bold tracking-[0.18em] text-[#2C1810] uppercase flex items-center gap-1.5 group"
                  >
                    <span className="border-b border-[#D4AF37]/40 pb-0.5 group-hover:border-[#D4AF37]">SHOP NOW</span>
                    <span className="text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
