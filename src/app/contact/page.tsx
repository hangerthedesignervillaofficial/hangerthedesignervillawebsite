"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from('support_messages').insert({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'unread'
      });

      if (error) throw error;

      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ ...formData, message: "" });
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C1810] mb-4 tracking-wide" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
            Contact Us
          </h1>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
          <p className="text-[#7A6B5D] max-w-2xl mx-auto tracking-wide">
            We are here to assist you with any inquiries about our collections, sizing, or styling advice. 
            Our dedicated team ensures a seamless experience at The Designer Villa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
            
            <h2 className="font-serif text-2xl text-[#2C1810] mb-8" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
              Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="border-0 border-b border-[#D4AF37]/30 rounded-none bg-transparent px-0 focus-visible:ring-0 focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="border-0 border-b border-[#D4AF37]/30 rounded-none bg-transparent px-0 focus-visible:ring-0 focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="border border-[#D4AF37]/30 rounded-none bg-transparent focus-visible:ring-0 focus:border-[#D4AF37] min-h-[150px] resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white rounded-none h-14 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 mt-8"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-12 lg:pl-8">
            <div>
              <h2 className="font-serif text-2xl text-[#2C1810] mb-8" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                Visit The Villa
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/30 flex flex-shrink-0 items-center justify-center text-[#D4AF37]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-2">Boutique Address</h3>
                    <p className="text-[#2C1810] font-medium leading-relaxed">
                      GF-67/68, GROUND FLOOR,<br />
                      GLOBAL FOYER MALL, PALAM VIHAR,<br />
                      GURUGRAM, HARYANA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/30 flex flex-shrink-0 items-center justify-center text-[#D4AF37]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-2">Phone & WhatsApp</h3>
                    <a href="tel:+919999167840" className="text-[#2C1810] hover:text-[#D4AF37] font-bold text-base transition-colors">
                      +91 9999167840
                    </a>
                    <p className="text-[#7A6B5D] text-xs mt-1">Mon - Sun, 10:30 AM to 8:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/30 flex flex-shrink-0 items-center justify-center text-[#D4AF37]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-2">Email</h3>
                    <a href="mailto:hangerthedesignervillaofficial@gmail.com" className="text-[#2C1810] hover:text-[#D4AF37] transition-colors">
                      hangerthedesignervillaofficial@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative w-full bg-[#f4f0ea] border border-[#D4AF37]/30 shadow-md overflow-hidden flex flex-col">
              <div className="relative aspect-[16/11] w-full">
                <iframe
                  title="Hanger Flagship Boutique Location - Global Foyer Mall"
                  src="https://maps.google.com/maps?q=Global+Foyer+Mall,+Palam+Vihar,+Gurugram,+Haryana&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 bg-[#2C1810]/90 backdrop-blur-xs text-white border border-[#D4AF37]/40 px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <div>
                      <p className="font-serif text-[11px] font-bold tracking-wider text-[#D4AF37] uppercase">HANGER – THE DESIGNER VILLA</p>
                      <p className="font-sans text-[8px] text-[#FDFBF7]/80 tracking-wider">GF-67/68, Global Foyer Mall, Palam Vihar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFFDFC] border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-[10px] font-bold text-[#2C1810] uppercase tracking-wider">Plan Your Visit</p>
                  <p className="font-sans text-[9px] text-[#7A6B5D]">Palam Vihar, Gurugram • Free Valet & Mall Parking</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Global+Foyer+Mall+Palam+Vihar+Gurugram"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white px-5 py-2.5 font-sans text-[9px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/35 transition-all shadow-sm"
                >
                  <MapPin className="w-3 h-3" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
