"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: menuData = [] } = useNavigationMenu();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, status: 'subscribed' }]);
        
      if (error) {
        if (error.code === '23505') {
          toast.info("You are already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        toast.success("Thank you for subscribing to Hanger!");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#FDFBF7] pt-20 md:pt-28 pb-8 border-t border-[#D4AF37]/10 relative overflow-hidden">
      {/* Subtle top background gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FFFDFC] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Newsletter Section - Redesigned into a Compact Luxury Invite Card */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-20 p-5 md:p-14 bg-gradient-to-br from-[#FFFDFC] to-[#FDFBF7] border border-[#D4AF37]/30 shadow-[0_10px_40px_rgba(212,175,55,0.05)] relative overflow-hidden">
          {/* Decorative inner gold border */}
          <div className="absolute inset-2 md:inset-3 border border-[#D4AF37]/10 pointer-events-none" />
          
          <h2 className="font-serif text-base sm:text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.25em] text-[#2C1810] uppercase mb-3 md:mb-4 relative z-10" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            ENTER THE HANGER WORLD
          </h2>
          
          {/* Gold diamond dot separator */}
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45 mx-auto mb-4 md:mb-6 relative z-10" />
          
          <p className="font-sans text-[10px] md:text-xs tracking-widest text-[#7A6B5D] font-light max-w-md mx-auto mb-6 md:mb-10 leading-relaxed relative z-10">
            Be the first to discover new collections, private edits and special releases.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6 max-w-lg mx-auto relative z-10 w-full px-1">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL ADDRESS" 
              className="w-full bg-transparent border-b border-[#D4AF37]/40 focus:border-[#D4AF37] outline-none h-10 md:h-11 font-sans text-[11px] md:text-[10px] tracking-[0.2em] px-0 text-[#2C1810] placeholder:text-[#7A6B5D]/60 transition-all duration-350 text-left"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto h-11 md:h-11 px-8 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] border border-[#D4AF37]/25 font-sans text-[10px] md:text-[9px] font-bold tracking-[0.25em] uppercase transition-all duration-300 active:scale-95 shadow-md flex-shrink-0 cursor-pointer disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "SUBSCRIBE"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-[1px] w-full bg-gray-200 mb-12" />

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4 mb-12 border-t border-[#D4AF37]/10 pt-10">
          {/* Brand Column */}
          <div className="col-span-12 md:col-span-3 flex flex-col items-start text-left">
            <Link href="/" className="flex items-center gap-4 mb-8 md:mb-6 group">
              <img 
                src="/images/logo-icon.png" 
                alt="HANGER" 
                className="h-12 md:h-11 w-auto object-contain dark:invert group-active:scale-95 transition-transform duration-350"
              />
              <div className="flex flex-col items-start text-left">
                <h1 className="font-serif text-[20px] md:text-lg font-bold tracking-[0.25em] text-[#2C1810] dark:text-[#FFF8F0] uppercase leading-none" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  HANGER
                </h1>
                <span className="font-sans text-[7px] md:text-[6px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold mt-1 md:mt-[3px]">
                  THE DESIGNER VILLA
                </span>
              </div>
            </Link>
            <div className="flex gap-4 md:gap-3.5 justify-start w-full">
              <button
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/25 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-pointer bg-transparent"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <a
                href="https://www.instagram.com/hanger_thedesignervilla"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/25 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-pointer bg-transparent"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <button
                aria-label="Youtube"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/25 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-pointer bg-transparent"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </button>
              <button
                aria-label="Twitter"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/25 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-pointer bg-transparent"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Link Columns */}
          <div className="col-span-12 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-left border-t border-[#D4AF37]/10 md:border-0 pt-10 md:pt-0 mt-2 md:mt-0">
            <div>
              <h4 className="font-sans text-[11px] md:text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-5 md:mb-4 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-4 after:h-px after:bg-[#D4AF37]/50">Shop</h4>
              <ul className="space-y-3 md:space-y-2">
                {menuData.map((item) => (
                  <li key={item.category.id}>
                    <Link 
                      href={
                        item.category.id === -1 ? "/new-arrivals" :
                        item.category.id === -2 ? "/bestsellers" :
                        `/category/${item.category.id}`
                      } 
                      className="font-sans text-[11.5px] md:text-[9.5px] text-[#7A6B5D] hover:text-[#D4AF37] transition-all tracking-wide uppercase"
                    >
                      {item.category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-[11px] md:text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-5 md:mb-4 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-4 after:h-px after:bg-[#D4AF37]/50">Help</h4>
              <ul className="space-y-3 md:space-y-2">
                {[
                  { label: 'Contact Us', href: '/help/contact' },
                  { label: 'Shipping', href: '/help/shipping' },
                  { label: 'Returns', href: '/help/returns' },
                  { label: 'Size Guide', href: '/help/size-guide' },
                  { label: 'FAQs', href: '/help/faq' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="font-sans text-[10px] text-[#7A6B5D] hover:text-[#D4AF37] transition-colors duration-500">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-[11px] md:text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-5 md:mb-4 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-4 after:h-px after:bg-[#D4AF37]/50">About</h4>
              <ul className="space-y-3 md:space-y-2">
                {[
                  { label: 'Our Story', href: '/about' },
                  { label: 'Careers', href: '/about' },
                  { label: 'Instagram', href: 'https://www.instagram.com/hanger_thedesignervilla' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      href={item.href} 
                      target={item.label === 'Instagram' ? '_blank' : undefined}
                      className="font-sans text-[10px] text-[#7A6B5D] hover:text-[#D4AF37] transition-colors duration-500"
                    >
                      {item.label === 'Instagram' ? '@hanger_thedesignervilla' : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-[11px] md:text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-5 md:mb-4 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-4 after:h-px after:bg-[#D4AF37]/50">Policies</h4>
              <ul className="space-y-3 md:space-y-2">
                {[
                  { label: 'Privacy Policy', href: '/policies/privacy' },
                  { label: 'Terms', href: '/policies/privacy' },
                  { label: 'Refund Policy', href: '/help/returns' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="font-sans text-[10px] text-[#7A6B5D] hover:text-[#D4AF37] transition-colors duration-500">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="col-span-12 md:col-span-3 text-left md:text-right flex flex-col items-start md:items-end gap-3 mt-8 md:mt-0 pt-8 md:pt-0 border-t border-[#D4AF37]/10 md:border-0">
            <h4 className="font-sans text-[10px] md:text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase mb-1 md:mb-2">We Accept</h4>
            <div className="flex items-center justify-start md:justify-end gap-2 text-[6px] md:text-[6px] font-sans font-bold tracking-wider text-gray-400">
              <div className="w-8 h-5 border border-gray-200/60 flex items-center justify-center bg-white rounded-sm text-[#1A1F71]">VISA</div>
              <div className="w-8 h-5 border border-gray-200/60 flex items-center justify-center bg-white rounded-sm text-[#EB001B]">MC</div>
              <div className="w-8 h-5 border border-gray-200/60 flex items-center justify-center bg-white rounded-sm text-[#0070CD]">AMEX</div>
              <div className="w-8 h-5 border border-gray-200/60 flex items-center justify-center bg-white rounded-sm text-[#003087]">PAYPAL</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-[#D4AF37]/10 mt-8">
          <p className="font-sans text-[9px] text-[#7A6B5D] tracking-widest uppercase">
            &copy; HANGER THE DESIGNER VILLA
          </p>
        </div>

      </div>
    </footer>
  );
}
