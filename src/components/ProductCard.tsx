"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ProductType } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: ProductType;
  badge?: "NEW ARRIVAL" | "BESTSELLER" | "OUT OF STOCK";
}

// Deterministic star rating from product ID
function getDeterministicRating(id: string) {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return { rating: 3.8 + (seed % 12) / 10, count: 8 + (seed % 47) };
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [loaded, setLoaded] = useState(false);
  const wishlisted = isInWishlist(product.product_id);

  const { rating, count } = getDeterministicRating(product.product_id ?? "0");
  const outOfStock = product.stock <= 0;
  const displayBadge = outOfStock ? "OUT OF STOCK" : badge;

  return (
    <motion.div
      className="group relative flex flex-col bg-[#F9F6F1] cursor-pointer"
      whileTap={{ scale: 0.985 }}
    >
      {/* ── IMAGE ── */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden bg-[#EDE3D7] ${outOfStock ? "grayscale-[15%] opacity-75" : ""}`}>
        <Link href={`/products/${product.product_id}`} className="block absolute inset-0" tabIndex={-1} aria-hidden>
          {product.video_url ? (
            <video src={product.video_url} autoPlay muted loop playsInline
              className="w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105" />
          ) : product.image ? (
            <>
              {/* Shimmer skeleton */}
              {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#EDE3D7] via-[#F5EDD8] to-[#EDE3D7]" />}
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover object-center transition-all duration-[1.8s] ease-out group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#7A7A7A] text-xs">No image</div>
          )}
        </Link>

        {/* Gold inner frame on hover */}
        <div className="absolute inset-3 border border-[#C9A962]/0 group-hover:border-[#C9A962]/35 transition-all duration-700 pointer-events-none z-10" />

        {/* Badge */}
        {displayBadge && (
          <div className={`absolute top-3 left-3 px-2.5 py-[5px] z-10 font-sans text-[8.5px] font-bold tracking-[0.18em] uppercase shadow-sm ${
            outOfStock
              ? "bg-[#1A1A1A] text-white"
              : "bg-[#F9F6F1]/92 text-[#1A1A1A] border border-[#C9A962]/20"
          }`}>
            {displayBadge}
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/88 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300 hover:scale-110 active:scale-90"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-[14px] w-[14px] stroke-[1.5] transition-colors duration-300 ${
            wishlisted ? "fill-[#C9A962] text-[#C9A962]" : "text-[#1A1A1A] hover:text-[#C9A962]"
          }`} />
        </button>

        {/* "Quick View" hover overlay — desktop only */}
        <Link
          href={`/products/${product.product_id}`}
          className="hidden md:flex absolute bottom-0 inset-x-0 bg-[#1A1A1A]/92 backdrop-blur-sm text-white items-center justify-center py-[11px] font-sans text-[9px] font-bold tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 hover:bg-[#C9A962]"
        >
          QUICK VIEW
        </Link>
      </div>

      {/* ── PRODUCT DETAILS ── */}
      <div className="flex flex-col pt-4 pb-1 items-center text-center gap-1.5">
        <Link href={`/products/${product.product_id}`} className="group/title">
          <h3 className="font-serif text-[14.5px] md:text-[15px] font-medium text-[#1A1A1A] leading-tight tracking-wide group-hover/title:text-[#C9A962] transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex">
            {[0, 1, 2, 3, 4].map(i => {
              const filled = i < Math.floor(rating);
              const half   = !filled && i < rating;
              return (
                <svg key={i} viewBox="0 0 20 20" className={`w-2.5 h-2.5 ${filled ? "fill-[#C9A962]" : half ? "fill-[#C9A962]/50" : "fill-[#E0DDD9]"}`}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
          <span className="font-sans text-[10px] text-[#7A7A7A]">({count})</span>
        </div>

        {/* Price */}
        <p className="font-sans text-[13.5px] font-semibold tracking-[0.08em] text-[#1A1A1A] mt-0.5">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </motion.div>
  );
}
