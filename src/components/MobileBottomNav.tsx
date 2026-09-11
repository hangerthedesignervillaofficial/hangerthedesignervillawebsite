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

const navItems = [
  { name: "HOME", icon: Home, href: "/" },
  { name: "SHOP", icon: Store, href: "/products" },
  { name: "WISHLIST", icon: Heart, href: "__wishlist__" },
  { name: "BAG", icon: ShoppingBag, href: "__cart__" },
  { name: "ACCOUNT", icon: User, href: "__account__" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.href === "/") return pathname === "/";
    if (["__cart__", "__wishlist__", "__account__"].includes(item.href) || item.href.startsWith("#")) {
      return false;
    }
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
      <div className="flex flex-col items-center justify-center gap-1 w-full py-2 relative group select-none">
        {/* Subtle Top Active Hairline Indicator */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] w-5 rounded-full transition-all duration-300 ease-out ${
            active ? "bg-[#B99A45] opacity-100 scale-x-100" : "bg-transparent opacity-0 scale-x-0"
          }`}
        />

        {/* Icon Container with refined stroke */}
        <div className="relative flex items-center justify-center w-7 h-7">
          <Icon
            className={`transition-all duration-200 ${
              active
                ? "text-[#281713]"
                : "text-[#82756D] group-hover:text-[#281713]"
            }`}
            style={{ width: 19, height: 19 }}
            strokeWidth={active ? 1.5 : 1.25}
          />

          {/* Luxury Badge */}
          {badge !== null && (
            <span
              className="absolute -top-1 -right-1.5 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full text-[7px] font-bold leading-none bg-[#281713] text-[#B99A45] border border-[#FDFBF7] shadow-xs"
            >
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </div>

        {/* Label */}
        <span
          className={`text-[7.5px] font-sans font-semibold tracking-[0.18em] uppercase transition-colors duration-200 ${
            active ? "text-[#281713]" : "text-[#82756D] group-hover:text-[#281713]"
          }`}
        >
          {item.name === "BAG"
            ? `BAG${totalItems > 0 ? ` (${totalItems})` : ""}`
            : item.name === "ACCOUNT"
            ? user
              ? "ACCOUNT"
              : "SIGN IN"
            : item.name}
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[45] xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Fine divider hairline */}
      <div className="h-[1px] w-full bg-[#E7DDC9]" />

      {/* Nav bar with luxury porcelain blur */}
      <nav className="flex items-stretch bg-[#FDFBF7]/95 backdrop-blur-xl">
        {navItems.map((item) => {
          // Cart Drawer
          if (item.href === "__cart__") {
            return (
              <CartDrawer key={item.name}>
                <button
                  type="button"
                  aria-label="Shopping Bag"
                  className="flex flex-1 items-center justify-center cursor-pointer outline-none transition-colors duration-150 active:bg-[#B99A45]/5"
                >
                  {renderContent(item)}
                </button>
              </CartDrawer>
            );
          }

          // Wishlist Drawer
          if (item.href === "__wishlist__") {
            return (
              <WishlistDrawer key={item.name}>
                <button
                  type="button"
                  aria-label="Wishlist Lookbook"
                  className="flex flex-1 items-center justify-center cursor-pointer outline-none transition-colors duration-150 active:bg-[#B99A45]/5"
                >
                  {renderContent(item)}
                </button>
              </WishlistDrawer>
            );
          }

          // Account / Sign In
          if (item.href === "__account__") {
            const accountHref = user ? "/profile" : "/signin";
            const isAccountActive =
              pathname === "/profile" || pathname === "/signin" || pathname === "/dashboard";
            return (
              <Link
                key={item.name}
                href={accountHref}
                prefetch={true}
                className="flex flex-1 items-center justify-center transition-colors duration-150 active:bg-[#B99A45]/5"
              >
                {renderContent(item, isAccountActive)}
              </Link>
            );
          }

          // Regular link (HOME, SHOP)
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className="flex flex-1 items-center justify-center transition-colors duration-150 active:bg-[#B99A45]/5"
            >
              {renderContent(item)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
