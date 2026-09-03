"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function InstagramGrid({ initialData }: { initialData?: any[] }) {
  const defaultItems = [
    { id: 'ig1', mediaUrl: '/images/instagram/instagram1.jpg', type: 'image', link: 'https://instagram.com' },
    { id: 'ig2', mediaUrl: '/images/instagram/instagram2.jpg', type: 'image', link: 'https://instagram.com' },
    { id: 'ig3', mediaUrl: '/images/instagram/instagram3.jpg', type: 'image', link: 'https://instagram.com' },
    { id: 'ig4', mediaUrl: '/images/instagram/instagram4.jpg', type: 'image', link: 'https://instagram.com' },
  ];
  
  const parsedInitial = initialData ? initialData.filter((item: any) => item.mediaUrl).slice(0, 6) : null;
  const [items, setItems] = useState<any[]>(parsedInitial && parsedInitial.length > 0 ? parsedInitial : defaultItems);

  useEffect(() => {
    if (initialData) return;
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();

        if (data && data.value?.instagram) {
          // Filter to only items that have a mediaUrl
          const withMedia = data.value.instagram.filter((item: any) => item.mediaUrl);
          if (withMedia.length > 0) {
            setItems(withMedia.slice(0, 6));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="pt-2 pb-6 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="mb-5 flex justify-between items-end">
          <Link 
            href="https://www.instagram.com/hanger_thedesignervilla" 
            target="_blank" 
            className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-[#2C1810] hover:text-[#D4AF37] transition-colors uppercase"
          >
            @hanger_thedesignervilla
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.slice(0, 4).map((item, idx) => (
            <Link 
              key={item.id || idx} 
              href={item.link || "https://www.instagram.com/hanger_thedesignervilla"} 
              target="_blank"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative aspect-square w-full overflow-hidden bg-[#f4f0ea] group cursor-pointer border border-[#D4AF37]/15 shadow-sm"
              >
                {item.type === 'video' ? (
                  <video 
                    src={item.mediaUrl} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.mediaUrl})` }}
                  />
                )}
                {/* Overlay with black opacity */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {/* Gold inner frame border */}
                  <div className="absolute inset-3 border border-[#D4AF37]/45 scale-95 group-hover:scale-100 transition-transform duration-500 pointer-events-none" />
                  
                  {/* Instagram Icon SVG */}
                  <svg className="h-6 w-6 text-[#D4AF37] scale-75 group-hover:scale-100 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="https://www.instagram.com/hanger_thedesignervilla" target="_blank" className="font-sans text-[9px] font-bold tracking-[0.15em] text-[#2C1810] uppercase flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
            FOLLOW THE STORY <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
