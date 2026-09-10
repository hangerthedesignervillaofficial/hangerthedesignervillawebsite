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

        {/* Mobile Layout: Stacked Tall Cards */}
        <div className="flex md:hidden flex-col gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden aspect-[4/5] shadow-md border border-[#D4AF37]/15"
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
              <div className="absolute inset-0 bg-black/45" />
              
              {/* Inner thin gold border */}
              <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none" />

              {/* Text Center-Aligned for Luxury Feel */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] mb-3 uppercase">
                  {cat.title === "CLOTHING" ? "DESIGNER WEAR" : cat.title === "JEWELLERY" ? "ROYAL ORNAMENTS" : "LUXURY FOOTWEAR"}
                </span>
                <h3 className="font-serif text-3xl font-normal tracking-[0.2em] text-white uppercase mb-3 leading-tight" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  {cat.title}
                </h3>
                <p className="font-sans text-[10px] text-gray-300 tracking-[0.15em] font-light max-w-[200px] mb-8 leading-relaxed uppercase">
                  {cat.subtitle}
                </p>
                <Link 
                  href={cat.link}
                  className="font-sans text-[9px] font-bold tracking-[0.2em] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0A0E] text-white px-6 py-3 transition-all duration-300 uppercase cursor-pointer"
                >
                  SHOP NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
