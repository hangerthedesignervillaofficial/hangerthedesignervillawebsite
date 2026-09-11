"use client";

import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Coupon } from "@/services/coupon/couponService";

interface OrderSummaryFooterProps {
  subtotal: number;
  discountAmount: number;
  appliedCoupon: Coupon | null;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

export function OrderSummaryFooter({
  subtotal,
  discountAmount,
  appliedCoupon,
  shipping,
  total,
  onCheckout,
}: OrderSummaryFooterProps) {
  return (
    <div className="border-t border-[#E7DDC9] bg-[#FBF9F4] p-5 md:p-6 shrink-0 space-y-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(40,23,19,0.04)]">
      {/* Price Breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-[9px] font-sans font-medium tracking-[0.2em] uppercase">
          <span className="text-[#82756D]">Subtotal</span>
          <span className="text-[#281713] font-semibold">{formatCurrency(subtotal)}</span>
        </div>

        {/* Privilege Discount (if any) */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[9px] font-sans font-medium tracking-[0.2em] uppercase">
            <span className="text-[#B99A45]">
              Privilege Discount ({appliedCoupon?.code || "Active"})
            </span>
            <span className="text-[#B99A45] font-semibold">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between text-[9px] font-sans font-medium tracking-[0.2em] uppercase">
          <span className="text-[#82756D]">Delivery</span>
          <span className="text-[#B99A45] font-semibold">
            {shipping === 0 ? "Complimentary" : formatCurrency(shipping)}
          </span>
        </div>

        {/* Fine Divider */}
        <div className="h-[1px] bg-[#E7DDC9] my-2" />

        {/* Estimated Total */}
        <div className="flex items-baseline justify-between pt-0.5">
          <div>
            <span
              className="font-serif text-sm font-normal tracking-[0.16em] uppercase text-[#281713] block"
              style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
            >
              Estimated Total
            </span>
            <span className="font-sans text-[7.5px] font-medium tracking-[0.22em] text-[#82756D] uppercase block mt-0.5">
              All Taxes Included (18% GST)
            </span>
          </div>

          <span
            className="font-serif text-lg md:text-xl font-normal text-[#281713] tracking-wide"
            style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Luxury Checkout Button */}
      <button
        type="button"
        onClick={onCheckout}
        className="group relative w-full h-12 bg-[#281713] hover:bg-[#1a0f0d] text-[#FBF9F4] font-sans text-[9px] sm:text-[9.5px] font-semibold tracking-[0.26em] uppercase transition-all duration-300 border border-[#281713] hover:border-[#B99A45] flex items-center justify-center gap-2.5 cursor-pointer rounded-none"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight
          className="w-3.5 h-3.5 text-[#B99A45] transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.25}
        />
      </button>
    </div>
  );
}
