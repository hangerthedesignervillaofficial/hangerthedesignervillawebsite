"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";

export function Footer() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const { data: menuData = [] } = useNavigationMenu();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email."); return; }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, status: "subscribed" }]);
      if (error?.code === "23505") toast.info("You are already subscribed!");
      else if (error) throw error;
      else { toast.success("Thank you for subscribing to Hanger!"); setEmail(""); }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const YEAR = new Date().getFullYear();

  return (
    <footer className="bg-[#F9F6F1] border-t border-[#C9A962]/18">

      {/* ── NEWSLETTER BAND ── */}
      <div className="border-b border-[#C9A962]/15 py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] block mb-4">
              STAY IN THE LOOP
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-3">
              Enter the Hanger World
            </h3>
            {/* diamond */}
            <span className="inline-block w-1.5 h-1.5 bg-[#C9A962] rotate-45 mb-5" />
            <p className="font-sans text-[12px] text-[#7A7A7A] font-light tracking-wide leading-relaxed mb-8 max-w-md mx-auto">
              Be the first to discover new collections, private edits and exclusive releases.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-stretch gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={loading}
                className="
                  flex-1 bg-transparent border-b border-[#C9A962]/40
                  focus:border-[#C9A962] outline-none
                  font-sans text-[12px] text-[#1A1A1A] placeholder:text-[#7A7A7A]/60
                  tracking-wide py-2.5 text-center sm:text-left
                  transition-colors duration-300
                "
              />
              <button
                type="submit"
                disabled={loading}
                className="
                  sm:shrink-0 h-11 px-8
                  bg-[#1A1A1A] text-[#C9A962]
                  font-sans text-[10px] font-bold tracking-[0.22em] uppercase
                  hover:bg-[#C9A962] hover:text-white
                  transition-all duration-300
                  disabled:opacity-60 flex items-center justify-center
                "
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "SUBSCRIBE"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── LINKS + BRAND ── */}
      <div className="container mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-10">

          {/* Brand */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <img src="/images/logo-icon.png" alt="" className="h-11 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[19px] font-bold tracking-[0.22em] text-[#1A1A1A] uppercase">HANGER</span>
                <span className="font-sans text-[6.5px] uppercase tracking-[0.3em] text-[#C9A962] font-semibold mt-[3px]">THE DESIGNER VILLA</span>
              </div>
            </Link>
            <p className="font-sans text-[12px] text-[#7A7A7A] font-light leading-[1.8] max-w-[260px] mb-7">
              Quiet luxury, timeless Indian elegance. Every piece designed to be worn and remembered.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              <a href="https://www.instagram.com/hanger_thedesignervilla" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[#C9A962]/25 flex items-center justify-center text-[#1A1A1A] hover:border-[#C9A962] hover:text-[#C9A962] transition-all duration-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <button aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-[#C9A962]/25 flex items-center justify-center text-[#1A1A1A] hover:border-[#C9A962] hover:text-[#C9A962] transition-all duration-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-[#1A1A1A] mb-6">Shop</h4>
            <ul className="space-y-4">
              {menuData.map(item => (
                <li key={item.category.id}>
                  <Link
                    href={
                      item.category.id === -1 ? "/new-arrivals" :
                      item.category.id === -2 ? "/bestsellers" :
                      `/category/${item.category.id}`
                    }
                    className="font-sans text-[12px] text-[#7A7A7A] hover:text-[#C9A962] transition-colors tracking-wide"
                  >
                    {item.category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-[#1A1A1A] mb-6">Help</h4>
            <ul className="space-y-4">
              {[
                { label: "Contact Us", href: "/help/contact" },
                { label: "Shipping",   href: "/help/shipping" },
                { label: "Returns",    href: "/help/returns" },
                { label: "Size Guide", href: "/help/size-guide" },
                { label: "FAQs",       href: "/help/faq" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-[12px] text-[#7A7A7A] hover:text-[#C9A962] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-[#1A1A1A] mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: "Our Story",      href: "/about" },
                { label: "Privacy Policy", href: "/policies/privacy" },
                { label: "Terms",          href: "/policies/privacy" },
                { label: "Refund Policy",  href: "/help/returns" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-[12px] text-[#7A7A7A] hover:text-[#C9A962] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── COPYRIGHT ── */}
      <div className="border-t border-[#C9A962]/12 py-6">
        <div className="container mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[10px] text-[#7A7A7A] tracking-widest uppercase">
            &copy; {YEAR} Hanger The Designer Villa
          </p>
          <div className="flex items-center gap-3">
            {["VISA", "MC", "AMEX", "UPI"].map(m => (
              <span key={m} className="font-sans text-[9px] font-bold text-[#7A7A7A]/60 tracking-wider">{m}</span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
