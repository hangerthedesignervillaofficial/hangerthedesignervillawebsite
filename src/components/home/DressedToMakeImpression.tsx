"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function DressedToMakeImpression() {
  return (
    <section className="pt-8 pb-10 md:pt-14 md:pb-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:grid grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading & Description */}
          <div className="col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="font-sans text-[8.5px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase block">
                THE HANGER SPIRIT
              </span>
              <h2 className="font-serif text-[36px] lg:text-[44px] font-normal leading-[1.1] text-[#2C1810] tracking-wide uppercase" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                DRESSED TO MAKE<br />AN IMPRESSION.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <p className="font-sans text-[12px] lg:text-[13px] font-light leading-relaxed text-[#7A6B5D] max-w-xl">
                At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-sans text-[9px] font-bold tracking-[0.2em] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0A0E] text-[#2C1810] px-6 py-3 transition-all duration-300 uppercase cursor-pointer"
                >
                  OUR STORY <span className="text-xs">✦</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Framed Editorial Image */}
          <div className="col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full h-[320px] lg:h-[360px] border-2 border-[#D4AF37]/25 p-2 overflow-hidden bg-white shadow-xl shadow-[#D4AF37]/5 group"
            >
              {/* Inner gold frame border */}
              <div className="absolute inset-2 border border-[#D4AF37]/15 pointer-events-none z-10 group-hover:border-[#D4AF37]/35 transition-colors duration-300" />
              
              <div className="w-full h-full relative overflow-hidden bg-gray-100">
                <Image
                  src="/images/jewellery.jpg"
                  alt="Jewelry Detail"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout (sm screens) */}
        <div className="block md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <span className="font-sans text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              THE HANGER SPIRIT
            </span>
            <h2 className="font-serif text-[24px] font-normal leading-tight text-[#2C1810] tracking-wide uppercase" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              DRESSED TO MAKE<br />AN IMPRESSION.
            </h2>

            {/* Framed Editorial Campaign Image */}
            <div className="relative w-full h-[220px] border-2 border-[#D4AF37]/25 p-1.5 overflow-hidden bg-white shadow-md my-2">
              <div className="absolute inset-1.5 border border-[#D4AF37]/10 pointer-events-none z-10" />
              <div className="w-full h-full relative overflow-hidden bg-gray-100">
                <Image
                  src="/images/jewellery.jpg"
                  alt="Jewelry Detail"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed px-2 pt-2">
              At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship for the way you live today.
            </p>
            
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-sans text-[8.5px] font-bold tracking-[0.18em] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-[#1A0A0E] text-[#2C1810] px-5 py-2.5 transition-all duration-300 uppercase cursor-pointer"
              >
                OUR STORY <span>✦</span>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
