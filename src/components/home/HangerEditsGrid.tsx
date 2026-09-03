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

        {/* Product grid — large + right column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 lg:gap-10 items-start">
          {/* Main Large Item (Left) */}
          {displayProducts[0] && (
            <motion.div
              className="md:col-span-6 lg:col-span-7 group"
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products/${displayProducts[0].product_id}`}
                className="block relative aspect-[4/5] overflow-hidden bg-[#f4f0ea]"
              >
                {displayProducts[0].image && (
                  <Image
                    src={displayProducts[0].image}
                    alt={displayProducts[0].title}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                )}
                {/* Dark gradient bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Gold frame on hover */}
                <div className="absolute inset-4 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700 pointer-events-none" />

                {/* Text at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
                    Featured Piece
                  </span>
                  <h3 className="text-white font-serif text-2xl md:text-3xl tracking-wide mb-3 line-clamp-1 leading-tight">
                    {displayProducts[0].title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="font-sans text-xs font-semibold tracking-[0.15em] uppercase">
                      ₹{displayProducts[0].price.toLocaleString("en-IN")}
                    </span>
                    <span className="w-5 h-[1px] bg-white/40" />
                    <span className="font-sans text-[10px] tracking-[0.15em] uppercase flex items-center gap-1.5 text-[#D4AF37] group-hover:gap-2.5 transition-all duration-300">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Right Column — 3 items */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-5 md:gap-7">
            {displayProducts.slice(1).map((product, idx) => (
              <motion.div
                key={product.product_id}
                className={`group flex ${idx === 1 ? "flex-row-reverse" : "flex-row"} items-center gap-5 md:gap-6`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/products/${product.product_id}`}
                  className="w-[48%] shrink-0 relative aspect-[3/4] overflow-hidden bg-[#f4f0ea]"
                >
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </Link>

                <div className={`flex-1 flex flex-col min-w-0 ${idx === 1 ? "text-right items-end" : "text-left items-start"}`}>
                  <span className="text-[#D4AF37] text-[8px] font-sans font-bold tracking-[0.25em] uppercase mb-2">
                    {idx === 0 ? "Trending" : idx === 1 ? "Signature" : "New Classic"}
                  </span>
                  <Link href={`/products/${product.product_id}`}>
                    <h3 className="font-serif text-base lg:text-lg text-[#2C1810] tracking-wide mb-2 hover:text-[#4A0E17] transition-colors line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="font-sans text-xs font-semibold text-[#7A6B5D] tracking-wider mb-4">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <Link
                    href={`/products/${product.product_id}`}
                    className={`text-[9px] uppercase tracking-[0.2em] font-bold text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-2 group/link`}
                  >
                    {idx === 1 && <span className="w-4 h-[1px] bg-current transition-all duration-300 group-hover/link:w-6" />}
                    Shop Now
                    {idx !== 1 && <span className="w-4 h-[1px] bg-current transition-all duration-300 group-hover/link:w-6" />}
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
