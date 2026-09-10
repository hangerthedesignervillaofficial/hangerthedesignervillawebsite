"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";

interface HorizontalProductCarouselProps {
  title: string;
  subtitle?: string;
  products: ProductType[];
}

export function HorizontalProductCarousel({ title, subtitle, products }: HorizontalProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: false,
    dragFree: true,
  });
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) return null;

  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-16 overflow-hidden bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/15 pb-4 mb-8 md:mb-10"
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-2xl md:text-[32px] font-normal tracking-[0.2em] text-[#2C1810] uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase">
                {subtitle}
              </p>
            )}
          </div>
          
          <Link href="/products" className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase hover:text-[#4A0E17] transition-colors hover-gold-underline-center pb-1 self-start md:self-auto">
            VIEW ALL
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="embla relative" 
        >
          <div className="embla__viewport overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="embla__container flex gap-4 md:gap-6">
              {products.map((product, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  key={product.product_id} 
                  className="embla__slide flex-[0_0_48%] sm:flex-[0_0_45%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0"
                >
                  <ProductCard product={product} badge={title.includes("ARRIVALS") ? "NEW" : "BESTSELLER"} />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Subtle Navigation Arrows */}
          <div className="hidden md:block absolute top-1/2 -left-4 -translate-y-1/2">
            <button onClick={scrollPrev} disabled={prevBtnDisabled} className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#7A6B5D] disabled:opacity-0 transition-opacity">
              <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
          <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2">
            <button onClick={scrollNext} disabled={nextBtnDisabled} className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#7A6B5D] disabled:opacity-0 transition-opacity">
              <ChevronRight className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
