"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full bg-[#1A0A0E] text-[#FDFBF7] overflow-hidden"
        >
          <div className="py-2.5 flex items-center justify-center px-8 relative max-w-[1400px] mx-auto">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-center w-full">
              FREE SHIPPING ON ALL DOMESTIC ORDERS OVER 1,999
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 text-[#FDFBF7]/50 hover:text-[#D4AF37] transition-colors"
              aria-label="Close announcement"
            >
              <X className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
