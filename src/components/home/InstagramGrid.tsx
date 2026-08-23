"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const images = [
  "/images/instagram/instagram1.jpg",
  "/images/instagram/instagram2.jpg",
  "/images/instagram/instagram3.jpg",
  "/images/instagram/instagram4.jpg",
  "/images/instagram/instagram5.jpg",
  "/images/instagram/instagram6.jpg",
];

export function InstagramGrid() {
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
          {images.slice(0, 4).map((img, idx) => (
            <Link 
              key={idx} 
              href="https://www.instagram.com/hanger_thedesignervilla" 
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
                <Image
                  src={img}
                  alt="Instagram Feed"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
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
