"use client";
 
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, Search, User, Heart, ShoppingBag, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { useWishlist } from "@/context/WishlistContext";
import { mockProducts } from "@/utils/mockData";
 
export function Navbar() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { toggleSidebar } = useSidebar();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const filtered = mockProducts.filter((prod) =>
        prod.title.toLowerCase().includes(query.toLowerCase()) ||
        prod.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Removed SHOP — same as Collections
  const navLinks = [
    { name: "COLLECTIONS", href: "/products" },
    { name: "CLOTHING", href: "/clothing" },
    { name: "FOOTWEAR", href: "/footwear" },
    { name: "JEWELLERY", href: "/jewellery" },
    { name: "ACCESSORIES", href: "/accessories" },
  ];
 
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      isScrolled 
        ? "bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(212,175,55,0.04)]" 
        : "bg-[#FDFBF7]/98 backdrop-blur-md border-b border-[#D4AF37]/8"
    }`}>

      {/* ─── DESKTOP HEADER: 3-column grid for perfect logo centering ─── */}
      <div className="hidden xl:grid xl:grid-cols-3 items-center px-8 h-20 max-w-[1600px] mx-auto">

        {/* Col 1 — Left nav links */}
        <nav className="flex items-center gap-6 justify-start">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[9.5px] font-sans font-bold tracking-[0.18em] text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 whitespace-nowrap relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Col 2 — Brand logo: perfectly centered by CSS grid */}
        <div className="flex justify-center">
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
          <Link
            href={user ? "/profile" : "/signin"}
            className="flex items-center gap-1.5 text-[#2C1810] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <User className="h-[17px] w-[17px] stroke-[1.5]" />
            <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">Account</span>
          </Link>

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
              <span className="font-sans text-[9px] font-bold tracking-[0.16em] uppercase">Bag ({totalItems})</span>
            </button>
          </CartDrawer>
        </div>
      </div>

      {/* ─── MOBILE HEADER ─── */}
      <div className="xl:hidden relative">
        <div className="flex items-center justify-between px-2 h-[58px]">

          {/* Left: Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#2C1810] cursor-pointer hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 rounded-full h-11 w-11 flex items-center justify-center flex-shrink-0 active:scale-90"
            onClick={toggleSidebar}
          >
            <Menu className="h-[26px] w-[26px] stroke-[1.5]" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Center: Brand logo — absolute center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link href="/" className="flex items-center gap-2.5 group px-3 pointer-events-auto">
              <img 
                src="/images/logo-icon.png" 
                alt="HANGER" 
                className="h-9 w-auto object-contain transition-transform duration-300 group-active:scale-95"
              />
              <div className="flex flex-col items-start">
                <span
                  className="font-serif text-[16px] font-bold tracking-[0.22em] text-[#2C1810] uppercase leading-none whitespace-nowrap"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  HANGER
                </span>
                <span className="font-sans text-[6px] uppercase tracking-[0.28em] text-[#D4AF37] mt-[3px] font-bold whitespace-nowrap">
                  THE DESIGNER VILLA
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Icon group */}
          <div className="flex items-center gap-0 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex items-center justify-center h-11 w-11 rounded-full transition-all duration-300 active:scale-90 cursor-pointer ${
                isSearchOpen
                  ? "text-[#D4AF37]"
                  : "text-[#2C1810] hover:text-[#D4AF37]"
              }`}
            >
              {isSearchOpen
                ? <X className="h-[22px] w-[22px] stroke-[1.5]" />
                : <Search className="h-[22px] w-[22px] stroke-[1.5]" />
              }
            </button>

            {/* Account */}
            <Link
              href={user ? "/profile" : "/signin"}
              className="flex items-center justify-center h-11 w-11 rounded-full text-[#2C1810] hover:text-[#D4AF37] active:scale-90 transition-all duration-300"
            >
              <User className="h-[22px] w-[22px] stroke-[1.5]" />
            </Link>

            {/* Cart */}
            <CartDrawer>
              <button className="relative flex items-center justify-center h-11 w-11 rounded-full text-[#2C1810] hover:text-[#D4AF37] active:scale-90 transition-all duration-300 outline-none cursor-pointer">
                <ShoppingBag className="h-[22px] w-[22px] stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4A0E17] text-[8px] font-bold text-[#D4AF37] leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </CartDrawer>
          </div>
        </div>

        {/* Luxury gold hairline gradient below mobile header */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
      </div>



      {/* ─── SEARCH PANEL (slides down, both desktop + mobile) ─── */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out bg-[#FDFBF7] border-t border-[#D4AF37]/10 ${
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

      {/* Backdrop when search is open */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/20 backdrop-blur-[2px] z-[-1]"
          onClick={closeSearch}
        />
      )}
    </header>
  );
}
