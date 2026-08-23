export const metadata = {
  title: "Privacy Policy | Hanger The Designer Villa",
  description: "Our privacy policy and data protection guidelines.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Legal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Privacy <span className="italic font-light">Policy</span>
          </h1>
          <p className="font-sans text-xs tracking-widest text-[#7A6B5D] uppercase">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-sm font-sans text-sm text-[#7A6B5D] leading-relaxed space-y-8">
          
          <p className="font-serif text-xl text-[#2C1810] leading-normal">
            At Hanger The Designer Villa, we respect your privacy and are committed to protecting the personal data of our esteemed clients.
          </p>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              1. Information We Collect
            </h2>
            <p>
              We collect personal information that you provide to us directly, such as when you create an account, make a purchase, subscribe to our newsletter, or contact our Care team. This may include your name, email address, shipping and billing addresses, phone number, and payment information.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfill your orders, including sending you emails to confirm your order status and shipment.</li>
              <li>Communicate with you about our products, services, offers, promotions, and events.</li>
              <li>Provide personalized styling recommendations.</li>
              <li>Detect and prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential (e.g., shipping couriers, payment processors).
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              4. Data Security
            </h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology and processed through secure gateway providers.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact our Data Protection Officer at privacy@hangerthedesignervilla.com.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
