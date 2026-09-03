"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function getReadablePageName(pathname: string | null) {
  if (!pathname) return "Home";
  if (pathname === "/") return "Home Page";
  if (pathname === "/products") return "All Products";
  if (pathname.startsWith("/products/")) return "Product Details";
  if (pathname.startsWith("/category/")) return "Category Page";
  if (pathname === "/cart") return "Shopping Cart";
  if (pathname === "/checkout") return "Checkout";
  if (pathname === "/profile") return "User Profile";
  if (pathname.startsWith("/admin")) return "Admin Panel";
  if (pathname === "/signin") return "Sign In";
  if (pathname === "/signup") return "Sign Up";
  if (pathname === "/wishlist") return "Wishlist";
  if (pathname === "/contact") return "Contact Us";
  if (pathname === "/about") return "About Us";
  if (pathname === "/new-arrivals") return "New Arrivals";
  if (pathname === "/bestsellers") return "Bestsellers";
  
  // Format generic pages (e.g. /clothing -> Clothing)
  const cleanPath = pathname.replace('/', '').replace(/-/g, ' ');
  return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
}

export function PresenceTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Generate a temporary unique ID for guests
    const visitorId = user?.id || `guest-${Math.random().toString(36).substring(2, 9)}`;

    // Create the presence channel
    const channel = supabase.channel('online-visitors', {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hanger-presence-sync', { detail: state }));
      }
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
          pathname,
          page_name: getReadablePageName(pathname),
          is_logged_in: !!user,
          user_email: user?.email || 'Guest',
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Update presence when pathname changes
  useEffect(() => {
    if (channelRef.current && channelRef.current.state === 'joined') {
      channelRef.current.track({
        online_at: new Date().toISOString(),
        pathname,
        page_name: getReadablePageName(pathname),
        is_logged_in: !!user,
        user_email: user?.email || 'Guest',
      }).catch(console.error);
    }
  }, [pathname, user]);

  return null; // This is a background component, no UI
}
