"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, Search, User, Heart, ShoppingBag, X, ChevronRight, ArrowRight } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { useWishlist } from "@/context/WishlistContext";
import { productService } from "@/services/product/productService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/hooks/useAdmin";
import { LogOut, Package, Settings, MessageSquare } from "lucide-react";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";

// ─── Static nav structure (mirrors Sidebar) ────────────────────────────
const STATIC_NAV = [
  {
    key: "new-arrivals",
    label: "New Arrivals",
    href: "/new-arrivals",
    description: "Discover the latest premium additions to our collection.",
    subLinks: [],
  },
  {
    key: "best-sellers",
    label: "Best Sellers",
    href: "/bestsellers",
    description: "Our most loved and sought-after designer pieces.",
    subLinks: [],
  },
  {
    key: "clothing",
    label: "Clothing",
    href: "/products",
    description: "Curated Indian fashion – sarees, lehengas, kurtas & more.",
    subLinks: [
      { label: "All Clothing", href: "/products" },
      { label: "Sarees", href: "/clothing?sub=sarees" },
      { label: "Lehengas", href: "/clothing?sub=lehengas" },
      { label: "Kurtas & Suits", href: "/clothing?sub=kurtas" },
      { label: "Co-ord Sets", href: "/clothing?sub=coords" },
      { label: "Dresses & Gowns", href: "/clothing?sub=dresses" },
    ],
  },
  {
    key: "footwear",
    label: "Footwear",
    href: "/footwear",
    description: "Step into luxury with handcrafted ethnic and designer footwear.",
    subLinks: [
      { label: "All Footwear", href: "/footwear" },
      { label: "Ethnic Juttis", href: "/footwear?sub=juttis" },
      { label: "Designer Heels", href: "/footwear?sub=heels" },
      { label: "Luxury Flats", href: "/footwear?sub=flats" },
    ],
  },
  {
    key: "jewellery",
    label: "Jewellery",
    href: "/jewellery",
    description: "Timeless jewellery to complete every look.",
    subLinks: [
      { label: "All Jewellery", href: "/jewellery" },
      { label: "Earrings", href: "/jewellery?sub=earrings" },
      { label: "Necklaces", href: "/jewellery?sub=necklaces" },
      { label: "Bangles & Bracelets", href: "/jewellery?sub=bangles" },
    ],
  },
  {
    key: "accessories",
    label: "Accessories",
    href: "/accessories",
    description: "The finishing touches that define your style.",
    subLinks: [
      { label: "All Accessories", href: "/accessories" },
      { label: "Handbags & Clutches", href: "/accessories?sub=bags" },
      { label: "Dupattas & Scarves", href: "/accessories?sub=dupattas" },
      { label: "Belts & Pins", href: "/accessories?sub=belts" },
    ],
  },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { toggleSidebar } = useSidebar();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mega menu state
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wishlistTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: menuData = [] } = useNavigationMenu();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      try {
        const results = await productService.searchProducts(query);
        setSuggestions(results.slice(0, 5));
      } catch (err) {
        console.error("Search failed:", err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const openMenu = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Find products for current active menu from DB data
  const getMenuProducts = (key: string) => {
    if (key === "new-arrivals") {
      return menuData.find((m) => m.category.id === -1)?.products ?? [];
    }
    if (key === "best-sellers") {
      return menuData.find((m) => m.category.id === -2)?.products ?? [];
    }
    // Try match by category name
    const matched = menuData.find(
      (m) => m.category.name.toLowerCase().replace(/\s+/g, "-") === key
    );
    return matched?.products ?? [];
  };

  const activeNavItem = STATIC_NAV.find((n) => n.key === activeMenu) ?? null;
  const activeProducts = activeMenu ? getMenuProducts(activeMenu) : [];

  return (
    <>
      <WishlistDrawer>
        <button ref={wishlistTriggerRef} className="hidden" aria-hidden="true" />
      </WishlistDrawer>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(212,175,55,0.04)]"
            : "bg-[#FDFBF7]/98 backdrop-blur-md border-b border-[#D4AF37]/10"
        }`}
      >
        {/* ─── DESKTOP HEADER ─────────────────────────────────────────── */}
        <div
          ref={navRef}
          className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] items-center px-8 h-20 max-w-[1600px] mx-auto"
        >
          {/* Col 1 — Left nav links */}
          <nav className="flex items-center justify-start h-full overflow-hidden">
            {STATIC_NAV.map((item) => {
              const isActive = activeMenu === item.key;
              return (
                <div
                  key={item.key}
                  className="relative flex items-center h-full"
                  onMouseEnter={() => openMenu(item.key)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    className={`relative px-2.5 h-full flex items-center text-[9px] font-sans font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 ${
                      isActive ? "text-[#D4AF37]" : "text-[#2C1810] hover:text-[#D4AF37]"
                    }`}
                  >
                    {item.label}
                    {/* Gold underline indicator */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#B89030] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Col 2 — Brand logo: perfectly centered */}
          <div className="flex justify-center px-6">
            <Link href="/" className="flex items-center gap-3 group logo-shimmer px-4 py-2">
              <img
                src="/images/logo-icon.png"
                alt="HANGER"
                className="h-11 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[2deg]"
              />
              <div className="flex flex-col items-start">
                <h1
                  className="font-serif text-xl font-bold tracking-[0.22em] text-[#2C1810] uppercase group-hover:text-[#4A0E17] group-hover:tracking-[0.26em] transition-all duration-500 leading-none whitespace-nowrap"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  HANGER
                </h1>
                <span className="font-sans text-[7px] uppercase tracking-[0.3em] text-[#D4AF37] mt-[3px] font-bold whitespace-nowrap group-hover:brightness-110 transition-colors duration-500">
                  THE DESIGNER VILLA
                </span>
              </div>
            </Link>
          </div>

          {/* Col 3 — Right icons */}
          <div className="flex items-center gap-5 justify-end">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group ${
                isSearchOpen ? "text-[#D4AF37]" : "text-[#2C1810] hover:text-[#D4AF37]"
              }`}
            >
              {isSearchOpen ? (
                <X className="h-[17px] w-[17px] stroke-[1.5]" />
              ) : (
                <>
                  <Search className="h-[17px] w-[17px] stroke-[1.5]" />
                  <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">Search</span>
                </>
              )}
            </button>

            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95 outline-none cursor-pointer">
                  <User className="h-[17px] w-[17px] stroke-[1.5]" />
                  <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">Account</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-64 bg-white/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-none shadow-2xl p-0 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
                >
                  <div className="px-6 py-5 bg-[#FDFBF7] border-b border-[#D4AF37]/10 flex flex-col gap-1">
                    <span className="font-serif text-[#2C1810] text-lg tracking-wide">
                      Welcome, {user.email?.split("@")[0] || "Guest"}
                    </span>
                    <span className="font-sans text-[#7A6B5D] text-[9px] uppercase tracking-[0.2em] font-bold">
                      Atelier Member
                    </span>
                  </div>
                  <div className="py-2 flex flex-col">
                    <DropdownMenuItem className="cursor-pointer focus:bg-[#FDFBF7] focus:text-[#2C1810] rounded-none p-0 group">
                      <Link href="/profile" className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.15em] text-[#2C1810] font-bold px-6 py-3 w-full transition-all group-hover:pl-8">
                        <Package className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-[#FDFBF7] focus:text-[#2C1810] rounded-none p-0 group w-full outline-none"
                      onClick={() => wishlistTriggerRef.current?.click()}
                    >
                      <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.15em] text-[#2C1810] font-bold px-6 py-3 w-full transition-all group-hover:pl-8 text-left outline-none">
                        <Heart className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                        Wishlist
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer focus:bg-[#FDFBF7] focus:text-[#2C1810] rounded-none p-0 group">
                      <Link href="/contact" className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.15em] text-[#2C1810] font-bold px-6 py-3 w-full transition-all group-hover:pl-8">
                        <MessageSquare className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem className="cursor-pointer focus:bg-[#D4AF37]/5 focus:text-[#2C1810] rounded-none p-0 group mt-1 border-t border-[#D4AF37]/10">
                        <Link href="/admin" className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-bold px-6 py-3 w-full transition-all group-hover:pl-8">
                          <Settings className="h-4 w-4 stroke-[1.5]" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  <div className="p-4 border-t border-[#D4AF37]/10 bg-[#FDFBF7]/50">
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer focus:bg-red-50 focus:text-red-700 text-red-600 rounded-none font-sans text-[9px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 py-2.5 transition-colors border border-red-100 hover:border-red-200"
                    >
                      <LogOut className="h-3 w-3 stroke-[2]" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-1.5 text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <User className="h-[17px] w-[17px] stroke-[1.5]" />
                <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">Sign In</span>
              </Link>
            )}

            {/* Wishlist */}
            <WishlistDrawer>
              <button className="flex items-center gap-1.5 text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative outline-none">
                <Heart className="h-[17px] w-[17px] stroke-[1.5]" />
                <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">
                  Wishlist{totalWishlistItems > 0 && ` (${totalWishlistItems})`}
                </span>
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[7.5px] font-bold text-[#2C1810]">
                    {totalWishlistItems}
                  </span>
                )}
              </button>
            </WishlistDrawer>

            {/* Cart */}
            <CartDrawer>
              <button className="relative flex items-center gap-1.5 text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95 outline-none cursor-pointer">
                <ShoppingBag className="h-[17px] w-[17px] stroke-[1.5]" />
                <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">
                  Bag ({totalItems})
                </span>
              </button>
            </CartDrawer>
          </div>
        </div>

        {/* ─── MOBILE HEADER ──────────────────────────────────────────── */}
        <div className="xl:hidden bg-[#FDFBF7] shadow-sm">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-3 md:px-6 h-[64px] sm:h-[70px] w-full">
            {/* Left: Hamburger */}
            <div className="flex justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#2C1810] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 rounded-full h-10 w-10 flex items-center justify-center active:scale-90"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5 sm:h-[22px] sm:w-[22px] stroke-[1.5]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>

            {/* Center: Brand logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                <img
                  src="/images/logo-icon.png"
                  alt="HANGER"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-active:scale-95 shrink-0"
                />
                <div className="flex flex-col items-start min-w-0">
                  <span
                    className="font-serif text-[15px] sm:text-[18px] font-bold tracking-[0.2em] sm:tracking-[0.24em] text-[#2C1810] uppercase leading-none whitespace-nowrap"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    HANGER
                  </span>
                  <span className="font-sans text-[5.5px] sm:text-[6.5px] uppercase tracking-[0.28em] text-[#D4AF37] mt-[3px] font-bold whitespace-nowrap">
                    THE DESIGNER VILLA
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Icon group (Search & Bag only, Account is in bottom nav) */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 active:scale-90 shrink-0 ${
                  isSearchOpen ? "text-[#D4AF37]" : "text-[#2C1810] hover:text-[#D4AF37]"
                }`}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5 stroke-[1.5]" />
                ) : (
                  <Search className="h-5 w-5 stroke-[1.5]" />
                )}
              </button>

              {/* Bag */}
              <CartDrawer>
                <button className="flex items-center justify-center h-10 w-10 rounded-full text-[#2C1810] hover:text-[#D4AF37] active:scale-90 transition-all duration-300 shrink-0 relative">
                  <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 bg-[#D4AF37] text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center rounded-full border-[1.5px] border-[#FDFBF7]">
                      {totalItems}
                    </span>
                  )}
                </button>
              </CartDrawer>
            </div>
          </div>

          {/* Gold hairline gradient */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
        </div>

        {/* ─── SEARCH PANEL ────────────────────────────────────────────── */}
        <div
          className={`absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-out bg-[#FDFBF7]/95 backdrop-blur-md shadow-lg border-t border-[#D4AF37]/10 ${
            isSearchOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
          }`}
        >
          <div className="container mx-auto px-4 py-5">
            <div className="max-w-2xl mx-auto relative">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, collections, designers..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm tracking-wide text-[#2C1810] placeholder:text-[#7A6B5D]/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSuggestions([]); }}
                    className="text-[#7A6B5D] hover:text-[#4A0E17] transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                )}
              </div>
              {suggestions.length > 0 && (
                <div className="mt-4 flex flex-col gap-1">
                  <div className="text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase mb-2">
                    {suggestions.length} {suggestions.length === 1 ? "Result" : "Results"}
                  </div>
                  {suggestions.map((prod) => (
                    <Link
                      key={prod.product_id}
                      href={`/products/${prod.product_id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 py-3 px-2 hover:bg-[#F0E6D8]/30 transition-colors duration-200 group/item border-b border-[#D4AF37]/5 last:border-b-0"
                    >
                      <img src={prod.image} className="w-14 h-14 object-cover border border-[#D4AF37]/10" alt={prod.title} />
                      <div className="flex flex-col flex-1 text-left">
                        <span className="font-sans text-xs font-semibold text-[#2C1810] tracking-wide group-hover/item:text-[#4A0E17] transition-colors">{prod.title}</span>
                        <span className="font-sans text-[10px] text-[#7A6B5D] mt-0.5 line-clamp-1">{prod.description}</span>
                      </div>
                      <span className="font-sans text-xs font-bold text-[#2C1810]">₹{prod.price.toLocaleString("en-IN")}</span>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.length >= 2 && suggestions.length === 0 && (
                <div className="mt-4 py-6 text-center">
                  <p className="font-sans text-xs text-[#7A6B5D] tracking-wide">No products found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="font-sans text-[10px] text-[#7A6B5D]/60 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── DESKTOP MEGA MENU (Full-screen slidebar, outside sticky header) ─── */}
      {/* Backdrop */}
      <div
        className={`hidden xl:block fixed inset-0 top-20 bg-[#1a0f09]/40 backdrop-blur-[2px] z-40 transition-all duration-400 ${
          activeMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setActiveMenu(null)}
      />

      {/* Mega Panel */}
      <div
        ref={megaMenuRef}
        className={`hidden xl:block fixed left-0 right-0 top-20 z-[45] bg-[#FDFBF7] border-b-2 border-[#D4AF37]/30 shadow-[0_20px_60px_rgba(44,24,16,0.18)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activeMenu
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
      >
        {/* Gold shimmer top line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />

        {activeNavItem && (
          <div className="max-w-[1600px] mx-auto px-10 py-10">
            <div className="flex gap-10">
              {/* ── Left Panel: Category info + sub-links ── */}
              <div className="w-[280px] shrink-0 flex flex-col gap-6">
                {/* Category heading */}
                <div className="border-b border-[#D4AF37]/15 pb-5">
                  <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
                    Browse
                  </p>
                  <h2
                    className="font-serif text-3xl text-[#2C1810] leading-tight mb-2"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {activeNavItem.label}
                  </h2>
                  <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed">
                    {activeNavItem.description}
                  </p>
                </div>

                {/* Sub-links */}
                {activeNavItem.subLinks.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {activeNavItem.subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setActiveMenu(null)}
                        className="group/sub flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F4E7DA] transition-all duration-200"
                      >
                        <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#2C1810] uppercase group-hover/sub:text-[#4A0E17] transition-colors">
                          {sub.label}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-[#D4AF37] opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* View All CTA */}
                <Link
                  href={activeNavItem.href}
                  onClick={() => setActiveMenu(null)}
                  className="group/cta mt-auto inline-flex items-center gap-2 px-5 py-3 bg-[#2C1810] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#4A0E17] hover:gap-3 self-start"
                >
                  View All {activeNavItem.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </div>

              {/* ── Right Panel: Product grid ── */}
              <div className="flex-1 min-w-0">
                {activeProducts.length > 0 ? (
                  <>
                    <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#7A6B5D] uppercase mb-5">
                      Featured Pieces
                    </p>
                    <div className="grid grid-cols-4 gap-5 xl:grid-cols-5 2xl:grid-cols-6">
                      {activeProducts.slice(0, 6).map((prod, idx) => (
                        <Link
                          key={prod.product_id}
                          href={`/products/${prod.product_id}`}
                          onClick={() => setActiveMenu(null)}
                          className="group/prod flex flex-col gap-2.5"
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="relative aspect-[3/4] bg-[#F0E6D8]/40 overflow-hidden">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/prod:scale-108"
                            />
                            <div className="absolute inset-0 bg-[#2C1810]/0 group-hover/prod:bg-[#2C1810]/8 transition-colors duration-400" />
                            {/* Quick view overlay */}
                            <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover/prod:opacity-100 transition-opacity duration-300">
                              <span className="bg-[#FDFBF7]/90 backdrop-blur-sm px-3 py-1 font-sans text-[8px] font-bold tracking-[0.15em] text-[#2C1810] uppercase">
                                View →
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans text-[10.5px] font-bold text-[#2C1810] tracking-wide group-hover/prod:text-[#D4AF37] transition-colors duration-300 truncate leading-tight">
                              {prod.title}
                            </span>
                            <span className="font-sans text-[11px] font-semibold text-[#7A6B5D]">
                              ₹{prod.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <div className="text-center">
                      <div className="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto mb-4" />
                      <p className="font-serif text-base text-[#7A6B5D] italic">
                        Exclusive collection launching soon.
                      </p>
                      <div className="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto mt-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom gold line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      {/* Search backdrop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/20 backdrop-blur-[2px] z-[44]"
          onClick={closeSearch}
        />
      )}
    </>
  );
}
