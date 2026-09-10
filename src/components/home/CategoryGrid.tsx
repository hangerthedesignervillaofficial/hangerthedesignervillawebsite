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
    <section className="pt-8 pb-4 md:pt-14 md:pb-8 bg-[#FDFBF7]">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
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
                className="group relative block w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#f4f0ea]"
              >
                {/* Background Media */}
                {category.type === 'video' ? (
                  <video src={category.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.mediaUrl})` }}
                  />
                )}
                
                {/* Inner gold frame overlay on hover */}
                <div className="absolute inset-3 sm:inset-4 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
