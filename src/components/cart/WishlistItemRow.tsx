"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProductType } from "@/types";

interface WishlistItemRowProps {
  item: ProductType;
  onMoveToCart: (item: ProductType) => void;
  onRemove: (productId: string) => void;
  isMoving?: boolean;
}

export function WishlistItemRow({
  item,
  onMoveToCart,
  onRemove,
  isMoving = false,
}: WishlistItemRowProps) {
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

      {/* Product Details & Actions */}
      <div className="flex-1 flex flex-col justify-between h-[106px] sm:h-[124px] min-w-0 py-0.5">
        <div>
          {/* Top category label & subtle remove button */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-sans text-[7.5px] font-semibold tracking-[0.24em] text-[#B99A45] uppercase">
              Curated Couture
            </span>

            <button
              onClick={() => onRemove(item.product_id)}
              className="text-[#82756D]/50 hover:text-[#8B2635] p-1 -mr-1 -mt-0.5 transition-colors cursor-pointer"
              aria-label={`Remove ${item.title} from lookbook`}
              title="Remove piece"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.25} />
            </button>
          </div>

          {/* Product Title in Serif */}
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

        {/* Bottom Row: Understated Price + Refined Move to Bag Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E7DDC9]/50">
          <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#281713] tracking-wider">
            {formatCurrency(item.price)}
          </span>

          <button
            type="button"
            disabled={isMoving}
            onClick={() => onMoveToCart(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F1E8] hover:bg-[#281713] hover:text-[#FBF9F4] text-[#281713] font-sans text-[8.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 border border-[#E7DDC9] cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-3 h-3 text-[#B99A45]" strokeWidth={1.25} />
            <span>{isMoving ? "Moving..." : "Move to Bag"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
