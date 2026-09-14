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
  const accentColor = type === "cart" ? "#B99A45" : "#9B3A4A";

  return (
    <div className="shrink-0 sticky top-0 z-20 bg-[#FBF9F4] border-b border-[#E7DDC9]">
      {/* Ultra-thin gold top accent line */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />

      <div className="flex items-center justify-between px-5 sm:px-6 py-4">
        {/* Left: Icon + Title Block */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Emblem */}
          <div
            className="w-9 h-9 flex items-center justify-center border shrink-0"
            style={{ borderColor: `${accentColor}30`, background: `${accentColor}0A` }}
          >
            <Icon className="h-4 w-4" style={{ color: accentColor }} strokeWidth={1.25} />
          </div>

          {/* Text Block */}
          <div className="flex flex-col gap-0.5 min-w-0">
            {/* Eyebrow */}
            <span
              className="font-sans text-[7px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: accentColor }}
            >
              {subtitle}
            </span>

            {/* Main Title + Count */}
            <div className="flex items-baseline gap-2.5">
              <h2
                className="font-serif text-[15px] sm:text-[16px] font-normal tracking-[0.12em] text-[#1A0F0C] leading-none uppercase"
                style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
              >
                {title}
              </h2>
              {itemCount > 0 && (
                <span
                  className="font-sans text-[8px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 border"
                  style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}08` }}
                >
                  {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-[#E7DDC9] hover:bg-[#F5F1E8] text-[#281713]/40 hover:text-[#281713] transition-all duration-200 cursor-pointer shrink-0 ml-3"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
