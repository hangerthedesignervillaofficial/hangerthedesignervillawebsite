import Link from "next/link";
import { Package, Globe, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Shipping Information | Hanger The Designer Villa",
  description: "Information regarding domestic and international shipping, delivery times, and order tracking.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Shipping <span className="italic font-light">& Delivery</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-2xl mx-auto leading-relaxed">
            Every piece from The Designer Villa is meticulously packaged to ensure it arrives in pristine condition. Review our shipping timelines and options below.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 border border-[#D4AF37]/20 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
              <Package className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-3">Domestic Delivery</h3>
            <p className="font-sans text-sm text-[#7A6B5D] leading-relaxed mb-4">
              Complimentary shipping on all orders above ₹999 within India. Standard delivery takes 3-5 business days.
            </p>
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mt-auto">
              Via Bluedart / Delhivery
            </span>
          </div>

          <div className="bg-white p-8 border border-[#D4AF37]/20 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
              <Globe className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-3">International Shipping</h3>
            <p className="font-sans text-sm text-[#7A6B5D] leading-relaxed mb-4">
              We ship worldwide. International delivery typically takes 7-14 business days. Shipping costs are calculated at checkout.
            </p>
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mt-auto">
              Via DHL Express
            </span>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-12">
          <section className="border-b border-[#D4AF37]/15 pb-12">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="h-6 w-6 text-[#D4AF37] stroke-[1.5]" />
              <h2 className="font-serif text-2xl text-[#2C1810] uppercase tracking-wider">Processing Time</h2>
            </div>
            <div className="space-y-4 font-sans text-sm text-[#7A6B5D] leading-loose pl-10">
              <p>
                All orders are subject to a processing time of 1-2 business days before they are dispatched. During peak seasons, festive periods, or sale events, processing may take up to 4 business days.
              </p>
              <p>
                Custom or made-to-order pieces require additional time. The estimated creation and delivery timeline will be communicated directly to you by our styling team.
              </p>
            </div>
          </section>

          <section className="border-b border-[#D4AF37]/15 pb-12">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheck className="h-6 w-6 text-[#D4AF37] stroke-[1.5]" />
              <h2 className="font-serif text-2xl text-[#2C1810] uppercase tracking-wider">Taxes & Duties</h2>
            </div>
            <div className="space-y-4 font-sans text-sm text-[#7A6B5D] leading-loose pl-10">
              <p>
                <strong>Domestic Orders (India):</strong> All product prices are inclusive of GST. No additional taxes will be charged at checkout.
              </p>
              <p>
                <strong>International Orders:</strong> Prices displayed are exclusive of international duties and taxes. Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Hanger The Designer Villa is not responsible for these charges if they are applied and are your responsibility as the customer.
              </p>
            </div>
          </section>

          <section className="text-center pt-8">
            <p className="font-sans text-sm text-[#7A6B5D] mb-6">
              Need assistance tracking an existing order?
            </p>
            <Link href="/help/contact" className="inline-flex items-center justify-center bg-transparent border border-[#2C1810] text-[#2C1810] px-8 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#2C1810] hover:text-[#D4AF37] transition-colors">
              Contact Customer Care
            </Link>
          </section>
        </div>

      </div>
    </div>
  );
}
