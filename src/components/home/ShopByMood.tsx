"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const moods = [
  { title: "EVERYDAY EDIT", image: "/images/clothing.jpg", href: "/clothing" },
  { title: "FESTIVE EDIT", image: "/images/moments-banner.jpg", href: "/jewellery" },
  { title: "OCCASION EDIT", image: "/images/curated-couch.jpg", href: "/clothing" },
  { title: "STATEMENT EDIT", image: "/images/hero-banner.jpg", href: "/jewellery" },
];

export function ShopByMood() {
  return (
    <section className="pt-6 pb-2 md:pt-12 md:pb-4 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 md:mb-10 text-left border-b border-[#D4AF37]/15 pb-4"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.15em] text-[#2C1810] uppercase mb-1">
              SHOP BY MOOD
            </h2>
            <p className="font-sans text-[10px] md:text-xs font-medium tracking-wider text-[#7A6B5D] uppercase">
              Find your vibe. Shop your moment.
            </p>
          </motion.div>
 
          <div className="grid grid-cols-4 gap-6 lg:gap-8">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={mood.href}
                  className="group relative block w-full aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm border border-[#D4AF37]/15"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${mood.image})` }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                  
                  {/* Gold border frame overlay on hover */}
                  <div className="absolute inset-3.5 border border-[#D4AF37]/35 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none" />
 
                  {/* Text Overlay - Bottom Left */}
                  <div className="absolute bottom-6 left-6 z-10 transition-transform duration-350 group-hover:translate-x-1">
                    <span className="font-sans text-[8px] font-semibold tracking-[0.2em] text-[#D4AF37] mb-1.5 uppercase block">
                      CURATED EDIT
                    </span>
                    <h3 className="font-serif text-sm lg:text-base font-normal tracking-[0.1em] text-white uppercase mb-1.5 leading-none" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                      {mood.title}
                    </h3>
                    <span className="font-sans text-[8.5px] tracking-[0.1em] text-gray-300 font-semibold flex items-center gap-0.5 group-hover:text-[#D4AF37] transition-colors">
                      EXPLORE NOW <span className="text-[10px] transition-transform duration-350 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
 
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 border-b border-[#D4AF37]/15 pb-3"
          >
            <h2 className="font-serif text-xl font-light tracking-[0.15em] text-[#2C1810] uppercase mb-1">
              SHOP BY MOOD
            </h2>
            <p className="font-sans text-[9px] font-medium tracking-wider text-[#7A6B5D] uppercase">
              Find your vibe. Shop your moment.
            </p>
          </motion.div>
 
          {/* Premium Horizontal Scroll container with negative margin for full-bleed look */}
          <div className="flex overflow-x-auto gap-5 xs:gap-6 no-scrollbar pb-6 pt-2 -mx-4 px-4 scroll-smooth">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex-shrink-0 flex justify-center w-[115px] xs:w-[125px]"
              >
                <Link
                  href={mood.href}
                  className="group flex flex-col items-center text-center gap-3 w-full"
                >
                  {/* Circular image - Big, premium and detailed */}
                  <div className="relative w-[105px] h-[105px] xs:w-[115px] xs:h-[115px] rounded-full overflow-hidden bg-gray-50 border border-[#D4AF37]/25 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#D4AF37] group-hover:ring-offset-2">
                    <div
                      className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${mood.image})` }}
                    />
                  </div>
                  {/* Text under the circle */}
                  <h3 className="font-sans text-[9px] xs:text-[10px] font-bold tracking-[0.1em] text-[#2C1810] uppercase leading-tight group-hover:text-[#4A0E17] transition-colors">
                    {mood.title.split(" ").map((word, idx) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
