"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface ComplimentaryDeliveryBarProps {
  subtotal: number;
  threshold?: number;
}

export function ComplimentaryDeliveryBar({
  subtotal,
  threshold = 999,
}: ComplimentaryDeliveryBarProps) {
  const qualifies = subtotal >= threshold;
  const progress = Math.min((subtotal / threshold) * 100, 100);
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <div className="bg-[#F5F1E8] border border-[#E7DDC9] p-3.5 space-y-2">
      <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] font-sans font-medium tracking-[0.22em] uppercase">
        <span className="text-[#82756D]">White-Glove Delivery</span>

        {qualifies ? (
          <span className="text-[#B99A45] flex items-center gap-1 font-semibold">
            <Check className="w-3 h-3" strokeWidth={1.5} /> Complimentary Unlocked
          </span>
        ) : (
          <span className="text-[#281713]">
            Add <span className="text-[#B99A45] font-semibold">{formatCurrency(remaining)}</span> for Complimentary
          </span>
        )}
      </div>

      <div className="w-full h-1 bg-[#E7DDC9]/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-[#B99A45]"
        />
      </div>
    </div>
  );
}
