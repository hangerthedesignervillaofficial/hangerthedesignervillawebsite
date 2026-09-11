export const metadata = {
  title: "Terms & Conditions | Hanger The Designer Villa",
  description: "Terms of service and purchasing guidelines for Hanger The Designer Villa.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="font-sans text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Legal & Protocol
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>
          <h1
            className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-4"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Terms <span className="italic font-light">& Conditions</span>
          </h1>
          <p className="font-sans text-xs tracking-widest text-[#7A6B5D] uppercase">
            Effective Date: August 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-sm font-sans text-sm text-[#7A6B5D] leading-relaxed space-y-8">
          <p className="font-serif text-xl text-[#2C1810] leading-normal">
            Welcome to Hanger The Designer Villa. By accessing our platform or purchasing our bespoke creations, you agree to comply with and be bound by the following terms.
          </p>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              1. Boutique Purchases & Authenticity
            </h2>
            <p>
              All products listed on this website are original handcrafted and designer creations curated by Hanger The Designer Villa. Each piece undergoes stringent quality audits prior to dispatch. Minor organic variations in hand embroidery, motifs, and handloom fabrics are hallmarks of authentic artisanal couture.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              2. Pricing & Payments
            </h2>
            <p className="mb-2">
              All prices displayed are in Indian Rupees (INR) and include applicable taxes (GST). We reserve the right to modify prices without prior notice, though active paid orders will remain unaffected.
            </p>
            <p>
              We support verified payment channels including UPI, Net Banking, Credit/Debit Cards, and authorized international cards. Transactions are processed securely via SSL encryption.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              3. Custom & Made-To-Measure Orders
            </h2>
            <p>
              Custom-tailored, altered, or personalized silhouettes require client confirmation of specific measurements. Once production has commenced on bespoke orders, cancellations or modifications are not permitted.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              4. Intellectual Property
            </h2>
            <p>
              All trademarks, logos, photographs, artistic silhouettes, and copywriting featured on this boutique platform are the exclusive intellectual property of Hanger The Designer Villa. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              5. Jurisdiction
            </h2>
            <p>
              Any disputes arising in connection with orders or website terms are subject to the exclusive jurisdiction of the competent courts in Gurugram / New Delhi, India.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              6. Client Concierge
            </h2>
            <p className="text-[#2C1810] font-medium leading-relaxed">
              <strong>Hanger The Designer Villa</strong><br />
              GF-67/68, Ground Floor, Global Foyer Mall, Palam Vihar, Gurugram, Haryana<br />
              Direct Line / WhatsApp: +91 9999167840<br />
              Email: hangerthedesignervillaofficial@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
