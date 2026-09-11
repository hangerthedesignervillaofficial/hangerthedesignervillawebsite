"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const HANGER_IG = "https://www.instagram.com/hanger_thedesignervilla";

export function InstagramGrid({ initialData }: { initialData?: any[] }) {
  const defaultItems = [
    { id: "ig1", mediaUrl: "/images/instagram/instagram1.jpg", type: "image", link: HANGER_IG },
    { id: "ig2", mediaUrl: "/images/instagram/instagram2.jpg", type: "image", link: HANGER_IG },
    { id: "ig3", mediaUrl: "/images/instagram/instagram3.jpg", type: "image", link: HANGER_IG },
    { id: "ig4", mediaUrl: "/images/instagram/instagram4.jpg", type: "image", link: HANGER_IG },
  ];

  const parsedInitial = initialData
    ? initialData
        .filter((item: any) => item.mediaUrl)
        .map((item: any) => ({
          ...item,
          // Ensure link always defaults to Hanger's IG if not explicitly set
          link: item.link && item.link !== "https://instagram.com" ? item.link : HANGER_IG,
        }))
        .slice(0, 6)
    : null;

  const [items, setItems] = useState<any[]>(
    parsedInitial && parsedInitial.length > 0 ? parsedInitial : defaultItems
  );

  useEffect(() => {
    if (initialData) return;
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();

        if (data?.value?.instagram) {
          const withMedia = data.value.instagram
            .filter((item: any) => item.mediaUrl)
            .map((item: any) => ({
              ...item,
              link: item.link && item.link !== "https://instagram.com" ? item.link : HANGER_IG,
            }));
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase mb-4">
            SOCIAL
          </span>
          <h2
            className="font-serif text-3xl md:text-4xl text-[#1a1a1a] tracking-wide mb-6"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            FOLLOW THE STORY
          </h2>
          <Link
            href={HANGER_IG}
            target="_blank"
            className="inline-flex items-center justify-center gap-3 font-sans text-[9px] font-bold tracking-[0.25em] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] px-8 py-3.5 uppercase transition-all duration-300"
          >
            @hanger_thedesignervilla
          </Link>
        </div>

        {/* Grid — up to 4 items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
          {items.slice(0, 4).map((item, idx) => (
            <Link
              key={item.id || idx}
              href={item.link || HANGER_IG}
              target="_blank"
              rel="noopener noreferrer"
              className="block group overflow-hidden relative aspect-[4/5] bg-[#1a1a1a]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="w-full h-full"
              >
                {item.type === "video" ? (
                  <video
                    src={item.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                  />
                ) : (
                  <Image
                    src={item.mediaUrl}
                    alt={`Instagram post ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                  />
                )}

                {/* Luxury Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="absolute inset-4 border border-[#D4AF37]/50 scale-95 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />

                  {/* Instagram Logo */}
                  <svg
                    className="h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform duration-700 delay-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
