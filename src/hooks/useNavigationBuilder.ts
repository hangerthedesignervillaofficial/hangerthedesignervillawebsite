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
        
        if (data && data.value && data.value.length > 0) {
          setNavItems(data.value);
        } else {
          // Fallback Default Navigation Structure if CMS is empty
          setNavItems([
            {
              id: 'clothing',
              title: 'Clothing',
              href: '/clothing',
              icon: 'shirt',
              hasSub: true,
              subItems: [
                { id: 'c1', title: 'Dresses', href: '/clothing?category=dresses' },
                { id: 'c2', title: 'Tops', href: '/clothing?category=tops' },
                { id: 'c3', title: 'Bottoms', href: '/clothing?category=bottoms' },
                { id: 'c4', title: 'Outerwear', href: '/clothing?category=outerwear' }
              ]
            },
            {
              id: 'jewellery',
              title: 'Jewellery',
              href: '/jewellery',
              icon: 'gem',
              hasSub: true,
              subItems: [
                { id: 'j1', title: 'Necklaces', href: '/jewellery?category=necklaces' },
                { id: 'j2', title: 'Earrings', href: '/jewellery?category=earrings' },
                { id: 'j3', title: 'Rings', href: '/jewellery?category=rings' },
                { id: 'j4', title: 'Bracelets', href: '/jewellery?category=bracelets' }
              ]
            },
            {
              id: 'accessories',
              title: 'Accessories',
              href: '/accessories',
              icon: 'bag',
              hasSub: true,
              subItems: [
                { id: 'a1', title: 'Handbags', href: '/accessories?category=handbags' },
                { id: 'a2', title: 'Belts', href: '/accessories?category=belts' },
                { id: 'a3', title: 'Scarves', href: '/accessories?category=scarves' },
                { id: 'a4', title: 'Sunglasses', href: '/accessories?category=sunglasses' }
              ]
            },
            {
              id: 'footwear',
              title: 'Footwear',
              href: '/footwear',
              icon: 'shoe',
              hasSub: true,
              subItems: [
                { id: 'f1', title: 'Heels', href: '/footwear?category=heels' },
                { id: 'f2', title: 'Flats', href: '/footwear?category=flats' },
                { id: 'f3', title: 'Boots', href: '/footwear?category=boots' },
                { id: 'f4', title: 'Sneakers', href: '/footwear?category=sneakers' }
              ]
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load navigation menu", err);
        // Ensure fallback even on error
        setNavItems([
            {
              id: 'clothing',
              title: 'Clothing',
              href: '/clothing',
              icon: 'shirt',
              hasSub: true,
              subItems: [
                { id: 'c1', title: 'Dresses', href: '/clothing?category=dresses' },
                { id: 'c2', title: 'Tops', href: '/clothing?category=tops' }
              ]
            }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchNav();
  }, []);

  return { navItems, loading };
}
