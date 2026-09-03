"use client";

import { Home, Heart, ShoppingBag, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "HOME",     icon: Home,        href: "/" },
  { name: "SHOP",     icon: Store,       href: "/products" },
  { name: "WISHLIST", icon: Heart,       href: "__wishlist__" },
  { name: "BAG",      icon: ShoppingBag, href: "__cart__" },
  { name: "ACCOUNT",  icon: User,        href: "__account__" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.href === "/") return pathname === "/";
    if (["__cart__", "__wishlist__", "__account__"].includes(item.href) || item.href.startsWith("#")) return false;
    return pathname.startsWith(item.href);
  };

  const renderContent = (item: (typeof navItems)[number], overrideActive?: boolean) => {
    const active = overrideActive ?? isActive(item);
    const Icon = item.icon;
    const badge =
      item.href === "__cart__" && totalItems > 0
        ? totalItems
        : item.href === "__wishlist__" && totalWishlistItems > 0
        ? totalWishlistItems
        : null;

    return (
      <div className="flex flex-col items-center justify-center gap-[4px] w-full py-2 relative group select-none">
        {/* Active pill indicator at top */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="bottomNavPill"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute -top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-8 rounded-full"
              style={{
                background: "linear-gradient(90deg, #B89030, #D4AF37, #B89030)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon container */}
        <div className="relative flex items-center justify-center w-10 h-10">
          {/* Glow background for active */}
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={active ? { scale: 1.12 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon
              className={`transition-all duration-300 group-active:scale-90 ${
                active
                  ? "text-[#4A0E17] stroke-[2]"
                  : "text-[#8A7B72] stroke-[1.5] group-hover:text-[#2C1810]"
              }`}
              style={{ width: 22, height: 22 }}
            />
          </motion.div>

          {/* Badge */}
          <AnimatePresence>
            {badge !== null && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-0.5 -right-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full text-[7.5px] font-bold leading-none"
                style={{
                  background: "#4A0E17",
                  color: "#D4AF37",
                  boxShadow: "0 0 0 1.5px #FFFCF7",
                }}
              >
                {badge > 9 ? "9+" : badge}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Label */}
        <span
          className={`text-[7px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${
            active ? "text-[#4A0E17]" : "text-[#9B8E85] group-hover:text-[#2C1810]"
          }`}
        >
          {item.name === "BAG"
            ? `BAG${totalItems > 0 ? ` (${totalItems})` : ""}`
            : item.name === "ACCOUNT"
            ? user ? "ACCOUNT" : "SIGN IN"
            : item.name}
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Gold shimmer hairline */}
      <div
        className="h-[1px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 40%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.6) 60%, transparent 100%)",
        }}
      />

      {/* Nav bar */}
      <nav
        className="flex items-stretch border-t-0"
        style={{
          background: "rgba(255, 252, 247, 0.97)",
          backdropFilter: "blur(24px) saturate(1.6)",
          WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        }}
      >
        {navItems.map((item) => {
          // Cart
          if (item.href === "__cart__") {
            return (
              <CartDrawer key={item.name}>
                <button className="flex flex-1 items-center justify-center cursor-pointer outline-none transition-colors duration-150 active:bg-[#D4AF37]/8">
                  {renderContent(item)}
                </button>
              </CartDrawer>
            );
          }

          // Wishlist
          if (item.href === "__wishlist__") {
            return (
              <WishlistDrawer key={item.name}>
                <button className="flex flex-1 items-center justify-center cursor-pointer outline-none transition-colors duration-150 active:bg-[#D4AF37]/8">
                  {renderContent(item)}
                </button>
              </WishlistDrawer>
            );
          }

          // Account
          if (item.href === "__account__") {
            const accountHref = user ? "/profile" : "/signin";
            const isAccountActive = pathname === "/profile" || pathname === "/signin" || pathname === "/dashboard";
            return (
              <Link
                key={item.name}
                href={accountHref}
                className="flex flex-1 items-center justify-center transition-colors duration-150 active:bg-[#D4AF37]/8"
              >
                {renderContent(item, isAccountActive)}
              </Link>
            );
          }

          // Regular link
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-1 items-center justify-center transition-colors duration-150 active:bg-[#D4AF37]/8"
            >
              {renderContent(item)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
