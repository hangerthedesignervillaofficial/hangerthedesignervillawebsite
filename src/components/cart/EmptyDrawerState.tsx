"use client";

import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

interface EmptyDrawerStateProps {
  type: "cart" | "wishlist";
  onAction: () => void;
}

export function EmptyDrawerState({ type, onAction }: EmptyDrawerStateProps) {
  const isCart = type === "cart";
  const Icon = isCart ? ShoppingBag : Heart;

  const title = isCart ? "YOUR BAG IS VACANT" : "YOUR LOOKBOOK IS EMPTY";
  const subtitle = isCart
    ? "Explore our curated couture and add hand-finished silhouettes to your private wardrobe."
    : "Browse our designer silhouettes and save your favourite looks for your private wardrobe.";
  const cta = isCart ? "DISCOVER NEW SILHOUETTES" : "DISCOVER BOUTIQUE EDIT";

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20 space-y-6 max-w-xs mx-auto">
      {/* Refined Luxury Emblem */}
      <div className="w-16 h-16 rounded-full bg-[#F5F1E8] border border-[#E7DDC9] flex items-center justify-center relative">
        <Icon className="w-6 h-6 text-[#B99A45]" strokeWidth={1.1} />
      </div>

      {/* Typography Block */}
      <div className="space-y-2">
        <h3
          className="font-serif text-sm sm:text-base font-normal tracking-[0.22em] text-[#281713] uppercase"
          style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="font-sans text-[10px] sm:text-[10.5px] text-[#82756D] leading-relaxed max-w-[260px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Luxury Invitation CTA */}
      <button
        type="button"
        onClick={onAction}
        className="group inline-flex items-center gap-2 px-6 py-3 bg-[#281713] hover:bg-[#1a0f0d] text-[#FBF9F4] font-sans text-[8.5px] sm:text-[9px] font-semibold tracking-[0.24em] uppercase transition-all duration-300 border border-[#281713] hover:border-[#B99A45] cursor-pointer rounded-none"
      >
        <span>{cta}</span>
        <ArrowRight
          className="w-3 h-3 text-[#B99A45] transition-transform group-hover:translate-x-1"
          strokeWidth={1.25}
        />
      </button>
    </div>
  );
}
