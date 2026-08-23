"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CategoryGrid() {
  const categories = [
    { title: "CLOTHING", image: "/images/clothing.jpg", href: "/clothing" },
    { title: "FOOTWEAR", image: "/images/footwear.jpg", href: "/footwear" },
    { title: "JEWELLERY", image: "/images/jewellery.jpg", href: "/jewellery" },
    { title: "ACCESSORIES", image: "/images/accessories.jpg", href: "/accessories" },
  ];

  return (
    <section className="pt-10 pb-6 md:pt-14 md:pb-8 bg-[#FDFBF7]">
      <div className="container mx-auto px-0 md:px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-[3px] md:gap-6">
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
                href={category.href}
                className="group relative block w-full aspect-square md:aspect-[3/2] overflow-hidden bg-gray-100"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Inner gold frame overlay on hover */}
                <div className="absolute inset-4 border border-[#D4AF37]/30 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none" />

                {/* Text Overlay - Top Left */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                  <h3 className="font-serif text-base sm:text-xl md:text-2xl lg:text-3xl font-normal tracking-[0.15em] text-white uppercase mb-1" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                    {category.title}
                  </h3>
                  <span className="font-sans text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    EXPLORE <span className="text-xs sm:text-sm">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
