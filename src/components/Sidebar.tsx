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
import { useNavigationBuilder } from "@/hooks/useNavigationBuilder";
import { SidebarCategoryProducts } from "./SidebarCategoryProducts";
import { HangerLogo } from "@/components/HangerLogo";

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
  const { openMobile, setOpenMobile } = useSidebar();
  const { navItems, loading } = useNavigationBuilder();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Default expand first category for user
  useEffect(() => {
    if (navItems.length > 0 && !expandedItem && !hasManuallyToggled) {
      const firstWithSubs = navItems.find((item) => item.hasSub && item.subItems && item.subItems.length > 0) || navItems[0];
      if (firstWithSubs) {
        setExpandedItem(firstWithSubs.id);
      }
    }
  }, [navItems, expandedItem, hasManuallyToggled]);

  // Auto-close on route change
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMobile(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpenMobile]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (openMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  if (!mounted) return null;

  const handleClose = () => {
    setOpenMobile(false);
  };

  const discoverLinks = [
    { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
    { label: "Best Sellers", href: "/bestsellers", icon: Star },
    { label: "All Products", href: "/products", icon: ArrowRight },
    { label: "Our Story", href: "/about", icon: Sparkles },
    { label: "Contact Us", href: "/help/contact", icon: Phone },
  ];

  const accountLinks = [
    { label: "My Account", href: user ? "/profile" : "/signin", icon: User },
    { label: "My Orders", href: user ? "/profile?tab=orders" : "/signin", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Contact Us", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {openMobile && (
        <div className="xl:hidden fixed inset-0 z-[100] flex pointer-events-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-[340px] max-w-[85vw] h-full bg-[#FDFBF7] shadow-2xl flex flex-col z-10 overflow-y-auto scrollbar-none select-none text-[#2C1810]"
          >
        
        {/* ── HEADER: Brand + Close ────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-[#2C1810]/8">
          <Link href="/" onClick={handleClose} className="flex items-center gap-3 group">
            <HangerLogo className="h-9 w-auto transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-serif text-[15px] font-bold tracking-[0.25em] text-[#2C1810] uppercase leading-none" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                HANGER
              </span>
              <span className="font-sans text-[6px] tracking-[0.4em] text-[#D4AF37] uppercase font-bold mt-1">
                THE DESIGNER VILLA
              </span>
            </div>
          </Link>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center text-[#2C1810]/40 hover:text-[#2C1810] hover:bg-[#2C1810]/5 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[1.2]" />
          </button>
        </div>

        {/* ── SEARCH BAR ──────────────────────────────── */}
        <div className="px-6 pt-5 pb-2">
          <button
            onClick={() => setShowSearch(s => !s)}
            className="flex items-center gap-2.5 w-full text-[#2C1810]/50 hover:text-[#2C1810] transition-colors cursor-pointer group"
          >
            <Search className="w-4 h-4 flex-shrink-0 stroke-[1.5]" />
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium">Search</span>
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
                    className="w-full bg-transparent border-b border-[#2C1810]/20 rounded-none px-2 py-3 text-[12px] text-[#2C1810] placeholder-[#2C1810]/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-[1px] bg-[#2C1810]/5 mx-6 my-4" />

        {/* ── SHOP BY CATEGORY ─────────────────────────── */}
        <div className="px-6">
          <div className="text-[8px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-4">Shop Collections</div>
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
                      "flex items-center justify-between py-3 border-b border-[#2C1810]/5 cursor-pointer transition-all duration-200 group",
                      isActive
                        ? "text-[#D4AF37]"
                        : "text-[#2C1810]/70 hover:text-[#2C1810]"
                    )}
                    onClick={() => {
                      setHasManuallyToggled(true);
                      setExpandedItem(isExpanded ? null : item.id);
                      setExpandedSubCategory(null);
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                         if (item.hasSub) { 
                           e.preventDefault(); 
                           setHasManuallyToggled(true);
                           setExpandedItem(isExpanded ? null : item.id);
                           setExpandedSubCategory(null);
                         } else {
                           handleClose();
                         }
                      }}
                      className="font-sans text-[13px] font-medium tracking-[0.12em] uppercase flex-1"
                    >
                      {item.title}
                    </Link>
                    {item.hasSub && (
                      <ChevronDown className={cn("w-3.5 h-3.5 text-[#2C1810]/40 group-hover:text-[#D4AF37] transition-all duration-300 flex-shrink-0", isExpanded && "rotate-180 text-[#D4AF37]")} />
                    )}
                  </div>

                  {/* Sub-items (Subcategories & Product Cards) */}
                  <AnimatePresence>
                    {item.hasSub && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {item.subItems && item.subItems.length > 0 ? (
                          <div className="pt-2 pb-3 pl-3 flex flex-col gap-1 relative before:absolute before:left-1.5 before:top-2 before:bottom-3 before:w-[1px] before:bg-[#D4AF37]/25">
                            {/* All Category Products Option */}
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between py-1.5 pr-2 group">
                                <Link
                                  href={item.href}
                                  onClick={handleClose}
                                  className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#D4AF37] hover:text-[#2C1810] transition-colors"
                                >
                                  All {item.title}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedSubCategory(
                                      expandedSubCategory === `all-${item.id}`
                                        ? null
                                        : `all-${item.id}`
                                    )
                                  }
                                  className="p-1 text-[#D4AF37] hover:text-[#2C1810] transition-colors cursor-pointer"
                                  aria-label="Toggle all products"
                                >
                                  <ChevronDown
                                    className={cn(
                                      "w-3 h-3 transition-transform duration-200",
                                      expandedSubCategory === `all-${item.id}` && "rotate-180"
                                    )}
                                  />
                                </button>
                              </div>
                              <AnimatePresence>
                                {expandedSubCategory === `all-${item.id}` && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <SidebarCategoryProducts
                                      categoryId={item.id}
                                      handleClose={handleClose}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Child Subcategories */}
                            {item.subItems.map((sub: any) => {
                              const isSubOpen = expandedSubCategory === sub.id;

                              return (
                                <div key={sub.id} className="flex flex-col">
                                  <div
                                    className="flex items-center justify-between py-1.5 pr-2 group cursor-pointer"
                                    onClick={() =>
                                      setExpandedSubCategory(isSubOpen ? null : sub.id)
                                    }
                                  >
                                    <Link
                                      href={sub.href}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                      }}
                                      className="font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-[#2C1810]/80 group-hover:text-[#D4AF37] transition-colors flex-1"
                                    >
                                      {sub.title}
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedSubCategory(isSubOpen ? null : sub.id);
                                      }}
                                      className="p-1 text-[#2C1810]/40 group-hover:text-[#D4AF37] transition-colors cursor-pointer"
                                      aria-label={`Show ${sub.title} items`}
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "w-3 h-3 transition-transform duration-200",
                                          isSubOpen && "rotate-180 text-[#D4AF37]"
                                        )}
                                      />
                                    </button>
                                  </div>

                                  <AnimatePresence>
                                    {isSubOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <SidebarCategoryProducts
                                          subCategoryId={sub.id}
                                          handleClose={handleClose}
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <SidebarCategoryProducts
                            categoryId={item.id}
                            handleClose={handleClose}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="h-[1px] bg-[#2C1810]/5 mx-6 my-5" />

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
                    "flex items-center justify-between py-3 border-b border-[#2C1810]/5 group transition-colors duration-200",
                    pathname === item.href ? "text-[#D4AF37]" : "text-[#2C1810]/70 hover:text-[#2C1810]"
                  )}
                >
                  <span className="font-sans text-[13px] font-medium tracking-[0.12em] uppercase">{item.label}</span>
                  <Icon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 stroke-[1.5] transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="h-[1px] bg-[#2C1810]/5 mx-6 my-5" />

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
                  className="flex items-center gap-3.5 py-2.5 text-[#2C1810]/60 hover:text-[#2C1810] transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
                  <span className="font-sans text-[11px] font-medium tracking-[0.15em] uppercase">{item.label}</span>
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
                className="flex items-center gap-3.5 py-2.5 text-red-700/70 hover:text-red-700 transition-colors duration-200 mt-1 cursor-pointer w-full text-left"
              >
                <LogOut className="w-4 h-4 stroke-[1.5]" />
                <span className="font-sans text-[11px] tracking-[0.15em] uppercase font-medium">Sign Out</span>
              </button>
            )}
          </nav>
        </div>

        {/* ── FOOTER ──────────────────────────────────── */}
        <div className="mt-auto px-6 py-8 border-t border-[#2C1810]/5 bg-[#f4f0ea]/50">
          <p className="font-serif italic text-[14px] text-[#2C1810]/60 mb-4 text-center" style={{ fontFamily: "Georgia, serif" }}>
            Let&apos;s stay connected ♡
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <a href="https://www.instagram.com/hanger_thedesignervilla" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-full border border-[#2C1810]/15 flex items-center justify-center text-[#2C1810]/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D4AF37] text-[8px]">◆</span>
            <p className="font-sans text-[7px] font-bold tracking-[0.3em] text-[#2C1810]/40 uppercase">HANGER – THE DESIGNER VILLA</p>
            <span className="text-[#D4AF37] text-[8px]">◆</span>
          </div>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
