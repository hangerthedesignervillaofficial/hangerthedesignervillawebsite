import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Hanger The Designer Villa",
  description: "Get in touch with our stylists and customer care team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Customer Care
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Get in <span className="italic font-light">Touch</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-xl mx-auto leading-relaxed">
            Our private styling team and customer care associates are available to assist you with inquiries, styling advice, and orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-8 border-b border-[#D4AF37]/20 pb-4">
              Send an Inquiry
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] transition-colors resize-none" />
              </div>
              <button type="button" className="w-full bg-[#2C1810] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase py-4 hover:bg-[#4A0E17] hover:text-white transition-all duration-300 mt-4">
                Submit Inquiry
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-12">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <Mail className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-2">Email Us</h3>
                <p className="font-sans text-sm text-[#7A6B5D] mb-1">For general inquiries and styling advice.</p>
                <a href="mailto:care@hangerthedesignervilla.com" className="font-sans text-[11px] font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors">
                  care@hangerthedesignervilla.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <Phone className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-2">Call Us</h3>
                <p className="font-sans text-sm text-[#7A6B5D] mb-1">Available Mon - Sat, 11:00 AM - 8:00 PM.</p>
                <a href="tel:+919876543210" className="font-sans text-[11px] font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <MapPin className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-2">The Villa</h3>
                <p className="font-sans text-sm text-[#7A6B5D] mb-2 leading-relaxed">
                  123 Luxury Avenue<br/>
                  Fashion District, 110001<br/>
                  New Delhi, India
                </p>
                <p className="font-sans text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
                  By Appointment Only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
