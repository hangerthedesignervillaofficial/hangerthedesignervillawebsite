import Link from "next/link";
import { Ruler, Sparkles, HelpCircle, Phone } from "lucide-react";

export const metadata = {
  title: "Size Guide | Hanger The Designer Villa",
  description: "Find your perfect fit with our comprehensive luxury apparel and footwear sizing guide.",
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="font-sans text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Precision & Craftsmanship
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-4" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Size <span className="italic font-light">& Fit Guide</span>
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#7A6B5D] max-w-xl mx-auto leading-relaxed">
            Every garment at Hanger is crafted to accentuate timeless grace. Refer to our imperial sizing charts below to discover your bespoke silhouette.
          </p>
        </div>

        {/* Women's Ethnic & Western Wear Table */}
        <div className="bg-white border border-[#D4AF37]/25 p-6 md:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/15">
            <Ruler className="w-5 h-5 text-[#D4AF37] stroke-[1.5]" />
            <h2 className="font-serif text-xl text-[#2C1810] tracking-wide uppercase">
              Women&apos;s Apparel (Kurtas, Sets & Lehengas)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#2C1810] uppercase tracking-wider text-[10px] font-bold bg-[#FDFBF7]">
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Standard (India)</th>
                  <th className="py-3 px-4">Bust (Inches)</th>
                  <th className="py-3 px-4">Waist (Inches)</th>
                  <th className="py-3 px-4">Hip (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10 text-[#7A6B5D]">
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">XS</td>
                  <td className="py-3.5 px-4">34</td>
                  <td className="py-3.5 px-4">32 - 34&quot;</td>
                  <td className="py-3.5 px-4">26 - 28&quot;</td>
                  <td className="py-3.5 px-4">35 - 37&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">S</td>
                  <td className="py-3.5 px-4">36</td>
                  <td className="py-3.5 px-4">34 - 36&quot;</td>
                  <td className="py-3.5 px-4">28 - 30&quot;</td>
                  <td className="py-3.5 px-4">37 - 39&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">M</td>
                  <td className="py-3.5 px-4">38</td>
                  <td className="py-3.5 px-4">36 - 38&quot;</td>
                  <td className="py-3.5 px-4">30 - 32&quot;</td>
                  <td className="py-3.5 px-4">39 - 41&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">L</td>
                  <td className="py-3.5 px-4">40</td>
                  <td className="py-3.5 px-4">38 - 40&quot;</td>
                  <td className="py-3.5 px-4">32 - 34&quot;</td>
                  <td className="py-3.5 px-4">41 - 43&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">XL</td>
                  <td className="py-3.5 px-4">42</td>
                  <td className="py-3.5 px-4">40 - 42&quot;</td>
                  <td className="py-3.5 px-4">34 - 36&quot;</td>
                  <td className="py-3.5 px-4">43 - 45&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2C1810]">XXL</td>
                  <td className="py-3.5 px-4">44</td>
                  <td className="py-3.5 px-4">42 - 44&quot;</td>
                  <td className="py-3.5 px-4">36 - 38&quot;</td>
                  <td className="py-3.5 px-4">45 - 47&quot;</td>
                </tr>
                <tr className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#D4AF37]">Free Size</td>
                  <td className="py-3.5 px-4">Universal</td>
                  <td className="py-3.5 px-4">34 - 42&quot;</td>
                  <td className="py-3.5 px-4">28 - 36&quot;</td>
                  <td className="py-3.5 px-4">Relaxed / Flowing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#D4AF37]/20 p-6 text-center">
            <span className="font-serif text-2xl text-[#D4AF37] block mb-2 font-normal">01. Bust</span>
            <p className="font-sans text-xs text-[#7A6B5D] leading-relaxed">
              Measure under your arms around the fullest part of your bust, keeping the measuring tape parallel to the floor.
            </p>
          </div>
          <div className="bg-white border border-[#D4AF37]/20 p-6 text-center">
            <span className="font-serif text-2xl text-[#D4AF37] block mb-2 font-normal">02. Waist</span>
            <p className="font-sans text-xs text-[#7A6B5D] leading-relaxed">
              Measure around your natural waistline, typically the narrowest point of your torso, keeping one finger between tape and body.
            </p>
          </div>
          <div className="bg-white border border-[#D4AF37]/20 p-6 text-center">
            <span className="font-serif text-2xl text-[#D4AF37] block mb-2 font-normal">03. Hips</span>
            <p className="font-sans text-xs text-[#7A6B5D] leading-relaxed">
              Stand with your feet together and measure around the fullest part of your hips and bottom.
            </p>
          </div>
        </div>

        {/* Custom Alterations & Concierge Card */}
        <div className="bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#FDFBF7] p-8 md:p-12 border border-[#D4AF37]/35 text-center shadow-lg">
          <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-4 stroke-[1.5]" />
          <h3 className="font-serif text-2xl md:text-3xl tracking-wide uppercase mb-3">
            Custom Alterations & Styling
          </h3>
          <p className="font-sans text-xs md:text-sm text-[#B89E8A] max-w-lg mx-auto leading-relaxed mb-6">
            Looking for made-to-measure tailoring or need sizing assistance for a special wedding edit? Connect with our master concierge directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919999167840"
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#2C1810] px-7 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call: +91 9999167840
            </a>
            <a
              href="https://wa.me/919999167840?text=Hi%20Hanger%20Team,%20I%20need%20assistance%20with%20sizing%20and%20fit."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-7 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
            >
              WhatsApp Styling Concierge
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
