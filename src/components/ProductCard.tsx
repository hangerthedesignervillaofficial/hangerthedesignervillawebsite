"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ProductType } from "@/types";
import { useState } from "react";
import { motion } from "motion/react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: ProductType;
  badge?: "NEW" | "BESTSELLER" | "OUT OF STOCK";
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isWishlisted = isInWishlist(product.product_id);

  // Simulate 3 color dots for the UI based on product ID
  const colors = [
    ["#E3DAC9", "#4A0E17", "#1A0A0E"],
    ["#D4AF37", "#2C1810", "#8B5E3C"],
    ["#FDFBF7", "#7A6B5D", "#4A0E17"]
  ][(product.product_id ? product.product_id.charCodeAt(product.product_id.length - 1) : 0) % 3];

  // Mock ratings to replicate the Hanger Edit bestsellers ratings in mockup
  const ratingData = {
    prod_5: { rating: 3.5, reviews: 10 },
    prod_6: { rating: 4.0, reviews: 30 },
    prod_7: { rating: 4.5, reviews: 20 },
    prod_8: { rating: 4.8, reviews: 15 }
  }[product.product_id] || null;

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-[#FDFBF7] cursor-pointer hover-lift transition-all duration-300"
      whileTap={{ scale: 0.98 }}
    >
      {/* Image / Video Container */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden bg-[#f4f0ea] ${product.stock <= 0 ? "opacity-70 grayscale-[20%]" : ""}`}>
        <Link href={`/products/${product.product_id}`} className="block h-full w-full pointer-events-auto">
          {product.video_url ? (
            <video
              src={product.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-108"
              style={{ transform: 'scale(1)', transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)' }}
            />
          ) : product.image ? (
            <>
              {/* Shimmer placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 animate-shimmer-gold" />
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={`object-cover object-center transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-108 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: 'scale(1)', transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease' }}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[#7A6B5D]">
              No Image
            </div>
          )}
        </Link>

        {/* Inner gold frame overlay on hover */}
        <div className="absolute inset-3 border border-[#D4AF37]/35 scale-[0.96] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none z-10" />
        
        {/* Top Left Badge */}
        {(badge || product.stock <= 0) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-sans font-bold tracking-[0.15em] uppercase shadow-sm z-10 border ${
              product.stock <= 0 
                ? "bg-[#2C1810] text-white border-[#2C1810]" 
                : "bg-[#FDFBF7] text-[#2C1810] border-[#D4AF37]/10"
            }`}
          >
            {product.stock <= 0 ? "OUT OF STOCK" : badge}
          </motion.div>
        )}

        {/* Top Right Heart */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#FDFBF7]/85 backdrop-blur-xs z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-[#FDFBF7] cursor-pointer shadow-sm hover:scale-110 active:scale-90"
        >
          <Heart
            className={`h-[14px] w-[14px] stroke-[1.5] transition-all duration-300 ${
              isWishlisted
                ? "fill-[#4A0E17] text-[#4A0E17] scale-110 animate-pulse"
                : "text-[#2C1810] hover:text-[#4A0E17]"
            }`}
          />
        </button>

        {/* Quick View Overlay (Desktop Only) — slides up on hover */}
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 bg-[#2C1810]/95 backdrop-blur-sm text-white items-center justify-center py-3 text-[9px] font-sans font-bold uppercase tracking-[0.18em] translate-y-full group-hover:translate-y-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 hover:bg-[#D4AF37] hover:text-[#2C1810]">
          Quick View
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-1 md:px-2 py-3 bg-[#FDFBF7]">
        <Link href={`/products/${product.product_id}`} className="group-hover:text-[#4A0E17] transition-colors duration-300">
          <h3 className="font-serif text-[14px] md:text-[15px] font-medium tracking-wide text-[#2C1810] leading-tight mb-1 truncate transition-colors duration-300 group-hover:text-[#4A0E17]" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            {product.title}
          </h3>
          <p className="font-sans text-[10px] md:text-[11px] tracking-wide font-light text-[#7A6B5D] truncate mb-2 md:mb-3">
            {product.description || "Premium Design"}
          </p>
        </Link>
        
        {/* Bestseller Ratings Row */}
        {ratingData && (
          <div className="flex items-center gap-1 mb-1.5 md:mb-2">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => {
                const isFilled = i < Math.floor(ratingData.rating);
                return (
                  <svg
                    key={i}
                    className={`h-2.5 w-2.5 md:h-3 md:w-3 transition-transform duration-200 ${isFilled ? "fill-[#D4AF37]" : "text-gray-300 fill-gray-200"}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-[9px] md:text-[10px] font-sans text-[#7A6B5D] font-medium">
              {ratingData.rating} ({ratingData.reviews}+)
            </span>
          </div>
        )}
        
        <p className="font-serif text-[14px] md:text-[15px] tracking-wide text-[#2C1810] font-medium mb-3 md:mb-4">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        
        <div className="mt-auto flex items-center gap-1.5">
          {colors.map((color, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 rounded-full border border-[#D4AF37]/20 transition-transform duration-200 hover:scale-125 cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
