"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Search,
  Heart,
  User,
  Package,
  Phone,
  ShieldCheck,
  LogOut,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar as ShadcnSidebar, SidebarContent } from "@/components/ui/sidebar";
import { useNavigationBuilder } from "@/hooks/useNavigationBuilder";

// Instagram Icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const { navItems, loading } = useNavigationBuilder();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleClose = () => { if (isMobile) toggleSidebar(); };

  const discoverLinks = [
    { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
    { label: "Best Sellers", href: "/bestsellers", icon: Star },
    { label: "All Products", href: "/products", icon: ArrowRight },
  ];

  const accountLinks = [
    { label: "My Account", href: user ? "/profile" : "/signin", icon: User },
    { label: "My Orders", href: "/dashboard", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Contact Us", href: "/contact", icon: Phone },
  ];

  return (
    <ShadcnSidebar
      collapsible="offcanvas"
      className="z-[80] border-r-0 font-sans"
      style={{ "--sidebar-background": "#0F0A06", "--sidebar-border": "transparent" } as React.CSSProperties}
    >
      <SidebarContent className="relative bg-[#0F0A06] text-white flex flex-col h-[100dvh] overflow-y-auto scrollbar-none select-none">

        {/* ── TOP BAR ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/5">
          <Link href="/" onClick={handleClose} className="flex items-center gap-3 group">
            <img src="/images/logo-icon.png" alt="HANGER" className="h-9 w-auto object-contain brightness-0 invert" />
            <div>
              <div className="font-serif text-[18px] font-bold tracking-[0.25em] text-white uppercase leading-none" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                HANGER
              </div>
              <div className="text-[7px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mt-[3px]">
                THE DESIGNER VILLA
              </div>
            </div>
          </Link>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* ── SEARCH BAR ──────────────────────────────── */}
        <div className="px-6 pt-5 pb-2">
          <button
            onClick={() => setShowSearch(s => !s)}
            className="flex items-center gap-2.5 w-full text-white/50 hover:text-white transition-colors cursor-pointer group"
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase">Search</span>
          </button>
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3"
              >
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`; handleClose(); }}}>
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-white/10 border border-white/15 rounded-none px-4 py-3 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-[1px] bg-white/5 mx-6 my-4" />

        {/* ── SHOP BY CATEGORY ─────────────────────────── */}
        <div className="px-6">
          <div className="text-[8px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-4">Shop</div>
          <nav className="flex flex-col gap-1">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              const isExpanded = expandedItem === item.id;

              return (
                <div key={item.id} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center justify-between py-3 cursor-pointer border-b transition-all duration-200",
                      isActive
                        ? "border-[#D4AF37]/30 text-[#D4AF37]"
                        : "border-white/5 text-white hover:text-[#D4AF37]"
                    )}
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.hasSub) { e.preventDefault(); setExpandedItem(isExpanded ? null : item.id); }
                        else handleClose();
                      }}
                      className="font-serif text-[20px] tracking-wide uppercase leading-none flex-1"
                      style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                    >
                      {item.title}
                    </Link>
                    {item.hasSub && (
                      <ChevronDown className={cn("w-4 h-4 text-[#D4AF37] transition-transform duration-300 flex-shrink-0", isExpanded && "rotate-180")} />
                    )}
                  </div>

                  {/* Sub-items (products) */}
                  <AnimatePresence>
                    {item.hasSub && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="py-3 pl-2 flex flex-col gap-2 border-b border-white/5">
                          {item.subItems?.slice(0, 5).map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={handleClose}
                              className="flex items-center gap-3 group py-1.5"
                            >
                              <div className="w-1 h-1 bg-[#D4AF37] rounded-full flex-shrink-0" />
                              <span className="font-sans text-[11px] tracking-[0.1em] text-white/60 group-hover:text-[#D4AF37] uppercase transition-colors duration-200">
                                {sub.title}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href={item.href}
                            onClick={handleClose}
                            className="mt-1 font-sans text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase flex items-center gap-1.5 hover:gap-3 transition-all duration-200"
                          >
                            View All <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="h-[1px] bg-white/5 mx-6 my-5" />

        {/* ── DISCOVER ────────────────────────────────── */}
        <div className="px-6">
          <div className="text-[8px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-4">Discover</div>
          <nav className="flex flex-col gap-1">
            {discoverLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center justify-between py-3 border-b border-white/5 group transition-colors duration-200",
                    pathname === item.href ? "text-[#D4AF37]" : "text-white/70 hover:text-white"
                  )}
                >
                  <span className="font-sans text-[13px] tracking-[0.12em] uppercase">{item.label}</span>
                  <Icon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="h-[1px] bg-white/5 mx-6 my-5" />

        {/* ── ACCOUNT ─────────────────────────────────── */}
        <div className="px-6">
          <div className="text-[8px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-4">Account</div>
          <nav className="flex flex-col gap-1">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="flex items-center gap-3.5 py-2.5 text-white/60 hover:text-white transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
                  <span className="font-sans text-[11px] tracking-[0.15em] uppercase">{item.label}</span>
                </Link>
              );
            })}

            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={handleClose}
                className="flex items-center gap-3.5 py-2.5 text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors duration-200 mt-1"
              >
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                <span className="font-sans text-[11px] tracking-[0.15em] uppercase font-bold">Admin Dashboard</span>
              </Link>
            )}

            {user && (
              <button
                onClick={() => { signOut(); handleClose(); }}
                className="flex items-center gap-3.5 py-2.5 text-red-400/70 hover:text-red-400 transition-colors duration-200 mt-1 cursor-pointer w-full text-left"
              >
                <LogOut className="w-4 h-4 stroke-[1.5]" />
                <span className="font-sans text-[11px] tracking-[0.15em] uppercase">Sign Out</span>
              </button>
            )}
          </nav>
        </div>

        {/* ── FOOTER ──────────────────────────────────── */}
        <div className="mt-auto px-6 py-8 border-t border-white/5">
          <p className="font-serif italic text-[15px] text-[#D4AF37]/70 mb-4 text-center" style={{ fontFamily: "Georgia, serif" }}>
            Let&apos;s stay connected ♡
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <a href="https://www.instagram.com/hanger_thedesignervilla" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D4AF37] text-[8px]">◆</span>
            <p className="font-sans text-[7px] font-bold tracking-[0.3em] text-white/30 uppercase">HANGER – THE DESIGNER VILLA</p>
            <span className="text-[#D4AF37] text-[8px]">◆</span>
          </div>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
