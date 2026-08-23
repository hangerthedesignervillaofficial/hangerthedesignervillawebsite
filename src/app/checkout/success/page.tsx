"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("checkout_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="border border-[#D4AF37]/25 bg-white/70 backdrop-blur-md p-8 md:p-10 relative overflow-hidden shadow-xl shadow-[#D4AF37]/5">
            <div className="absolute inset-2.5 border border-[#D4AF37]/10 pointer-events-none" />
            <div className="relative z-10 py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 mx-auto mb-6 flex items-center justify-center"
              >
                <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin stroke-[1.2]" />
              </motion.div>
              <h2
                className="font-serif text-lg text-[#2C1810] tracking-[0.15em] uppercase mb-3"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Securing Your Order
              </h2>
              <p className="font-sans text-[10px] text-[#7A6B5D] leading-relaxed uppercase tracking-wider">
                Assigning native artisan clusters and confirming receipt...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        <div className="border border-[#D4AF37]/25 bg-white/85 backdrop-blur-md p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
          {/* Inner decorative double gold outline */}
          <div className="absolute inset-2.5 border border-[#D4AF37]/10 pointer-events-none" />
          <div className="absolute inset-3 border border-[#D4AF37]/5 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            
            {/* Elegant Checkmark Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              className="w-20 h-20 mx-auto border border-[#D4AF37]/25 flex items-center justify-center relative bg-[#FFFDFC]"
            >
              <div className="absolute inset-1.5 border border-dashed border-[#D4AF37]/20 pointer-events-none" />
              <CheckCircle2 className="h-9 w-9 text-[#D4AF37] stroke-[1.2]" />
            </motion.div>

            {/* Brand Logo Header */}
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="font-serif text-[18px] tracking-[0.25em] text-[#2C1810] uppercase">
                HANGER
              </span>
              <span className="font-sans text-[7.5px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase">
                The Designer Villa
              </span>
            </div>

            <div className="w-12 h-[1px] bg-[#D4AF37]/35 mx-auto" />

            {/* Title / Hook */}
            <div className="space-y-2">
              <h2
                className="font-serif text-xl md:text-2xl font-normal tracking-[0.1em] text-[#2C1810] uppercase"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Wardrobe Secured
              </h2>
              <p className="font-serif italic text-xs text-[#7A6B5D] leading-relaxed max-w-xs mx-auto">
                "Thank you for choosing slow fashion and supporting native Indian craftsmanship."
              </p>
            </div>

            {/* Order specifications card */}
            <div className="bg-[#FDFBF7] border border-[#D4AF37]/15 p-5 space-y-2.5 text-left">
              <div className="flex justify-between items-center text-[10px] font-sans text-[#7A6B5D] uppercase tracking-widest border-b border-[#D4AF37]/10 pb-2">
                <span>Atelier Code</span>
                <span className="font-bold text-[#2C1810]">{checkoutId || "HNGR-SUCCESS"}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-sans text-[#7A6B5D] uppercase tracking-widest border-b border-[#D4AF37]/10 pb-2">
                <span>Atelier Status</span>
                <span className="font-bold text-green-600 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Assigned
                </span>
              </div>
              <p className="font-sans text-[9px] text-[#7A6B5D]/80 leading-relaxed pt-1">
                A copy of your payment summary is dispatched. Our master tailors are preparing your selected silhouettes.
              </p>
            </div>

            {/* Button CTA stack */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => router.push("/profile")}
                className="flex-1 py-4 border border-[#D4AF37]/25 text-[#2C1810] hover:text-[#4A0E17] hover:border-[#D4AF37]/60 font-sans text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 rounded-none bg-transparent active:scale-95"
              >
                Wardrobe Orders
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-4 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer border border-[#D4AF37]/35 shadow-md transition-all duration-300 rounded-none active:scale-95 flex items-center justify-center gap-1.5"
              >
                Atelier Shop
                <ArrowRight className="h-3 w-3 stroke-[2]" />
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin stroke-[1.2]" />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
