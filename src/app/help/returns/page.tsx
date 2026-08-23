import Link from "next/link";
import { RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges | Hanger The Designer Villa",
  description: "Information regarding our return and exchange policies.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Client Satisfaction
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Returns <span className="italic font-light">& Exchanges</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-2xl mx-auto leading-relaxed">
            We want you to be entirely satisfied with your purchase from The Designer Villa. If for any reason you are not, we gladly accept returns and exchanges within 7 days of delivery.
          </p>
        </div>

        <div className="space-y-12">
          {/* Conditions */}
          <section className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
            <h2 className="font-serif text-2xl text-[#2C1810] uppercase tracking-wider mb-6 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#D4AF37] stroke-[1.5]" />
              Return Conditions
            </h2>
            <ul className="space-y-4 font-sans text-sm text-[#7A6B5D] leading-relaxed ml-9 list-disc pl-4">
              <li>Items must be returned within 7 days of the delivery date.</li>
              <li>Items must be in their original, unused, unaltered, and unwashed condition.</li>
              <li>All original tags, authenticity cards, dust bags, and packaging must be intact and included.</li>
              <li>Footwear must be tried on carpeted surfaces only and returned in the original designer box without damage.</li>
              <li>Custom-made, altered, or personalized items are final sale and cannot be returned or exchanged.</li>
              <li>Intimates, swimwear (without protective strip), and pierced jewellery are strictly non-returnable for hygiene reasons.</li>
            </ul>
          </section>

          {/* Process */}
          <section className="bg-[#2C1810] p-8 md:p-12 text-[#FDFBF7]">
            <h2 className="font-serif text-2xl uppercase tracking-wider mb-8 flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-[#D4AF37] stroke-[1.5]" />
              How to initiate a return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#D4AF37]/50 block">01</span>
                <h3 className="font-sans text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Request</h3>
                <p className="font-sans text-xs text-[#B89E8A] leading-relaxed">
                  Log into your account and select the order, or contact our Care team directly to request a Return Authorization (RA) number.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#D4AF37]/50 block">02</span>
                <h3 className="font-sans text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Pack</h3>
                <p className="font-sans text-xs text-[#B89E8A] leading-relaxed">
                  Securely pack the items in their original packaging, ensuring all tags are attached. Write the RA number clearly on the outside.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#D4AF37]/50 block">03</span>
                <h3 className="font-sans text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Ship</h3>
                <p className="font-sans text-xs text-[#B89E8A] leading-relaxed">
                  Drop off the package at the designated courier, or hand it over to the pickup executive if a reverse pickup was scheduled.
                </p>
              </div>
            </div>
          </section>

          {/* Non-Returnable */}
          <section className="bg-[#F0E6D8]/50 p-8 md:p-12 border border-[#2C1810]/10 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-red-900/10 p-3 rounded-full shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-800 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-[#2C1810] uppercase tracking-wider mb-3">
                Sale Items & Final Sale
              </h2>
              <p className="font-sans text-sm text-[#7A6B5D] leading-relaxed">
                Items marked as "Final Sale" or purchased during promotional clearance events are not eligible for returns, exchanges, or store credit. Please verify your sizing carefully before purchasing sale pieces.
              </p>
            </div>
          </section>

          <section className="text-center pt-8">
            <Link href="/help/contact" className="inline-flex items-center justify-center bg-[#2C1810] text-[#D4AF37] px-8 py-4 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] hover:text-white transition-colors">
              Request a Return
            </Link>
          </section>
        </div>

      </div>
    </div>
  );
}
