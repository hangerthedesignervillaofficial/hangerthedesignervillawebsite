"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const DEFAULT_POSTS = [
  { id: "p1", mediaUrl: "/images/instagram/instagram1.jpg", type: "image", link: "https://www.instagram.com/hanger_thedesignervilla" },
  { id: "p2", mediaUrl: "/images/instagram/instagram2.jpg", type: "image", link: "https://www.instagram.com/hanger_thedesignervilla" },
  { id: "p3", mediaUrl: "/images/instagram/instagram3.jpg", type: "image", link: "https://www.instagram.com/hanger_thedesignervilla" },
  { id: "p4", mediaUrl: "/images/instagram/instagram4.jpg", type: "image", link: "https://www.instagram.com/hanger_thedesignervilla" },
];

export function InstagramGrid({ initialData }: { initialData?: any[] }) {
  const [posts, setPosts] = useState<any[]>(
    initialData?.filter(p => p.mediaUrl).slice(0, 4) ?? DEFAULT_POSTS
  );

  useEffect(() => {
    if (initialData?.length) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings").select("value").eq("key", "homepage_media").single();
        const ig = data?.value?.instagram?.filter((p: any) => p.mediaUrl);
        if (ig?.length) setPosts(ig.slice(0, 4));
      } catch { /* use default */ }
    })();
  }, [initialData]);

  return (
    <section id="instagram" className="bg-[#F9F6F1] py-16 md:py-24">
      <div className="container mx-auto px-5 md:px-10">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-10 md:mb-14"
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] mb-4">
            SOCIAL
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">
            Follow The Story
          </h2>
          <Link
            href="https://www.instagram.com/hanger_thedesignervilla"
            target="_blank"
            rel="noreferrer"
            id="instagram-handle"
            className="
              inline-flex items-center gap-2
              font-sans text-[10.5px] font-bold tracking-[0.2em] uppercase
              border border-[#1A1A1A] text-[#1A1A1A]
              px-7 py-3
              hover:bg-[#1A1A1A] hover:text-[#F9F6F1]
              transition-all duration-300
            "
          >
            {/* Instagram icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @hanger_thedesignervilla
          </Link>
        </motion.div>

        {/* ── 2×2 GRID ── */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-4xl mx-auto">
          {posts.slice(0, 4).map((post, i) => (
            <motion.div
              key={post.id ?? i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={post.link ?? "https://www.instagram.com/hanger_thedesignervilla"}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden bg-[#EDE3D7] border border-[#C9A962]/15 hover:border-[#C9A962]/45 transition-colors shadow-sm hover:shadow-md"
              >
                {/\.(mp4|webm)$/i.test(post.mediaUrl ?? "") ? (
                  <video src={post.mediaUrl} autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.mediaUrl})` }}
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                  <div className="absolute inset-3 border border-[#C9A962]/50 scale-95 group-hover:scale-100 transition-transform duration-600 pointer-events-none" />
                  <svg className="w-8 h-8 text-[#C9A962] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 delay-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
