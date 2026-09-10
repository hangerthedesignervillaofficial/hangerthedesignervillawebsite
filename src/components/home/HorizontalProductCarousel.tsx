"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductType } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  title: string;
  subtitle?: string;
  products: ProductType[];
  badge?: "NEW ARRIVAL" | "BESTSELLER";
}

export function HorizontalProductCarousel({ title, subtitle, products, badge }: Props) {
  if (!products?.length) return null;

  const derivedBadge: "NEW ARRIVAL" | "BESTSELLER" =
    badge ?? (title.toUpperCase().includes("ARRIVAL") ? "NEW ARRIVAL" : "BESTSELLER");

  return (
    <section className="bg-[#F9F6F1] py-16 md:py-24">
      <div className="container mx-auto px-5 md:px-10">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          {subtitle && (
            <span className="font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">
            {title}
          </h2>
          {/* Thin gold rule */}
          <div className="w-10 h-px bg-[#C9A962]/60 mb-6" />
          <Link
            href="/products"
            className="font-sans text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#C9A962] hover:text-[#1A1A1A] transition-colors pb-px border-b border-[#C9A962]/40 hover:border-[#1A1A1A]/40"
          >
            VIEW ALL
          </Link>
        </motion.div>

        {/* ── PRODUCT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
          {products.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
            >
              <ProductCard product={product} badge={derivedBadge} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
