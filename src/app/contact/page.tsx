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
                    <p className="text-[#2C1810]">123 Luxury Avenue<br />Design District<br />Mumbai, 400001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/30 flex flex-shrink-0 items-center justify-center text-[#D4AF37]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-2">Phone</h3>
                    <p className="text-[#2C1810]">+91 98765 43210</p>
                    <p className="text-[#7A6B5D] text-sm mt-1">Mon-Sat, 10am to 7pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/30 flex flex-shrink-0 items-center justify-center text-[#D4AF37]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-2">Email</h3>
                    <p className="text-[#2C1810]">hangerthedesignervillaofficial@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-[4/3] relative w-full bg-[#f4f0ea] border border-[#D4AF37]/20">
               <div className="absolute inset-0 flex items-center justify-center">
                 <p className="font-serif text-[#7A6B5D]/50 text-xl italic">Google Map Integration</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
