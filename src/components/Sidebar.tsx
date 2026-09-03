"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Shirt,
  Sparkles,
  Star,
  Footprints,
  Gem,
  ShoppingBag,
  Search,
  Heart,
  User,
  Package,
  Phone,
  ChevronDown,
  X,
  FolderHeart,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar as ShadcnSidebar, SidebarContent } from "@/components/ui/sidebar";

// Instagram Icon SVG
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Facebook Icon SVG
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Pinterest Icon SVG
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.56 3.06 8.42 7.25 9.5-.09-.86-.17-2.18.03-3.12.19-.85 1.25-5.32 1.25-5.32s-.32-.64-.32-1.58c0-1.48.86-2.58 1.93-2.58.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.57 1.92 1.89 0 3.35-2 3.35-4.88 0-2.55-1.83-4.33-4.44-4.33-3.03 0-4.8 2.27-4.8 4.61 0 .92.35 1.9 0.79 2.43.09.1.1.17.07.27-.08.33-.26 1.05-.3 1.2-.05.21-.17.26-.38.16-1.4-.65-2.27-2.7-2.27-4.35 0-3.54 2.58-6.8 7.42-6.8 3.9 0 6.93 2.78 6.93 6.49 0 3.88-2.45 7-5.85 7-1.14 0-2.22-.59-2.59-1.28l-.7 2.68c-.25.98-.94 2.21-1.4 2.96C10.74 21.84 11.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

// Decorative Floral Line Art Watermarks
function TopRightFloral() {
  return (
    <svg
      className="absolute top-0 right-0 w-40 h-40 opacity-[0.22] text-[#B89547] pointer-events-none z-0"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M200,0 C150,50 120,100 80,120 M200,0 C120,30 80,80 50,140" />
      <path d="M160,20 Q130,10 120,40 Q150,50 160,20 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M130,45 Q100,35 90,65 Q120,75 130,45 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M100,75 Q70,65 60,95 Q90,105 100,75 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M180,40 Q150,60 140,90 Q170,80 180,40 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M140,85 Q110,105 100,135 Q130,125 140,85 Z" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

function BottomLeftFloral() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-40 h-40 opacity-[0.22] text-[#B89547] pointer-events-none z-0"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0,200 C50,150 80,100 120,80 M0,200 C80,170 120,120 150,60" />
      <path d="M40,180 Q70,190 80,160 Q50,150 40,180 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M70,155 Q100,165 110,135 Q80,125 70,155 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M100,125 Q130,135 140,105 Q110,95 100,125 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M20,160 Q50,140 60,110 Q30,120 20,160 Z" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleClose = () => {
    if (isMobile) toggleSidebar();
  };

  // Main navigation items from screenshot
  const primaryNav = [
    {
      title: "HOME",
      icon: Home,
      href: "/",
    },
    {
      title: "COLLECTIONS",
      icon: FolderHeart,
      href: "/products",
      hasSub: true,
      subItems: [
        { title: "ALL PRODUCTS", href: "/products" },
        { title: "NEW ARRIVALS", href: "/new-arrivals" },
        { title: "BEST SELLERS", href: "/bestsellers" },
      ],
    },
    {
      title: "NEW ARRIVALS",
      icon: Sparkles,
      href: "/new-arrivals",
    },
    {
      title: "BEST SELLERS",
      icon: Star,
      href: "/bestsellers",
    },
    {
      title: "CLOTHING",
      icon: Shirt,
      href: "/clothing",
      hasSub: true,
      subItems: [
        { title: "SAREES", href: "/clothing?sub=sarees" },
        { title: "LEHENGAS", href: "/clothing?sub=lehengas" },
        { title: "KURTAS & SUITS", href: "/clothing?sub=kurtas" },
        { title: "CO-ORD SETS", href: "/clothing?sub=coords" },
        { title: "DRESSES & GOWNS", href: "/clothing?sub=dresses" },
      ],
    },
    {
      title: "FOOTWEAR",
      icon: Footprints,
      href: "/footwear",
      hasSub: true,
      subItems: [
        { title: "ETHNIC JUTTIS", href: "/footwear?sub=juttis" },
        { title: "DESIGNER HEELS", href: "/footwear?sub=heels" },
        { title: "LUXURY FLATS", href: "/footwear?sub=flats" },
      ],
    },
    {
      title: "JEWELLERY",
      icon: Gem,
      href: "/jewellery",
      hasSub: true,
      subItems: [
        { title: "EARRINGS", href: "/jewellery?sub=earrings" },
        { title: "NECKLACES", href: "/jewellery?sub=necklaces" },
        { title: "BANGLES & BRACELETS", href: "/jewellery?sub=bangles" },
      ],
    },
    {
      title: "ACCESSORIES",
      icon: ShoppingBag,
      href: "/accessories",
      hasSub: true,
      subItems: [
        { title: "HANDBAGS & CLUTCHES", href: "/accessories?sub=bags" },
        { title: "DUPATTAS & SCARVES", href: "/accessories?sub=dupattas" },
        { title: "BELTS & PINKS", href: "/accessories?sub=belts" },
      ],
    },
  ];

  // Secondary items from screenshot
  const secondaryNav = [
    {
      title: "SEARCH",
      icon: Search,
      action: () => setIsSearchOpen((prev) => !prev),
    },
    {
      title: "WISHLIST",
      icon: Heart,
      href: "/wishlist",
    },
    {
      title: "MY ACCOUNT",
      icon: User,
      href: user ? "/profile" : "/signin",
    },
    {
      title: "ORDERS",
      icon: Package,
      href: "/dashboard",
    },
    {
      title: "CONTACT US",
      icon: Phone,
      href: "/contact",
    },
  ];

  return (
    <ShadcnSidebar
      collapsible="offcanvas"
      className="z-[80] border-r-0 font-sans"
      style={
        {
          "--sidebar-background": "#F7F2EC",
          "--sidebar-border": "transparent",
        } as React.CSSProperties
      }
    >
      <SidebarContent className="relative bg-[#F7F2EC] text-[#2C1810] flex flex-col justify-between h-[100dvh] overflow-y-auto scrollbar-none p-5 pb-16 sm:p-6 sm:pb-8 z-10 select-none">
        {/* Background Floral Watermarks */}
        <TopRightFloral />
        <BottomLeftFloral />

        <div className="relative z-10 flex flex-col w-full">
          {/* Top Left Circular Close Button */}
          <div className="flex items-center justify-between w-full mb-2">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-[#EFE6D9] hover:bg-[#E5D8C7] border border-[#E0D2C2]/60 flex items-center justify-center text-[#4A3E38] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Centered Brand Logo */}
          <div className="flex flex-col items-center text-center my-3">
            <Link href="/" onClick={handleClose} className="flex flex-col items-center group">
              <img
                src="/images/logo-icon.png"
                alt="HANGER"
                className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="font-serif text-[22px] font-bold tracking-[0.25em] text-[#2C1810] uppercase mt-2 leading-tight"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                HANGER
              </span>
              <span className="text-[8px] font-bold tracking-[0.35em] text-[#B89547] uppercase mt-0.5">
                THE DESIGNER VILLA
              </span>
            </Link>

            {/* Ornamental Gold Divider */}
            <div className="flex items-center justify-center gap-3 my-4 w-full max-w-[180px]">
              <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-[#B89547]/50 to-[#B89547]" />
              <span className="text-[#B89547] text-[10px]">❀</span>
              <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent via-[#B89547]/50 to-[#B89547]" />
            </div>
          </div>

          {/* Inline Search Bar (Toggled when SEARCH is clicked) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                      handleClose();
                    }
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Search collections, clothing..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EFE6D9] border border-[#E0D2C2] rounded-full px-4 py-2.5 pl-10 text-[12px] font-medium text-[#2C1810] placeholder-[#7A6B5D]/60 focus:outline-none focus:border-[#B89547] transition-all"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6B5D]" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6B5D] hover:text-[#2C1810]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Navigation List */}
          <nav className="flex flex-col gap-1 w-full">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              const isExpanded = expandedItems[item.title];
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex flex-col w-full">
                  <div
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 transition-all duration-300 cursor-pointer",
                      isActive
                        ? "bg-[#F4E7DA] border border-[#E8D9C9] rounded-[14px] shadow-sm"
                        : "hover:bg-[#EFE6D9]/50 rounded-[14px]"
                    )}
                    onClick={() => {
                      if (item.hasSub) {
                        toggleExpand(item.title);
                      } else {
                        handleClose();
                      }
                    }}
                  >
                    {/* Left Icon + Title */}
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.hasSub) {
                          e.preventDefault();
                          toggleExpand(item.title);
                        } else {
                          handleClose();
                        }
                      }}
                      className="flex items-center gap-3.5 flex-1"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EFE6D9] border border-[#E0D2C2]/70 flex items-center justify-center text-[#4A3E38] shadow-2xs flex-shrink-0">
                        <Icon className="w-4 h-4 stroke-[1.6]" />
                      </div>
                      <span
                        className={cn(
                          "font-sans text-[12px] font-semibold tracking-[0.18em] uppercase transition-colors",
                          isActive ? "text-[#2C1810]" : "text-[#2C1810]/90"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>

                    {/* Chevron Right Indicator for Expandable Items */}
                    {item.hasSub && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(item.title);
                        }}
                        className="p-1 text-[#7A6B5D] hover:text-[#2C1810] transition-transform duration-300"
                      >
                        <ChevronDown
                          className={cn("w-4 h-4 stroke-[1.8] transition-transform duration-300", isExpanded && "rotate-180")}
                        />
                      </button>
                    )}
                  </div>

                  {/* Submenu Accordion */}
                  <AnimatePresence>
                    {item.hasSub && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col pl-14 pr-3 pt-1 pb-2 gap-2 overflow-hidden border-l border-[#E5D8C7] ml-7 my-1"
                      >
                        {item.subItems?.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={handleClose}
                            className="font-sans text-[10.5px] font-medium tracking-[0.15em] text-[#5A4A42] hover:text-[#B89547] uppercase transition-colors py-1"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Horizontal Divider */}
          <div className="h-[0.5px] bg-[#E2D6C6] my-4 w-full" />

          {/* Secondary Navigation List */}
          <nav className="flex flex-col gap-1 w-full">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href ? pathname === item.href : false;

              if (item.action) {
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="flex items-center gap-4 px-3 py-2.5 w-full text-left rounded-xl hover:bg-[#EFE6D9]/50 transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#5A4A42] stroke-[1.6] ml-1 flex-shrink-0" />
                    <span className="font-sans text-[11.5px] font-medium tracking-[0.16em] text-[#3D322C] uppercase">
                      {item.title}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.href!}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors",
                    isActive ? "bg-[#F4E7DA] font-semibold" : "hover:bg-[#EFE6D9]/50"
                  )}
                >
                  <Icon className="w-4 h-4 text-[#5A4A42] stroke-[1.6] ml-1 flex-shrink-0" />
                  <span className="font-sans text-[11.5px] font-medium tracking-[0.16em] text-[#3D322C] uppercase">
                    {item.title}
                  </span>
                </Link>
              );
            })}

            {/* Admin Dashboard Entry if Admin */}
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={handleClose}
                className="flex items-center gap-4 px-3 py-2.5 rounded-xl bg-[#B89547]/15 hover:bg-[#B89547]/25 text-[#2C1810] transition-colors mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#B89547] stroke-[1.8] ml-1 flex-shrink-0" />
                <span className="font-sans text-[11px] font-bold tracking-[0.16em] text-[#B89547] uppercase">
                  ADMIN DASHBOARD
                </span>
              </Link>
            )}

            {/* Sign Out if Logged In */}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  handleClose();
                }}
                className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-red-700/80 hover:bg-red-50/50 transition-colors mt-1 cursor-pointer w-full text-left"
              >
                <LogOut className="w-4 h-4 stroke-[1.6] ml-1 flex-shrink-0" />
                <span className="font-sans text-[11.5px] font-medium tracking-[0.16em] uppercase">
                  SIGN OUT
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="relative z-10 flex flex-col items-center text-center mt-6 pt-4 border-t border-[#E2D6C6]/60 w-full">
          {/* Cursive Text */}
          <p
            className="font-serif italic text-[17px] text-[#B89547] mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Let&apos;s stay connected ♡
          </p>

          {/* Round Social Buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#EFE6D9] border border-[#E0D2C2] flex items-center justify-center text-[#4A3E38] hover:text-[#B89547] hover:border-[#B89547] transition-all duration-300 shadow-2xs hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4 stroke-[1.6]" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#EFE6D9] border border-[#E0D2C2] flex items-center justify-center text-[#4A3E38] hover:text-[#B89547] hover:border-[#B89547] transition-all duration-300 shadow-2xs hover:scale-105"
            >
              <FacebookIcon className="w-4 h-4 stroke-[1.6]" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#EFE6D9] border border-[#E0D2C2] flex items-center justify-center text-[#4A3E38] hover:text-[#B89547] hover:border-[#B89547] transition-all duration-300 shadow-2xs hover:scale-105"
            >
              <PinterestIcon className="w-4 h-4 stroke-[1.6]" />
            </a>
          </div>

          {/* Bottom Brand Signature */}
          <div className="flex items-center justify-center gap-2 w-full text-center">
            <span className="text-[#B89547] text-[8px]">◆</span>
            <p className="font-sans text-[7.5px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase">
              HANGER – THE DESIGNER VILLA
            </p>
            <span className="text-[#B89547] text-[8px]">◆</span>
          </div>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
