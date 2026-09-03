"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function DressedToMakeImpression({ initialData }: { initialData?: any }) {

  const [settings, setSettings] = useState({
    subtitle: "EDITORIAL",
    title: "DRESSED TO MAKE\nAN IMPRESSION.",
    desc: "Discover our latest collection of premium clothing."
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
            subtitle: generalData.value.dressed_subtitle || "EDITORIAL",
            title: generalData.value.dressed_title || "DRESSED TO MAKE\nAN IMPRESSION.",
            desc: generalData.value.dressed_desc || "Discover our latest collection of premium clothing."
          });
        }

        const { data: mediaData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
          
        if (mediaData && mediaData.value) {
          setMedia({
            portrait: mediaData.value.impression_portrait,
            landscape: mediaData.value.impression_landscape
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="pt-8 pb-10 md:pt-14 md:pb-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:flex relative items-center justify-center min-h-[500px] lg:min-h-[600px] py-12">
          
          {/* Background subtle elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <h1 className="text-[12rem] lg:text-[18rem] font-serif text-[#D4AF37]/10 tracking-widest whitespace-nowrap select-none">HANGER</h1>
          </div>

          <div className="w-full max-w-6xl mx-auto flex items-center relative z-10">
            {/* Left side text block that overlaps the image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-[45%] bg-white/90 backdrop-blur-md p-10 lg:p-16 border-l-2 border-t-2 border-[#D4AF37]/30 shadow-2xl relative z-20 translate-x-12 lg:translate-x-24"
            >
              <div className="space-y-4">
                <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase">
                  {settings.subtitle}
                </span>
                <h2 className="font-serif text-[40px] lg:text-[52px] font-normal leading-[1.05] text-[#1a1a1a] tracking-wide uppercase">
                  {settings.title.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <div className="w-12 h-[2px] bg-[#D4AF37] my-6" />
                <p className="font-sans text-[13px] lg:text-[14px] font-light leading-relaxed text-[#5a5a5a] max-w-md">
                  {settings.desc}
                </p>
                <div className="pt-6">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.25em] bg-[#1a1a1a] text-white hover:bg-[#D4AF37] px-8 py-4 transition-all duration-300 uppercase cursor-pointer"
                  >
                    Explore <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right side large framed image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-[55%] relative h-[450px] lg:h-[550px] overflow-hidden group shadow-xl"
            >
              {media?.portrait?.type === 'video' ? (
                <video src={media.portrait.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
              ) : (
                <Image 
                  src={media?.portrait?.mediaUrl || "/images/jewellery.jpg"} 
                  alt="Editorial Look" 
                  fill 
                  className="object-cover object-top transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                />
              )}
              {/* Inner gold frame overlay */}
              <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none z-10 transition-colors duration-500 group-hover:border-[#D4AF37]/70" />
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout (sm screens) */}
        <div className="block md:hidden relative w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full relative h-[75vh] min-h-[500px]"
          >
            {media?.portrait?.type === 'video' ? (
              <video src={media.portrait.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <Image 
                src={media?.portrait?.mediaUrl || "/images/jewellery.jpg"} 
                alt="Editorial Look" 
                fill 
                className="object-cover object-center" 
                sizes="100vw"
                priority
              />
            )}
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Inner frame */}
            <div className="absolute inset-3 border border-[#D4AF37]/40 pointer-events-none z-10" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
                {settings.subtitle}
              </span>
              <h2 className="font-serif text-[32px] font-normal leading-[1.1] text-white tracking-wide uppercase mb-4" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                {settings.title.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <div className="w-8 h-[2px] bg-[#D4AF37] mb-4" />
              <p className="font-sans text-[12px] text-white/80 leading-relaxed max-w-[280px] mb-6">
                {settings.desc}
              </p>
              
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 font-sans text-[10px] font-bold tracking-[0.2em] bg-white text-[#1a1a1a] px-8 py-3.5 uppercase w-full"
                >
                  Explore <span className="text-[#D4AF37]">✦</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
