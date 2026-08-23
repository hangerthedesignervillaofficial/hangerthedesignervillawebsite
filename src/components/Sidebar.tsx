"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import {
  Home,
  Shirt,
  Watch,
  Smartphone,
  Search,
  LogOut,
  LayoutDashboard,
  Settings,
  Package,
  ShoppingCart,
  Users,
  User,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useCategories } from "@/hooks/queries";
import { usePathname } from "next/navigation";
import { Motion } from "@/components/motion/motion";
import { mockProducts } from "@/utils/mockData";
import {
  staggerVariants,
  itemVariants,
  searchVariants,
  indicatorVariants,
} from "@/components/motion/animation-variants";

// Default icons for each category
const categoryIcons: Record<string, React.ElementType> = {
  All: Home,
  Clothing: Shirt,
  Accessories: Watch,
  Electronics: Smartphone,
};

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();

  // Use the TanStack Query hook instead of manual state management
  const {
    data: categories,
    isLoading: loading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const isCollapsed = state === "collapsed" && !isMobile;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const filtered = mockProducts.filter((prod) =>
        prod.title.toLowerCase().includes(query.toLowerCase()) ||
        prod.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Mapping of categories from DB to display with icons and hrefs
  const categoryItems = [
    { name: "All", icon: Home, href: "/" },
    ...(categories || []).map((category) => ({
      name: category.name,
      icon: categoryIcons[category.name] || Smartphone,
      href: `/${category.name.toLowerCase()}`,
    })),
  ];

  // Show all collections in the sidebar to everyone
  const displayCategories = categoryItems;

  // Admin navigation items
  const adminNavItems = [
    { name: "Admin Dashboard", icon: Settings, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Reviews", icon: RefreshCw, href: "/admin/reviews" },
  ];



  return (
    <ShadcnSidebar 
      collapsible="offcanvas" 
      className="z-[70] border-r border-[#D4AF37]/15 backdrop-blur-xl"
      style={{
        "--sidebar-background": "#FDFBF7",
        "--sidebar-border": "rgba(212,175,55,0.15)"
      } as React.CSSProperties}
    >
      {/* Header with logo */}
      <SidebarHeader className="border-b border-[#D4AF37]/10 pb-4 relative">
        <div className="flex flex-col items-center justify-center pt-8 pb-2 relative">
          <Link href="/" className="flex flex-col items-center gap-3" onClick={() => isMobile && toggleSidebar()}>
            <img 
              src="/images/logo-icon.png" 
              alt="HANGER" 
              className={cn(
                "w-auto transition-all duration-500 dark:invert",
                isCollapsed ? "h-9 px-1" : "h-12 hover:scale-105"
              )}
            />
            {!isCollapsed && (
              <div className="flex flex-col items-center text-center">
                <span className="font-serif text-[18px] font-bold tracking-[0.2em] text-[#2C1810] dark:text-[#FFF8F0] uppercase leading-none" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  HANGER
                </span>
                <span className="text-[7.5px] font-bold tracking-[0.25em] text-[#D4AF37] mt-[4px] uppercase">
                  THE DESIGNER VILLA
                </span>
              </div>
            )}
          </Link>
 
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-[#D4AF37]/20 text-[#7A6B5D] hover:text-[#4A0E17] hover:border-[#4A0E17] transition-all duration-300 rounded-full cursor-pointer hover:rotate-90 bg-white/40 outline-none"
              title="Close menu"
            >
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* Search Bar */}
      <div className="px-4">
        <AnimatePresence>
          {!isCollapsed && (
            <Motion
              variants={searchVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              className="pb-3"
            >
              <div className="relative group/search">
                <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-300 pointer-events-none rounded-none" />
                <div className="flex items-center w-full bg-[#FFFDFC] border border-[#D4AF37]/25 focus-within:border-[#D4AF37]/65 transition-all duration-300 shadow-xs relative rounded-none">
                  <div className="pl-3.5 flex items-center justify-center border-r border-[#D4AF37]/15 pr-2.5 h-10">
                    <Search className="h-3.5 w-3.5 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                  <input
                    type="text"
                    placeholder="SEARCH SILHOUETTES..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-transparent border-none rounded-none pl-3 pr-8 h-10 text-[9px] font-sans font-bold tracking-[0.2em] placeholder:text-[#7A6B5D]/35 focus:outline-none text-[#2C1810] dark:text-[#FFFDFC] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); setSuggestions([]); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] hover:text-[#4A0E17] cursor-pointer transition-colors p-1"
                    >
                      <X className="h-3 w-3 stroke-[1.5]" />
                    </button>
                  )}
                </div>
                
                {/* Suggestions Overlay in Sidebar */}
                {suggestions.length > 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-[#FDFBF7]/98 backdrop-blur-md border border-[#D4AF37]/25 shadow-xl shadow-[#D4AF37]/5 z-[90] flex flex-col animate-scale-in">
                    <div className="text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase px-3 pt-3.5 pb-2 border-b border-[#D4AF37]/10 bg-white/40">
                      {suggestions.length} {suggestions.length === 1 ? 'Result' : 'Results'}
                    </div>
                    {suggestions.map((prod) => (
                      <Link 
                        key={prod.product_id}
                        href={`/products/${prod.product_id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setSuggestions([]);
                          if (isMobile) toggleSidebar();
                        }}
                        className="flex items-center gap-3 px-3 py-3 hover:bg-[#F0E6D8]/30 transition-colors duration-250 border-b border-[#D4AF37]/5 last:border-b-0 group/side-item"
                      >
                        <img src={prod.image} className="w-12 h-12 object-cover border border-[#D4AF37]/10 flex-shrink-0" alt={prod.title} />
                        <div className="flex flex-col flex-1 text-left min-w-0">
                          <span className="font-sans text-[10px] font-bold text-[#2C1810] tracking-wide truncate group-hover/side-item:text-[#4A0E17] transition-colors">{prod.title}</span>
                          <span className="font-sans text-[9px] text-[#7A6B5D] mt-0.5">₹{prod.price.toLocaleString("en-IN")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 2 && suggestions.length === 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-xl z-[90] px-3 py-5 text-center animate-scale-in">
                    <p className="font-sans text-[10px] font-semibold text-[#2C1810] tracking-wide">No products found</p>
                    <p className="font-sans text-[9px] text-[#7A6B5D]/60 mt-0.5">Try a different search term</p>
                  </div>
                )}
              </div>
            </Motion>
          )}
        </AnimatePresence>
      </div>

      <SidebarContent className="scrollbar-thin">
        <Motion
          variants={staggerVariants}
          initial="closed"
          animate={isCollapsed ? "closed" : "open"}
          className="space-y-4"
        >
          {/* Admin Navigation */}
          {user && isAdmin && (
            <SidebarGroup>
              {!isCollapsed && (
                <Motion variants={itemVariants} initial="closed" animate="open">
                  <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase font-sans border-b border-[#D4AF37]/10 pb-1 mb-2.5">
                    Administration
                  </SidebarGroupLabel>
                </Motion>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  <Motion
                    variants={staggerVariants}
                    initial="closed"
                    animate="open"
                  >
                    {adminNavItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Motion
                          key={item.name}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              render={<Link href={item.href} onClick={() => isMobile && toggleSidebar()} />}
                              isActive={isActive}
                              className={cn(
                                "group relative transition-all duration-300 py-3.5 h-auto flex flex-col items-center justify-center text-center rounded-none",
                                isActive
                                  ? "bg-[#4A0E17]/5"
                                  : "bg-transparent hover:bg-[#D4AF37]/5"
                              )}
                              tooltip={item.name}
                            >
                              {!isCollapsed ? (
                                <span className={cn(
                                  "font-serif text-[12.5px] font-normal tracking-[0.16em] uppercase transition-colors duration-300 py-1",
                                  isActive ? "text-[#4A0E17] dark:text-[#D4AF37]" : "text-[#7A6B5D] group-hover:text-[#4A0E17]"
                                )}>
                                  {item.name}
                                </span>
                              ) : (
                                <Icon
                                  className={cn(
                                    "h-4 w-4 transition-all duration-300 mx-auto",
                                    isActive
                                      ? "text-[#4A0E17] dark:text-[#D4AF37]"
                                      : "text-[#7A6B5D] group-hover:text-[#4A0E17] dark:text-[#B89E8A] dark:group-hover:text-[#D4AF37]",
                                  )}
                                />
                              )}
                              {isActive && (
                                <Motion
                                  variants={indicatorVariants}
                                  initial="closed"
                                  animate="open"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                  className="absolute right-2 h-2 w-2 rounded-full bg-[#D4AF37]"
                                />
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Motion>
                      );
                    })}
                  </Motion>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Collections Navigation */}
          <SidebarGroup>
            {!isCollapsed && (
              <Motion variants={itemVariants} initial="closed" animate="open">
                <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase font-sans border-b border-[#D4AF37]/10 pb-1 mb-2.5">
                  Collections
                </SidebarGroupLabel>
              </Motion>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "rounded-lg bg-[#F0E6D8]/60 dark:bg-[#2E1519]/60",
                          isCollapsed ? "h-10 w-10" : "h-10",
                        )}
                      />
                    ))}
                  </div>
                ) : categoriesError ? (
                  <div
                    className={cn(
                      "space-y-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive",
                      isCollapsed && "px-1",
                    )}
                  >
                    {!isCollapsed && (
                      <p className="font-medium leading-snug">
                        Couldn&apos;t load categories
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => void refetchCategories()}
                      className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border bg-background/80 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-background"
                      title="Retry loading categories"
                    >
                      <RefreshCw className="h-3 w-3 shrink-0" />
                      {!isCollapsed && <span>Retry</span>}
                    </button>
                  </div>
                ) : (
                  <Motion
                    variants={staggerVariants}
                    initial="closed"
                    animate="open"
                  >
                    {displayCategories.map((category) => {
                      const isActive = pathname === category.href;
                      const Icon = category.icon;

                      return (
                        <Motion
                          key={category.name}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              render={<Link href={category.href} onClick={() => isMobile && toggleSidebar()} />}
                              isActive={isActive}
                              className={cn(
                                "group relative transition-all duration-300 py-4 h-auto flex flex-col items-center justify-center text-center rounded-none",
                                isActive
                                  ? "bg-[#4A0E17]/5"
                                  : "bg-transparent hover:bg-[#D4AF37]/5"
                              )}
                              tooltip={category.name}
                            >
                              {!isCollapsed ? (
                                <div className="flex flex-col items-center gap-1.5">
                                  <span className={cn(
                                    "font-serif text-[15px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300",
                                    isActive ? "text-[#4A0E17] dark:text-[#D4AF37]" : "text-[#2C1810] group-hover:text-[#4A0E17]"
                                  )}>
                                    {category.name}
                                  </span>
                                  <span className={cn(
                                    "text-[8.5px] font-sans tracking-[0.1em] uppercase font-bold",
                                    isActive ? "text-[#D4AF37]" : "text-[#D4AF37] group-hover:text-[#2C1810]"
                                  )}>
                                    EXPLORE {category.name}
                                  </span>
                                </div>
                              ) : (
                                <Icon
                                  className={cn(
                                    "h-4 w-4 transition-all duration-300 mx-auto",
                                    isActive
                                      ? "text-[#4A0E17] dark:text-[#D4AF37]"
                                      : "text-[#7A6B5D] group-hover:text-[#4A0E17] dark:text-[#B89E8A] dark:group-hover:text-[#D4AF37]",
                                  )}
                                />
                              )}
                              {isActive && (
                                <Motion
                                  variants={indicatorVariants}
                                  initial="closed"
                                  animate="open"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                  className="absolute right-2 h-2 w-2 rounded-full bg-[#D4AF37]"
                                />
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Motion>
                      );
                    })}
                  </Motion>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Account Group inside menu list */}
          {!isCollapsed && (
            <SidebarGroup>
              <Motion variants={itemVariants} initial="closed" animate="open">
                <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase font-sans border-b border-[#D4AF37]/10 pb-1 mb-2.5">
                  Account
                </SidebarGroupLabel>
              </Motion>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {user ? (
                    <>
                      {/* Profile Link */}
                      <Motion variants={itemVariants} initial="closed" animate="open">
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            render={<Link href="/profile" onClick={() => isMobile && toggleSidebar()} />}
                            isActive={pathname === "/profile"}
                            className={cn(
                              "group relative transition-all duration-300 py-4.5 h-auto flex flex-col items-center justify-center text-center rounded-none",
                              pathname === "/profile"
                                ? "bg-[#4A0E17]/5"
                                : "bg-transparent hover:bg-[#D4AF37]/5"
                            )}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <User className={cn("h-4 w-4 stroke-[1.5] transition-colors", pathname === "/profile" ? "text-[#4A0E17]" : "text-[#7A6B5D] group-hover:text-[#4A0E17]")} />
                              <div className="flex flex-col items-center">
                                <span className={cn("font-serif text-[13px] font-medium tracking-[0.16em] uppercase transition-colors duration-300", pathname === "/profile" ? "text-[#4A0E17]" : "text-[#2C1810] group-hover:text-[#4A0E17]")}>
                                  My Profile
                                </span>
                                <span className={cn("text-[8px] font-sans tracking-wide lowercase mt-0.5", pathname === "/profile" ? "text-[#4A0E17]/80" : "text-[#7A6B5D]")}>
                                  Edit details & settings
                                </span>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Motion>

                      {/* Dashboard Link */}
                      <Motion variants={itemVariants} initial="closed" animate="open">
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            render={<Link href="/dashboard" onClick={() => isMobile && toggleSidebar()} />}
                            isActive={pathname === "/dashboard"}
                            className={cn(
                              "group relative transition-all duration-300 py-4.5 h-auto flex flex-col items-center justify-center text-center rounded-none",
                              pathname === "/dashboard"
                                ? "bg-[#4A0E17]/5"
                                : "bg-transparent hover:bg-[#D4AF37]/5"
                            )}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <LayoutDashboard className={cn("h-4 w-4 stroke-[1.5] transition-colors", pathname === "/dashboard" ? "text-[#4A0E17]" : "text-[#7A6B5D] group-hover:text-[#4A0E17]")} />
                              <div className="flex flex-col items-center">
                                <span className={cn("font-serif text-[13px] font-medium tracking-[0.16em] uppercase transition-colors duration-300", pathname === "/dashboard" ? "text-[#4A0E17]" : "text-[#2C1810] group-hover:text-[#4A0E17]")}>
                                  My Dashboard
                                </span>
                                <span className={cn("text-[8px] font-sans tracking-wide lowercase mt-0.5", pathname === "/dashboard" ? "text-[#4A0E17]/80" : "text-[#7A6B5D]")}>
                                  Track orders & details
                                </span>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Motion>

                      {/* Cart Link */}
                      <Motion variants={itemVariants} initial="closed" animate="open">
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            render={<Link href="/cart" onClick={() => isMobile && toggleSidebar()} />}
                            isActive={pathname === "/cart"}
                            className={cn(
                              "group relative transition-all duration-300 py-4.5 h-auto flex flex-col items-center justify-center text-center rounded-none",
                              pathname === "/cart"
                                ? "bg-[#4A0E17]/5"
                                : "bg-transparent hover:bg-[#D4AF37]/5"
                            )}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <ShoppingCart className={cn("h-4 w-4 stroke-[1.5] transition-colors", pathname === "/cart" ? "text-[#4A0E17]" : "text-[#7A6B5D] group-hover:text-[#4A0E17]")} />
                              <div className="flex flex-col items-center">
                                <span className={cn("font-serif text-[13px] font-medium tracking-[0.16em] uppercase transition-colors duration-300", pathname === "/cart" ? "text-[#4A0E17]" : "text-[#2C1810] group-hover:text-[#4A0E17]")}>
                                  Shopping Bag
                                </span>
                                <span className={cn("text-[8px] font-sans tracking-wide lowercase mt-0.5", pathname === "/cart" ? "text-[#4A0E17]/80" : "text-[#7A6B5D]")}>
                                  View items in your bag
                                </span>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Motion>

                      {/* Sign Out Link */}
                      <Motion variants={itemVariants} initial="closed" animate="open">
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={() => {
                              signOut();
                              if (isMobile) toggleSidebar();
                            }}
                            className="group relative transition-all duration-300 py-4.5 h-auto flex flex-col items-center justify-center text-center rounded-none bg-transparent hover:bg-red-50/15 cursor-pointer"
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <LogOut className="h-4 w-4 stroke-[1.5] text-red-500/80 group-hover:text-red-700 transition-colors" />
                              <div className="flex flex-col items-center">
                                <span className="font-serif text-[13px] font-medium tracking-[0.16em] uppercase transition-colors duration-300 text-[#7A6B5D] group-hover:text-red-700">
                                  Sign Out
                                </span>
                                <span className="text-[8px] font-sans tracking-wide text-red-500/80 lowercase mt-0.5">
                                  End your session
                                </span>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Motion>
                    </>
                  ) : (
                    /* Sign In / Sign Up Link */
                    <Motion variants={itemVariants} initial="closed" animate="open">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          render={<Link href="/signin" onClick={() => isMobile && toggleSidebar()} />}
                          isActive={pathname === "/signin"}
                          className={cn(
                            "group relative transition-all duration-300 py-4.5 h-auto flex flex-col items-center justify-center text-center rounded-none",
                            pathname === "/signin"
                              ? "bg-[#4A0E17]/5"
                              : "bg-transparent hover:bg-[#D4AF37]/5"
                          )}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <User className={cn("h-4 w-4 stroke-[1.5] transition-colors", pathname === "/signin" ? "text-[#4A0E17]" : "text-[#7A6B5D] group-hover:text-[#4A0E17]")} />
                            <div className="flex flex-col items-center">
                              <span className={cn("font-serif text-[13px] font-medium tracking-[0.16em] uppercase transition-colors duration-300", pathname === "/signin" ? "text-[#4A0E17]" : "text-[#2C1810] group-hover:text-[#4A0E17]")}>
                                Sign In / Register
                              </span>
                              <span className={cn("text-[8px] font-sans tracking-wide lowercase mt-0.5", pathname === "/signin" ? "text-[#4A0E17]/80" : "text-[#7A6B5D]")}>
                                Unlock private edits & checkout
                              </span>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </Motion>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </Motion>
      </SidebarContent>
 
      {/* User section footer */}
      <SidebarFooter className="border-t border-[#D4AF37]/10 pt-4 pb-24 md:pb-6 px-4">
        {user && (
          isCollapsed ? (
            <div className="relative mx-auto">
              <Avatar className="h-8 w-8 ring-2 ring-[#D4AF37]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#4A0E17] to-[#6B1A24] font-semibold text-[#D4AF37]">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border-2 border-[#FDFBF7] bg-green-500" />
            </div>
          ) : (
            <div className="flex items-center rounded-xl border border-[#D4AF37]/25 bg-[#FFFCF7]/80 p-3 shadow-sm transition-all duration-300">
              <Avatar className="h-9 w-9 ring-2 ring-[#D4AF37]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#4A0E17] to-[#6B1A24] font-semibold text-[#D4AF37]">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#2C1810] dark:text-[#F5E6D8] leading-tight">
                  {user.email?.split("@")[0] || "User"}
                </p>
                <p className="truncate text-[9px] text-[#7A6B5D] dark:text-[#B89E8A] mt-0.5">
                  {user.email}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Online" />
            </div>
          )
        )}

        {/* Social Icons & Signature Branding */}
        {!isCollapsed && (
          <div className="mt-5 flex flex-col items-center gap-3 text-center border-t border-[#D4AF37]/5 pt-4">
            <div className="flex items-center gap-4 text-[#7A6B5D]">
              <a href="https://www.instagram.com/hanger_thedesignervilla" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] hover:scale-115 transition-all duration-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] hover:scale-115 transition-all duration-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] hover:scale-115 transition-all duration-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.56 3.06 8.42 7.25 9.5-.09-.86-.17-2.18.03-3.12.19-.85 1.25-5.32 1.25-5.32s-.32-.64-.32-1.58c0-1.48.86-2.58 1.93-2.58.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.57 1.92 1.89 0 3.35-2 3.35-4.88 0-2.55-1.83-4.33-4.44-4.33-3.03 0-4.8 2.27-4.8 4.61 0 .92.35 1.9 0.79 2.43.09.1.1.17.07.27-.08.33-.26 1.05-.3 1.2-.05.21-.17.26-.38.16-1.4-.65-2.27-2.7-2.27-4.35 0-3.54 2.58-6.8 7.42-6.8 3.9 0 6.93 2.78 6.93 6.49 0 3.88-2.45 7-5.85 7-1.14 0-2.22-.59-2.59-1.28l-.7 2.68c-.25.98-.94 2.21-1.4 2.96C10.74 21.84 11.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </a>
            </div>
            <p className="font-sans text-[7.5px] text-[#7A6B5D] tracking-[0.25em] uppercase font-bold mt-1.5">
              HANGER – THE DESIGNER VILLA
            </p>
          </div>
        )}
      </SidebarFooter>
 
      <SidebarRail />
    </ShadcnSidebar>
  );
}
