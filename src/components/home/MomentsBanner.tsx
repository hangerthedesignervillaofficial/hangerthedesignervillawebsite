"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function MomentsBanner({ initialData }: { initialData?: any }) {

  const [settings, setSettings] = useState({
    subtitle: "MOMENTS",
    title: "OCCASIONS"
  });
  const [media, setMedia] = useState<any>(initialData || null);

  useEffect(() => {
    if (initialData) return;
    async function fetchSettings() {
      try {
        const { data: generalData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "general_settings")
          .single();
          
        if (generalData && generalData.value) {
          setSettings({
            subtitle: generalData.value.moments_subtitle || "MOMENTS",
            title: generalData.value.moments_title || "OCCASIONS"
          });
        }

        const { data: mediaData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
          
        if (mediaData && mediaData.value?.moments) {
          setMedia(mediaData.value.moments);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="w-full bg-[#1A0A0E] overflow-hidden">
      <div className="flex flex-row w-full min-h-[220px] sm:min-h-[280px] md:min-h-[380px]">
        
        {/* Left Side: Maroon Text Block */}
        <div className="w-[65%] md:w-[60%] p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h2 className="font-serif text-[18px] sm:text-2xl md:text-[36px] lg:text-[44px] font-normal leading-[1.15] text-white uppercase mb-2 md:mb-3 drop-shadow-md">
              MADE FOR THE<br />{settings.title} THAT MATTER
            </h2>
            <p className="block font-sans text-[9px] sm:text-[10px] md:text-xs font-light text-gray-300/80 tracking-wide mb-4 md:mb-8 max-w-xs md:max-w-md leading-relaxed">
              Fine crafting. Elegance to unforgettable occasions.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-[#2C1810] to-[#4A0E17] hover:from-[#3A141A] hover:to-[#5A121E] text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] py-3 px-5 md:py-3.5 md:px-8 font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-md shadow-[#D4AF37]/10"
            >
              DISCOVER THE COLLECTION
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Portrait Image of the Model with Hover Zoom */}
        <div className="w-[35%] md:w-[40%] overflow-hidden relative group/image">
          {media?.type === 'video' ? (
            <video 
              src={media.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-105"
            />
          ) : (
            <motion.div 
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-105"
              style={{ backgroundImage: `url('${media?.mediaUrl || "/images/moments-banner.jpg"}')` }}
            />
          )}
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover/image:bg-black/5" />
        </div>

      </div>
    </section>
  );
}
