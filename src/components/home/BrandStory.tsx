"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function BrandStory({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(
    initialData || { mediaUrl: "/images/moments-banner.jpg", type: "image" }
  );

  useEffect(() => {
    if (initialData) return;
    (async () => {
      try {
        const { data: res } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
        if (res?.value?.brand_story) {
          setData(res.value.brand_story);
        }
      } catch {}
    })();
  }, []);

  const bgUrl = data?.mediaUrl || "/images/moments-banner.jpg";
  const isVideo = data?.type === "video";

  return (
    <section
      id="brand-story"
      className="relative w-full overflow-hidden bg-[#1A1310]
        h-[70vh] min-h-[520px]
        md:h-[80vh] md:min-h-[600px] md:max-h-[900px]
        flex items-center justify-center"
    >
      {/* Background media */}
      {isVideo ? (
        <video
          src={bgUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
      )}

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-[#1A1310]/45" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#1A1310]/60 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-[#1A1310]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-[700px] mx-auto"
        >
          {/* Gold label */}
          <span className="font-sans text-[10px] md:text-[11px] font-semibold tracking-[0.3em] uppercase text-[#C9A962] mb-5 md:mb-7">
            THE ART OF LUXURY
          </span>

          {/* Thin gold rule */}
          <div className="w-8 h-px bg-[#C9A962]/60 mb-5 md:mb-7" />

          {/* Headline */}
          <h2 className="font-serif text-[34px] md:text-[52px] lg:text-[60px] leading-[1.08] text-white mb-6 md:mb-8">
            CURATED FOR<br className="hidden md:block" /> THE WAY YOU LIVE.
          </h2>

          {/* Body */}
          <p className="font-sans text-[13px] md:text-[15px] text-white/75 font-light leading-[1.8] max-w-[480px] mb-9 md:mb-11">
            Hanger brings together contemporary Indian fashion, handpicked pieces and thoughtfully selected details — designed to move effortlessly from everyday moments to celebrations.
          </p>

          {/* CTA */}
          <Link
            href="/about"
            id="brand-story-cta"
            className="
              inline-flex items-center justify-center gap-3
              bg-white text-[#1A1A1A]
              px-9 py-[13px]
              font-sans text-[10.5px] font-bold tracking-[0.22em] uppercase
              hover:bg-[#C9A962] hover:text-white
              transition-all duration-400
            "
          >
            OUR STORY
            {/* thin diamond accent */}
            <span className="w-[5px] h-[5px] bg-current rotate-45 inline-block shrink-0 opacity-70" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
