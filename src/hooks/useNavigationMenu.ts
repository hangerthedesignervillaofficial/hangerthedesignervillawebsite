import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { CategoryType, ProductType } from "@/types";

export interface NavMenuData {
  category: CategoryType;
  products: ProductType[];
}

export function useNavigationMenu() {
  return useQuery({
    queryKey: ["navigationMenuData"],
    queryFn: async (): Promise<NavMenuData[]> => {
      // 1. Fetch all categories
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (categoryError) throw categoryError;
      if (!categories || categories.length === 0) return [];

      // 2. Fetch top products for these categories
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (productError) throw productError;

      // 3. Group products by category_id, taking up to 8 per category
      const menuData: NavMenuData[] = categories.map((cat: CategoryType) => {
        const categoryProducts = (products || [])
          .filter((p: ProductType) => p.category_id === cat.id)
          .slice(0, 8);
        
        return {
          category: cat,
          products: categoryProducts,
        };
      });

      // 4. Inject Bestsellers and New Arrivals
      const bestsellers = (products || []).filter(p => p.is_bestseller).slice(0, 8);
      const newArrivals = (products || []).filter(p => p.is_new_arrival).slice(0, 8);

      // We'll push them as special categories with string IDs to distinguish them, 
      // but since CategoryType expects number ID, we'll use negative numbers.
      menuData.unshift({
        category: { id: -1, name: "New Arrivals", description: "Discover the latest premium additions to our collection." },
        products: newArrivals
      });
      menuData.unshift({
        category: { id: -2, name: "Best Sellers", description: "Our most loved and sought-after designer pieces." },
        products: bestsellers
      });

      return menuData;
    },
    staleTime: 1000 * 60 * 15,
  });
}
