"use client";

import { Home, Search, Heart, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "HOME",     icon: Home,        href: "/" },
  { name: "SHOP",     icon: Store,       href: "/products" },
  { name: "SEARCH",   icon: Search,      href: "#search" },
  { name: "WISHLIST", icon: Heart,       href: "__wishlist__" },
  { name: "BAG",      icon: ShoppingBag, href: "__cart__" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.href === "/") return pathname === "/";
    if (["__cart__", "__wishlist__"].includes(item.href) || item.href.startsWith("#")) return false;
    return pathname.startsWith(item.href);
  };

  const renderContent = (item: (typeof navItems)[number]) => {
    const active = isActive(item);
    const Icon = item.icon;
    const badge =
      item.href === "__cart__" && totalItems > 0
        ? totalItems
        : item.href === "__wishlist__" && totalWishlistItems > 0
        ? totalWishlistItems
        : null;

    return (
      <div className="flex flex-col items-center justify-center gap-[3px] w-full py-1.5 relative group">
        {/* Active indicator - gold top bar */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="bottomNavIndicator"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-6 bg-[#D4AF37] rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Icon container */}
        <div className="relative flex items-center justify-center w-9 h-9">
          {/* Active background glow */}
          {active && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 rounded-full bg-[#D4AF37]/8"
            />
          )}
          <Icon
            className={`h-[21px] w-[21px] transition-all duration-300 group-active:scale-90 ${
              active
                ? "text-[#4A0E17] stroke-[2] scale-110"
                : "text-[#7A6B5D] stroke-[1.5] group-hover:text-[#2C1810]"
            }`}
          />
          {/* Badge */}
          {badge !== null && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4A0E17] text-[8px] font-bold text-[#D4AF37] leading-none"
            >
              {badge}
            </motion.span>
          )}
        </div>

        {/* Label */}
        <span
          className={`text-[7.5px] font-bold tracking-[0.14em] uppercase transition-all duration-300 ${
            active ? "text-[#4A0E17]" : "text-[#9B8E85] group-hover:text-[#2C1810]"
          }`}
        >
          {item.name === "BAG" ? `BAG${totalItems > 0 ? ` (${totalItems})` : ""}` : item.name}
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Gold shimmer line at top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      {/* Nav bar */}
      <nav
        className="flex items-stretch bg-[#FFFCF7]/97 backdrop-blur-2xl border-t-0"
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        {navItems.map((item) => {
          if (item.href === "__cart__") {
            return (
              <CartDrawer key={item.name}>
                <button className="flex flex-1 items-center justify-center cursor-pointer outline-none active:bg-[#D4AF37]/5 transition-colors duration-150">
                  {renderContent(item)}
                </button>
              </CartDrawer>
            );
          }
          if (item.href === "__wishlist__") {
            return (
              <WishlistDrawer key={item.name}>
                <button className="flex flex-1 items-center justify-center cursor-pointer outline-none active:bg-[#D4AF37]/5 transition-colors duration-150">
                  {renderContent(item)}
                </button>
              </WishlistDrawer>
            );
          }
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-1 items-center justify-center active:bg-[#D4AF37]/5 transition-colors duration-150"
            >
              {renderContent(item)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
