"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types";
import { ArrowRight } from "lucide-react";

interface HangerEditsGridProps {
  products: ProductType[];
}

export function HangerEditsGrid({ products }: HangerEditsGridProps) {
  if (!products || products.length === 0) return null;

  // Take up to 4 products for the grid
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-16 md:py-28 bg-[#FFFCF7] border-y border-[#D4AF37]/12 relative overflow-hidden">
      {/* Decorative soft blobs */}
      <div className="absolute top-0 left-0 w-[45vw] h-[45vw] max-w-[520px] max-h-[520px] bg-[#D4AF37]/4 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] max-w-[420px] max-h-[420px] bg-[#4A0E17]/4 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            {/* Gold ornament */}
            <div className="flex items-center gap-4 mb-5">
              <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[11px]">✦</span>
              <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            <span className="block text-[#D4AF37] text-[9px] font-sans font-bold tracking-[0.35em] uppercase mb-4">
              Curated Selection
            </span>
            <h2
              className="text-[36px] sm:text-5xl md:text-6xl lg:text-[80px] font-serif text-[#2C1810] tracking-wide leading-[1.0] mb-5"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              THE HANGER EDIT
            </h2>
            <div className="w-14 h-[1px] bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30 mx-auto mb-5" />
            <p className="font-sans text-[10px] md:text-[11px] text-[#7A6B5D] max-w-lg mx-auto uppercase tracking-[0.2em] leading-[1.9]">
              An exclusive curation of our most sought-after silhouettes.<br className="hidden md:block" />
              Handpicked for the modern connoisseur.
            </p>
          </motion.div>
        </div>

        {/* Product grid — Ultra Premium Staggered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center mt-12 lg:mt-24">
          {/* Main Large Item (Left) */}
          {displayProducts[0] && (
            <motion.div
              className="md:col-span-7 group relative z-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products/${displayProducts[0].product_id}`}
                className="block relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#1a1a1a] shadow-2xl"
              >
                {displayProducts[0].image && (
                  <Image
                    src={displayProducts[0].image}
                    alt={displayProducts[0].title}
                    fill
                    className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 filter brightness-[0.85] group-hover:brightness-100"
                  />
                )}
                {/* Dark gradient bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Gold frame on hover */}
                <div className="absolute inset-4 lg:inset-6 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-700 pointer-events-none scale-95 group-hover:scale-100" />

                {/* Text at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="font-sans text-[9px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase mb-3">
                    Hero Piece
                  </span>
                  <h3 className="text-white font-serif text-3xl lg:text-5xl tracking-wide mb-4 line-clamp-2 leading-[1.1] drop-shadow-md">
                    {displayProducts[0].title}
                  </h3>
                  <div className="flex items-center gap-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <span className="font-sans text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase">
                      ₹{displayProducts[0].price.toLocaleString("en-IN")}
                    </span>
                    <span className="w-8 h-[1px] bg-[#D4AF37]" />
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 text-white hover:text-[#D4AF37] transition-all duration-300">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Right Column — Staggered Smaller Items */}
          <div className="md:col-span-5 flex flex-col gap-10 lg:gap-16 relative z-10 md:-ml-12 lg:-ml-20 mt-10 md:mt-32">
            {displayProducts.slice(1).map((product, idx) => (
              <motion.div
                key={product.product_id}
                className={`group flex ${idx === 1 ? "flex-row" : "flex-row-reverse md:flex-row"} items-center gap-6 md:gap-8 ${idx === 1 ? "md:ml-12 lg:ml-24" : ""}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/products/${product.product_id}`}
                  className={`w-[55%] md:w-[60%] shrink-0 relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] shadow-lg group-hover:shadow-xl transition-shadow duration-500`}
                >
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </Link>

                <div className={`flex-1 flex flex-col min-w-0 ${idx === 1 ? "text-left items-start" : "text-right items-end md:text-left md:items-start"}`}>
                  <span className="text-[#D4AF37] text-[9px] font-sans font-bold tracking-[0.3em] uppercase mb-2">
                    {idx === 0 ? "Trending" : idx === 1 ? "Signature" : "Classic"}
                  </span>
                  <Link href={`/products/${product.product_id}`}>
                    <h3 className="font-serif text-lg lg:text-xl text-[#2C1810] tracking-wide mb-3 hover:text-[#D4AF37] transition-colors line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="font-sans text-[11px] font-semibold text-[#7A6B5D] tracking-[0.15em] mb-4">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <Link
                    href={`/products/${product.product_id}`}
                    className="w-8 h-8 rounded-full border border-[#2C1810] flex items-center justify-center text-[#2C1810] group-hover:bg-[#2C1810] group-hover:text-[#D4AF37] transition-all duration-300"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 md:mt-20 flex justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/products"
            className="btn-shine group inline-flex items-center gap-3 border border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810] hover:text-[#D4AF37] px-10 py-4 font-sans text-[10px] font-bold tracking-[0.28em] uppercase transition-all duration-400 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            View Full Edit
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
