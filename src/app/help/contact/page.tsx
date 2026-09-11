"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const finalSubject = subject.trim() || "General Inquiry";

      const { error } = await supabase.from("contact_messages").insert([
        {
          name: fullName,
          email: email.trim(),
          subject: finalSubject,
          message: message.trim(),
          status: "unread",
        },
      ]);

      if (error) {
        console.error("Failed to insert contact message:", error);
        throw error;
      }

      toast.success(
        "Your inquiry has been received! Our concierge will connect with you shortly.",
      );
      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      toast.error("Unable to send inquiry at this moment. Please try calling or messaging us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="font-sans text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Private Concierge & Support
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>
          <h1
            className="font-serif text-4xl md:text-5xl text-[#2C1810] uppercase tracking-[0.1em] mb-4"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Get in <span className="italic font-light">Touch</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-xl mx-auto leading-relaxed">
            Our private styling team and boutique associates are at your service for personal curation, sizing guidance, and bespoke orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />

            <h2 className="font-serif text-2xl text-[#2C1810] tracking-wide uppercase mb-2">
              Send an Inquiry
            </h2>
            <p className="font-sans text-xs text-[#7A6B5D] mb-8">
              Leave your details below and our personal stylist will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-[#2C1810]">
                  Thank You
                </h3>
                <p className="font-sans text-sm text-[#7A6B5D] max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been submitted directly to our boutique team. We look forward to assisting you.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-[#2C1810] text-[#D4AF37] px-6 py-2.5 font-sans text-[9px] font-bold tracking-widest uppercase hover:bg-[#4A0E17] transition-colors mt-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@domain.com"
                      className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Styling advice / Order status"
                      className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-[9px] font-bold tracking-widest text-[#7A6B5D] uppercase">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can assist you..."
                    className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-2 font-sans text-sm text-[#2C1810] placeholder:text-gray-300 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2C1810] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase py-4 hover:bg-[#4A0E17] hover:text-white transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <Mail className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-1">
                  Email Concierge
                </h3>
                <p className="font-sans text-xs text-[#7A6B5D] mb-1">
                  For boutique appointments and couture inquiries.
                </p>
                <a
                  href="mailto:hangerthedesignervillaofficial@gmail.com"
                  className="font-sans text-[11px] font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors"
                >
                  hangerthedesignervillaofficial@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <Phone className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-1">
                  Direct Line & WhatsApp
                </h3>
                <p className="font-sans text-xs text-[#7A6B5D] mb-1">
                  Mon - Sun, 10:30 AM - 8:30 PM IST.
                </p>
                <a
                  href="tel:+919999167840"
                  className="font-sans text-[12px] font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors block"
                >
                  +91 9999167840
                </a>
                <a
                  href="https://wa.me/919999167840?text=Hi%20Hanger%20The%20Designer%20Villa%20team,%20I%20need%20assistance."
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] font-sans font-bold tracking-widest text-[#7A6B5D] hover:text-[#D4AF37] uppercase underline mt-1 block"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                <MapPin className="h-5 w-5 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider mb-1">
                  Hanger The Designer Villa
                </h3>
                <p className="font-sans text-xs text-[#7A6B5D] mb-2 leading-relaxed">
                  GF-67/68, Ground Floor, Global Foyer Mall,<br />
                  Palam Vihar, Gurugram, Haryana
                </p>
                <p className="font-sans text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase">
                  Flagship Store Open 7 Days a Week (10:30 AM - 8:30 PM)
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
