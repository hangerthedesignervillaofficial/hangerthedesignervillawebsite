"use client";

import { X, ShoppingBag, Heart } from "lucide-react";

interface DrawerHeaderProps {
  title: string;
  subtitle: string;
  itemCount: number;
  type: "cart" | "wishlist";
  onClose: () => void;
}

export function DrawerHeader({
  title,
  subtitle,
  itemCount,
  type,
  onClose,
}: DrawerHeaderProps) {
  const Icon = type === "cart" ? ShoppingBag : Heart;

  return (
    <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E7DDC9] bg-[#FBF9F4]/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
      {/* Brand & Editorial Title Block */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#F5F1E8] flex items-center justify-center border border-[#E7DDC9] shrink-0">
          <Icon className="h-3.5 w-3.5 text-[#B99A45]" strokeWidth={1.25} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="font-serif text-[12.5px] sm:text-sm font-normal tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#281713] leading-none"
              style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
            >
              {title}
            </h2>

            <span className="inline-flex items-center gap-1 font-sans text-[7px] sm:text-[7.5px] font-semibold text-[#82756D] bg-[#F5F1E8] border border-[#E7DDC9] px-1.5 sm:px-2 py-0.5 tracking-[0.2em] uppercase rounded-none">
              <span className="w-1 h-1 rounded-full bg-[#B99A45]" />
              {itemCount} {itemCount === 1 ? "Piece" : "Pieces"}
            </span>
          </div>

          <span className="font-sans text-[7.5px] sm:text-[8px] font-medium tracking-[0.24em] sm:tracking-[0.28em] text-[#82756D] uppercase mt-1">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Refined Luxury Close Button */}
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#281713]/60 hover:text-[#281713] hover:bg-[#F5F1E8] border border-transparent hover:border-[#E7DDC9] transition-all cursor-pointer shrink-0 ml-2"
        aria-label={`Close ${type === "cart" ? "shopping bag" : "lookbook"}`}
      >
        <X className="w-4 h-4" strokeWidth={1.25} />
      </button>
    </div>
  );
}
