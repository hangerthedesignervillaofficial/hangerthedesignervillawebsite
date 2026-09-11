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
          .from("categories")
          .select("id, name")
          .order('name');
        
        if (data && data.length > 0) {
          const items: NavItem[] = data.map((cat: any) => ({
            id: cat.id.toString(),
            title: cat.name,
            href: `/products?category=${cat.id}`,
            icon: 'FolderHeart', // Default elegant icon since categories table lacks icons
            hasSub: true, // Always true to enable product dropdowns
            subItems: []
          }));
          setNavItems(items);
        } else {
          setNavItems([]);
        }
      } catch (err) {
        console.error("Failed to load categories for navigation", err);
        setNavItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNav();
  }, []);

  return { navItems, loading };
}
