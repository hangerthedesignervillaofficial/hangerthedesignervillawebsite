"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="border border-[#D4AF37]/20 p-8 md:p-10">
          <div className="border border-[#D4AF37]/10 p-6 md:p-8">
            {/* Cancel icon */}
            <div className="w-16 h-16 mx-auto mb-5 border border-[#4A0E17]/20 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-[#4A0E17] stroke-[1.5]" />
            </div>

            <h2
              className="font-serif text-xl text-[#2C1810] tracking-wide mb-2"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Checkout Cancelled
            </h2>
            <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed mb-1">
              Your checkout was cancelled. No charges were made.
            </p>
            <p className="font-sans text-[10px] text-[#7A6B5D]/70 mb-6">
              Your items are still in your bag and ready when you are.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/cart")}
                className="flex-1 py-3 border border-[#D4AF37]/20 text-[#2C1810] font-sans text-[10px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-all hover:border-[#D4AF37]/50 hover:text-[#4A0E17]"
              >
                Return to Bag
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="flex-1 py-3 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all hover:from-[#4A0E17] hover:to-[#6B1A24]"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
