"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="border border-[#D4AF37]/20 p-8 md:p-10">
          <div className="border border-[#D4AF37]/10 p-6 md:p-8">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-5 border border-[#4A0E17]/15 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-[#4A0E17] stroke-[1.5]" />
            </div>

            <h2
              className="font-serif text-lg text-[#2C1810] tracking-wide mb-2"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Something Went Wrong
            </h2>
            <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed mb-1">
              We encountered an unexpected error. This has been logged and we&apos;ll look into it.
            </p>
            {error.digest && (
              <p className="font-sans text-[8px] text-[#7A6B5D]/50 tracking-wide mb-1">
                Error ID: {error.digest}
              </p>
            )}

            <details className="mt-3 mb-5 text-left">
              <summary className="font-sans text-[9px] font-semibold text-[#7A6B5D] cursor-pointer hover:text-[#2C1810] tracking-wide transition-colors">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-[#2C1810]/5 border border-[#D4AF37]/10 overflow-auto text-[10px] font-mono text-[#7A6B5D] leading-relaxed">
                {error.message}
              </pre>
            </details>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={reset}
                className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all hover:from-[#4A0E17] hover:to-[#6B1A24]"
              >
                <RefreshCw className="h-3 w-3 stroke-[2]" />
                Try Again
              </button>
              <Link
                href="/"
                className="w-full py-3 flex items-center justify-center gap-2 border border-[#D4AF37]/20 text-[#2C1810] font-sans text-[10px] font-bold tracking-[0.18em] uppercase transition-all hover:border-[#D4AF37]/50 hover:text-[#4A0E17]"
              >
                <Home className="h-3 w-3 stroke-[2]" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
