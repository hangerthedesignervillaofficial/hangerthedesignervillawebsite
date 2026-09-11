"use client";

import { useState } from "react";
import { Tag, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";
import { Coupon } from "@/services/coupon/couponService";

interface BoutiquePrivilegesProps {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  subtotal: number;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  availableCoupons: Coupon[];
}

export function BoutiquePrivileges({
  appliedCoupon,
  discountAmount,
  subtotal,
  onApplyCoupon,
  onRemoveCoupon,
  availableCoupons,
}: BoutiquePrivilegesProps) {
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (codeToUse?: string) => {
    const code = (codeToUse || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setErrorMsg("Please enter a privilege voucher code");
      return;
    }

    setErrorMsg(null);
    setIsApplying(true);
    const res = await onApplyCoupon(code);
    setIsApplying(false);

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setErrorMsg(null);
      setCouponCodeInput("");
    }
  };

  return (
    <div className="bg-[#F5F1E8] border border-[#E7DDC9] p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#B99A45]" strokeWidth={1.25} />
          <span className="font-sans text-[8.5px] sm:text-[9px] font-semibold tracking-[0.22em] text-[#281713] uppercase">
            Privilege Voucher & Promo
          </span>
        </div>

        {appliedCoupon && (
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-[8px] font-sans font-semibold tracking-[0.18em] text-[#8B2635] uppercase hover:underline cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>

      {appliedCoupon ? (
        /* Applied Coupon State - Understated Ivory Card */
        <div className="p-3 bg-[#FBF9F4] border border-[#E7DDC9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#B99A45]/15 border border-[#B99A45]/30 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#B99A45]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-[#281713] uppercase">
                  {appliedCoupon.code}
                </span>
                <span className="font-sans text-[8px] font-semibold tracking-wider text-[#B99A45] uppercase">
                  Privilege Active
                </span>
              </div>
              <p className="font-sans text-[9px] text-[#82756D] mt-0.5">
                {appliedCoupon.description || "Boutique privilege applied"} (Saved {formatCurrency(discountAmount)})
              </p>
            </div>
          </div>

          <span className="font-sans font-semibold text-xs text-[#281713]">
            -{formatCurrency(discountAmount)}
          </span>
        </div>
      ) : (
        <>
          {/* Coupon Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="ENTER CODE"
              value={couponCodeInput}
              onChange={(e) => {
                setCouponCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ""));
                setErrorMsg(null);
              }}
              className="flex-1 bg-[#FBF9F4] border border-[#E7DDC9] px-3 py-2 text-xs font-mono font-medium tracking-widest text-[#281713] placeholder:font-sans placeholder:tracking-wider placeholder:text-[#82756D]/50 focus:outline-none focus:border-[#B99A45] rounded-none transition-colors"
            />
            <button
              type="submit"
              disabled={isApplying || !couponCodeInput.trim()}
              className="px-4 py-2 bg-[#281713] text-[#B99A45] hover:bg-[#1a0f0d] hover:text-[#FBF9F4] font-sans text-[8.5px] font-semibold tracking-[0.24em] uppercase transition-all duration-300 disabled:opacity-40 cursor-pointer rounded-none shrink-0"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </form>

          {/* Compact Refined Inline Validation Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 p-2.5 bg-[#FDF5F5] border border-[#F0D5D8] text-[#8B2635] text-[9.5px] font-sans"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#8B2635]" strokeWidth={1.25} />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Available Boutique Privileges (Chips) */}
          {availableCoupons.length > 0 && (
            <div className="pt-2.5 border-t border-[#E7DDC9]/60">
              <span className="font-sans text-[7.5px] font-semibold tracking-[0.25em] text-[#82756D] uppercase block mb-2">
                Available Boutique Privileges
              </span>

              <div className="flex flex-wrap gap-2">
                {availableCoupons.slice(0, 4).map((cpn) => {
                  const meetsThreshold = !cpn.minOrderValue || subtotal >= cpn.minOrderValue;
                  const deficit = cpn.minOrderValue ? Math.max(0, cpn.minOrderValue - subtotal) : 0;

                  return (
                    <button
                      key={cpn.id}
                      type="button"
                      onClick={() => {
                        if (!meetsThreshold) {
                          setErrorMsg(`Add ${formatCurrency(deficit)} more to unlock ${cpn.code}`);
                        } else {
                          handleSubmit(cpn.code);
                        }
                      }}
                      className={`group flex items-center gap-1.5 px-2.5 py-1.5 text-[8.5px] font-sans border transition-all duration-300 rounded-none cursor-pointer ${
                        meetsThreshold
                          ? "bg-[#FBF9F4] border-[#E7DDC9] text-[#281713] hover:border-[#B99A45] hover:bg-[#281713] hover:text-[#FBF9F4]"
                          : "bg-[#FBF9F4]/60 border-[#E7DDC9]/70 text-[#82756D] opacity-75 hover:opacity-100 hover:border-[#E7DDC9]"
                      }`}
                      title={
                        !meetsThreshold
                          ? `Requires minimum order of ₹${cpn.minOrderValue.toLocaleString("en-IN")}`
                          : `Apply ${cpn.code}`
                      }
                    >
                      <Tag
                        className="w-2.5 h-2.5 text-[#B99A45] transition-transform group-hover:scale-110"
                        strokeWidth={1.25}
                      />
                      <span className="font-mono font-medium tracking-wider uppercase">
                        {cpn.code}
                      </span>
                      <span className="text-[#82756D] group-hover:text-[#B99A45] font-normal">
                        {cpn.discountType === "percentage" ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
