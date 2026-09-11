import Link from "next/link";
import { RotateCcw, ShieldAlert, CheckCircle, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | Hanger The Designer Villa",
  description: "Official cancellation, exchange and refund policy for Hanger The Designer Villa.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="font-sans text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Customer Assurance
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>
          <h1
            className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-4"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Refund <span className="italic font-light">& Cancellation Policy</span>
          </h1>
          <p className="font-sans text-xs tracking-widest text-[#7A6B5D] uppercase">
            Transparent & Client-Centric Protocols
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-sm font-sans text-sm text-[#7A6B5D] leading-relaxed space-y-8">
          
          <div className="border-b border-[#D4AF37]/15 pb-6">
            <h2 className="font-serif text-xl text-[#2C1810] uppercase tracking-wide mb-3 flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
              7-Day Returns & Exchanges
            </h2>
            <p>
              We want you to adore your Hanger silhouette. If you are not completely satisfied, you may initiate a return or exchange request within <strong>7 days</strong> of delivery.
            </p>
          </div>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              1. Return Eligibility Criteria
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Item must be unused, unwashed, unaltered, and with all original designer tags attached.</li>
              <li>Garments must be returned in their original packaging and boutique garment cover.</li>
              <li>Footwear must only be tried on clean carpeted surfaces with zero scuffs on the soles.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              2. Non-Refundable Items
            </h2>
            <p className="mb-2">Due to bespoke hand-craftsmanship and hygiene protocols, the following cannot be returned or refunded:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Customized, tailored, or made-to-measure ensembles.</li>
              <li>Pierced jewelry, intimates, and hair accessories.</li>
              <li>Items purchased under promotional clearance or &apos;Final Sale&apos; tags.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              3. Order Cancellations
            </h2>
            <p>
              Orders can be cancelled online through your customer portal or by notifying concierge within <strong>2 hours</strong> of placing the order. Once an order moves into dispatch preparation, standard returns protocols apply upon delivery.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              4. Refund Processing Timeline
            </h2>
            <p>
              Once your returned item arrives at our flagship atelier and completes quality inspection (within 24-48 hours), your refund will be issued via the original payment method or as boutique store credit, as per your preference. Bank processing typically reflects in <strong>3-7 business days</strong>.
            </p>
          </section>

          <div className="pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[#2C1810] font-bold text-xs uppercase tracking-wider">
                Need assistance with a return or refund?
              </p>
              <p className="text-[11px] text-[#7A6B5D] mt-0.5">
                Our concierge is at your service 7 days a week.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/help/contact"
                className="bg-[#2C1810] text-[#D4AF37] px-5 py-2.5 font-sans text-[9px] font-bold tracking-widest uppercase hover:bg-[#4A0E17] transition-colors"
              >
                Contact Concierge
              </Link>
              <Link
                href="/help/returns"
                className="border border-[#D4AF37] text-[#2C1810] px-5 py-2.5 font-sans text-[9px] font-bold tracking-widest uppercase hover:bg-[#D4AF37]/10 transition-colors"
              >
                Return Steps
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
