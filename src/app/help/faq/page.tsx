import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: "FAQs | Hanger The Designer Villa",
  description: "Frequently asked questions about orders, shipping, and styling.",
};

const faqs = [
  {
    category: "Orders & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and select secure local payment gateways like Razorpay and UPI.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can only be modified or cancelled within 2 hours of placement. Since we begin processing your exquisite pieces immediately, we cannot guarantee changes after this window. Please contact our Care team urgently if a change is needed.",
      },
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long will my order take to arrive?",
        a: "Domestic orders typically arrive within 3-5 business days. International orders take 7-14 business days depending on customs processing in your country.",
      },
      {
        q: "Do you offer express shipping?",
        a: "Yes, we offer next-day delivery for select metro cities in India at an additional cost. International express shipping is available via DHL.",
      }
    ]
  },
  {
    category: "Product & Styling",
    questions: [
      {
        q: "Are the colors on the website exactly what I will receive?",
        a: "We make every effort to display the colors of our silhouettes as accurately as possible. However, as computer monitors and screens vary, we cannot guarantee that your monitor's display of any color will be completely accurate.",
      },
      {
        q: "Do you offer private styling appointments?",
        a: "Absolutely. We offer exclusive virtual or in-person styling consultations at our Villa. Please contact our concierge team to schedule an appointment with our head stylist.",
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Client Inquiries
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Frequently Asked <span className="italic font-light">Questions</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about our collections, shipping policies, and boutique services.
          </p>
        </div>

        {/* FAQ Accordion (Simulated with simple HTML5 Details/Summary for elegance without client JS) */}
        <div className="space-y-16">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-6 border-b border-[#D4AF37]/20 pb-3">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, fIdx) => (
                  <details key={fIdx} className="group bg-white border border-[#D4AF37]/15 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-6 font-serif text-lg text-[#2C1810] hover:bg-[#F0E6D8]/20 transition-colors list-none">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-5 w-5 text-[#D4AF37] stroke-[1.5] transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6 pt-2 font-sans text-sm text-[#7A6B5D] leading-relaxed border-t border-[#D4AF37]/10 mx-6">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-24 text-center bg-[#2C1810] p-12 text-[#FDFBF7]">
          <h3 className="font-serif text-2xl uppercase tracking-wider mb-4">Still have questions?</h3>
          <p className="font-sans text-sm text-[#B89E8A] mb-8">
            Our concierge team is available to assist you personally.
          </p>
          <Link href="/help/contact" className="inline-block border border-[#D4AF37] text-[#D4AF37] px-8 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#2C1810] transition-colors">
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
