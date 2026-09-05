import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export type NavSubItem = {
  id: string;
  title: string;
  href: string;
};

export type NavItem = {
  id: string;
  title: string;
  href: string;
  icon: string;
  hasSub: boolean;
  subItems: NavSubItem[];
};

export function useNavigationBuilder() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNav() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "navigation_menu")
          .single();
        
        if (data && data.value) {
          setNavItems(data.value);
        }
      } catch (err) {
        console.error("Failed to load navigation menu", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNav();
  }, []);

  return { navItems, loading };
}
