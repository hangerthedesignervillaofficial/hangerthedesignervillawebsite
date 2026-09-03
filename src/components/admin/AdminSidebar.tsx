"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  XCircle, 
  MessageSquare, 
  Mail, 
  ShoppingCart as CartIcon, 
  Activity, 
  Settings, 
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Cancellations", href: "/admin/cancellations", icon: XCircle },
  { name: "Restock Requests", href: "/admin/notifications", icon: Bell },
  { name: "Abandoned Carts", href: "/admin/abandoned-carts", icon: CartIcon },
  { name: "Testimonials", href: "/admin/reviews", icon: MessageSquare },
  { name: "Contact Us", href: "/admin/contact", icon: Mail },
  { name: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { name: "Live Traffic", href: "/admin/traffic", icon: Activity },
  { name: "Website CMS", href: "/admin/cms", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="h-20 flex flex-col items-center justify-center border-b border-[#D4AF37]/20 shrink-0">
        <span className="font-serif text-[18px] tracking-[0.25em] uppercase text-[#D4AF37]">
          HANGER
        </span>
        <span className="font-sans text-[7px] font-bold tracking-[0.35em] text-[#FFFDFC]/70 uppercase">
          Admin Portal
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative ${
                  isActive 
                    ? "text-[#D4AF37] bg-[#D4AF37]/10" 
                    : "text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]" 
                  />
                )}
                <item.icon className={`h-4 w-4 stroke-[1.5] ${isActive ? "text-[#D4AF37]" : "text-white/50"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#D4AF37]/20 shrink-0">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-[10px] font-bold tracking-[0.15em] uppercase text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#2C1810] border-b border-[#D4AF37]/20 flex items-center justify-between px-4 z-40">
        <div className="flex flex-col">
          <span className="font-serif text-[14px] tracking-[0.25em] uppercase text-[#D4AF37]">
            HANGER
          </span>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Content */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#2C1810] border-r border-[#D4AF37]/20 z-50 flex flex-col shadow-2xl"
          >
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#2C1810] min-h-screen border-r border-[#D4AF37]/20 flex-col fixed left-0 top-0 z-40 text-white shadow-2xl">
        <SidebarContent />
      </div>
    </>
  );
}
