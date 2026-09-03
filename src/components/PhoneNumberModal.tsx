"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";

export function PhoneNumberModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);

  useEffect(() => {
    // Check if user is logged in, hasn't skipped, and doesn't have a phone number yet
    const checkUserPhone = async () => {
      if (!user || hasSkipped) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone")
          .eq("profile_id", user.id)
          .single();

        if (profile && !profile.phone) {
          // Delay opening slightly for a smoother UX after login
          setTimeout(() => setIsOpen(true), 1500);
        }
      } catch (error) {
        console.error("Error checking user phone:", error);
      }
    };

    checkUserPhone();
  }, [user, hasSkipped]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;

    setIsSubmitting(true);
    try {
      await supabase
        .from("profiles")
        .update({ phone })
        .eq("profile_id", user?.id);
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating phone:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setHasSkipped(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0A0505]/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#FDFBF7] shadow-2xl border border-[#D4AF37]/30 overflow-hidden animate-in zoom-in-95 duration-400 ease-out">
        
        {/* Luxury Gold Accent Top */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20" />
        
        {/* Close Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-[#7A6B5D] hover:text-[#4A0E17] hover:rotate-90 transition-all duration-300 cursor-pointer"
        >
          <X size={20} className="stroke-[1.5]" />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 
              className="font-serif text-2xl text-[#2C1810] mb-2 tracking-wide"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Complete Your Profile
            </h2>
            <p className="font-sans text-xs text-[#7A6B5D] tracking-wide leading-relaxed">
              Add your phone number for seamless order tracking and exclusive luxury updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative pt-4">
              <div className="flex items-center border-b border-[#D4AF37]/30 focus-within:border-[#D4AF37] transition-colors h-10 group">
                <span className="font-sans text-sm text-[#7A6B5D] pr-3 border-r border-[#D4AF37]/20 mr-4 select-none group-focus-within:text-[#D4AF37] transition-colors">
                  +91
                </span>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="peer flex-1 bg-transparent outline-none font-sans text-lg tracking-[0.1em] text-[#2C1810]"
                  autoFocus
                />
                <label 
                  htmlFor="modal-phone" 
                  className="absolute left-12 top-0 text-[10px] text-[#7A6B5D] font-sans uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/50 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#D4AF37] pointer-events-none"
                >
                  Phone Number
                </label>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                type="submit" 
                disabled={isSubmitting || phone.length < 10}
                className="w-full bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white rounded-none h-12 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-[#D4AF37]/20 cursor-pointer"
              >
                {isSubmitting ? "SAVING..." : "SAVE & CONTINUE"}
              </Button>
              
              <button 
                type="button" 
                onClick={handleSkip}
                className="w-full bg-transparent text-[#7A6B5D] hover:text-[#2C1810] h-10 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                SKIP FOR NOW
              </button>
            </div>
          </form>
        </div>
        
        {/* Subtle Bottom Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[url('/images/pattern.svg')] opacity-[0.03]" />
      </div>
    </div>
  );
}
