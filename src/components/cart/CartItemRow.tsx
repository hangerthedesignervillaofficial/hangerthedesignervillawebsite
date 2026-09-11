"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CartItem } from "@/context/CartContext";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex gap-3 sm:gap-4 items-center py-4 border-b border-[#E7DDC9]/70 last:border-b-0">
      {/* Editorial Product Image */}
      <div className="w-[80px] h-[106px] sm:w-[94px] sm:h-[124px] bg-[#F5F1E8] border border-[#E7DDC9] overflow-hidden shrink-0 relative">
        <img
          src={item.image || "https://images.unsplash.com/photo-1596458514167-9359c25095d5?w=200"}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Details & Controls */}
      <div className="flex-1 flex flex-col justify-between h-[106px] sm:h-[124px] min-w-0 py-0.5">
        <div>
          {/* Top category label & subtle delete icon */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-sans text-[7.5px] font-semibold tracking-[0.24em] text-[#B99A45] uppercase">
              Designer Silhouette
            </span>

            <button
              onClick={() => onRemove(item.product_id)}
              className="text-[#82756D]/50 hover:text-[#8B2635] p-1 -mr-1 -mt-0.5 transition-colors cursor-pointer"
              aria-label={`Remove ${item.title} from bag`}
              title="Remove piece"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.25} />
            </button>
          </div>

          {/* Product Title in High-Contrast Luxury Serif */}
          <h3
            className="font-serif text-[13px] sm:text-sm font-normal text-[#281713] tracking-wide line-clamp-1 leading-snug mt-1"
            style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
          >
            {item.title}
          </h3>

          {/* Short Description */}
          {item.description && (
            <p className="font-sans text-[9.5px] text-[#82756D] line-clamp-1 mt-0.5 tracking-normal">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom Row: Minimal Quantity Control + Understated Price */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E7DDC9]/50">
          {/* Refined Quantity Selector */}
          <div className="flex items-center border border-[#E7DDC9] bg-[#FBF9F4] h-7">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.product_id, -1)}
              className="w-7 h-7 flex items-center justify-center text-[#82756D] hover:text-[#281713] hover:bg-[#F5F1E8] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-2.5 h-2.5" strokeWidth={1.25} />
            </button>

            <span className="w-7 text-center font-sans text-[10.5px] font-medium text-[#281713] select-none">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.product_id, 1)}
              className="w-7 h-7 flex items-center justify-center text-[#82756D] hover:text-[#281713] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-2.5 h-2.5" strokeWidth={1.25} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#281713] tracking-wider block">
              {formatCurrency(item.price * item.quantity)}
            </span>
            {item.quantity > 1 && (
              <span className="font-sans text-[8px] text-[#82756D] tracking-wider block">
                {formatCurrency(item.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
