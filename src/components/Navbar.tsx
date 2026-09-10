"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { productService } from "@/services/product/productService";

export function Navbar() {
  const { totalItems } = useCart();
  const { toggleSidebar } = useSidebar();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      try {
        const results = await productService.searchProducts(query);
        setSuggestions(results.slice(0, 5));
      } catch {
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

  return (
    <>
      {/* ── HEADER ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#F9F6F1]/96 backdrop-blur-xl shadow-[0_1px_0_0_rgba(201,169,98,0.18)]"
            : "bg-[#F9F6F1] shadow-[0_1px_0_0_rgba(201,169,98,0.10)]"
        }`}
      >
        <div className="grid grid-cols-3 items-center px-5 md:px-10 h-[68px] w-full max-w-[1600px] mx-auto">

          {/* LEFT — Hamburger */}
          <div className="flex justify-start">
            <Button
              id="nav-menu-toggle"
              variant="ghost"
              size="icon"
              className="text-[#222222] hover:text-[#C9A962] hover:bg-[#C9A962]/5 transition-colors duration-300 rounded-full h-10 w-10 active:scale-90"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>

          {/* CENTER — Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Hanger The Designer Villa — Home">
              <img
                src="/images/logo-icon.png"
                alt=""
                className="h-[34px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col items-start leading-none">
                <span className="font-serif text-[17px] font-bold tracking-[0.22em] text-[#1A1A1A] uppercase">
                  HANGER
                </span>
                <span className="font-sans text-[6.5px] uppercase tracking-[0.3em] text-[#C9A962] font-semibold mt-[3.5px]">
                  THE DESIGNER VILLA
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT — Search + Bag */}
          <div className="flex items-center justify-end gap-1.5">
            <button
              id="nav-search-toggle"
              onClick={() => setIsSearchOpen(v => !v)}
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-300 active:scale-90 ${
                isSearchOpen ? "text-[#C9A962]" : "text-[#1A1A1A] hover:text-[#C9A962]"
              }`}
              aria-label="Search"
            >
              {isSearchOpen
                ? <X className="h-[18px] w-[18px] stroke-[1.5]" />
                : <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              }
            </button>

            <CartDrawer>
              <button
                id="nav-cart-toggle"
                className="relative flex items-center justify-center h-10 w-10 rounded-full text-[#1A1A1A] hover:text-[#C9A962] transition-colors duration-300 active:scale-90"
                aria-label={`Cart (${totalItems} items)`}
              >
                <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-[15px] w-[15px] bg-[#C9A962] text-white text-[8px] font-bold flex items-center justify-center rounded-full border-[1.5px] border-[#F9F6F1] leading-none">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </CartDrawer>
          </div>
        </div>

        {/* ── SEARCH PANEL ── */}
        <div
          className={`absolute top-full left-0 w-full bg-[#F9F6F1] border-b border-[#C9A962]/15 shadow-md transition-all duration-300 overflow-hidden ${
            isSearchOpen ? "max-h-[440px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-5 md:px-10 py-5">
            <div className="max-w-xl mx-auto">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[#C9A962]/35 pb-2 focus-within:border-[#C9A962] transition-colors">
                <Search className="h-4 w-4 text-[#C9A962] shrink-0" />
                <input
                  ref={searchInputRef}
                  id="nav-search-input"
                  type="search"
                  placeholder="Search jewellery, clothing, footwear…"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full bg-transparent outline-none font-sans text-[13px] text-[#1A1A1A] placeholder:text-[#7A7A7A]/60 tracking-wide h-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSuggestions([]); }}
                    className="text-[#7A7A7A] hover:text-[#1A1A1A] transition-colors shrink-0"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-3 divide-y divide-[#C9A962]/8">
                  {suggestions.map(prod => (
                    <Link
                      key={prod.product_id}
                      href={`/products/${prod.product_id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 py-3 hover:bg-[#F0E6D8]/40 px-2 -mx-2 transition-colors group/item"
                    >
                      {prod.image && (
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-11 h-11 object-cover border border-[#C9A962]/15 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[12px] font-semibold text-[#1A1A1A] group-hover/item:text-[#C9A962] truncate transition-colors">
                          {prod.title}
                        </p>
                      </div>
                      <p className="font-sans text-[12px] font-bold text-[#1A1A1A] shrink-0">
                        ₹{prod.price?.toLocaleString("en-IN")}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && suggestions.length === 0 && (
                <p className="mt-4 font-sans text-[12px] text-[#7A7A7A] text-center py-2">No results found for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 top-[68px] bg-black/10 z-40"
          onClick={closeSearch}
          aria-hidden
        />
      )}
    </>
  );
}
