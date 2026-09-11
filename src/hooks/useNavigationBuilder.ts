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
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, parent_id")
          .order("id");

        if (error) throw error;

        if (data && data.length > 0) {
          const mainCategories = data.filter((c) => !c.parent_id);

          const items: NavItem[] = mainCategories.map((cat: any) => {
            const children: NavSubItem[] = data
              .filter((c) => c.parent_id === cat.id)
              .map((sub: any) => ({
                id: sub.id.toString(),
                title: sub.name,
                href: `/products?category=${sub.id}`,
              }));

            return {
              id: cat.id.toString(),
              title: cat.name,
              href: `/products?category=${cat.id}`,
              icon: "FolderHeart",
              hasSub: true,
              subItems: children,
            };
          });

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
