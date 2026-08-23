import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="border border-[#D4AF37]/20 p-8 md:p-10">
          <div className="border border-[#D4AF37]/10 p-6 md:p-8">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-5 border border-[#D4AF37]/20 flex items-center justify-center">
              <Search className="h-7 w-7 text-[#D4AF37]/50 stroke-[1.5]" />
            </div>

            {/* Brand */}
            <img
              src="/images/logo-icon.png"
              alt="HANGER"
              className="h-7 w-auto mx-auto mb-4 object-contain opacity-30"
            />

            <h1
              className="font-serif text-5xl font-normal text-[#D4AF37]/30 tracking-wider mb-2"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              404
            </h1>
            <h2
              className="font-serif text-lg text-[#2C1810] tracking-wide mb-2"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Page Not Found
            </h2>
            <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed mb-6">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:from-[#4A0E17] hover:to-[#6B1A24]"
            >
              <Home className="h-3 w-3 stroke-[2]" />
              Go Home
            </Link>

            <p className="mt-4 font-sans text-[9px] text-[#7A6B5D]/60">
              Or try searching for what you need using the search bar above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
