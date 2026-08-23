"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function MomentsBanner() {
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
            <h2 className="font-serif text-[16px] sm:text-2xl md:text-[36px] lg:text-[44px] font-normal leading-[1.15] text-white uppercase mb-1 md:mb-3">
              MADE FOR THE<br />MOMENTS THAT MATTER
            </h2>
            <p className="hidden md:block font-sans text-[8px] sm:text-[10px] md:text-xs font-light text-gray-300/80 tracking-wide mb-4 md:mb-8 max-w-xs md:max-w-md leading-relaxed">
              Fine crafting. Elegance to unforgettable occasions.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-[#2C1810] to-[#4A0E17] hover:from-[#4A0E17] hover:to-[#6B1A24] text-[#D4AF37] border border-[#D4AF37]/25 py-2.5 px-5 md:py-3.5 md:px-8 font-sans text-[7.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-[#D4AF37]/5"
            >
              DISCOVER THE COLLECTION
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Portrait Image of the Model with Hover Zoom */}
        <div className="w-[35%] md:w-[40%] overflow-hidden relative group/image">
          <motion.div 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/image:scale-108"
            style={{ backgroundImage: "url('/images/moments-banner.jpg')" }}
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover/image:bg-black/5" />
        </div>

      </div>
    </section>
  );
}
