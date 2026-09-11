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

      // 2. Fetch top products
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (productError) throw productError;

      // 3. Separate main categories (parent_id is null/falsy)
      const mainCategories = categories.filter((c: CategoryType) => !c.parent_id);

      // 4. Map main categories with their subcategories and combined products
      const menuData: NavMenuData[] = mainCategories.map((cat: CategoryType) => {
        const subcategories = categories.filter((c: CategoryType) => c.parent_id === cat.id);
        const subIds = subcategories.map((s: CategoryType) => s.id);
        const allCategoryIds = [cat.id, ...subIds];

        const categoryProducts = (products || [])
          .filter((p: ProductType) => p.category_id && allCategoryIds.includes(p.category_id))
          .slice(0, 8);
        
        return {
          category: {
            ...cat,
            subcategories,
          },
          products: categoryProducts,
        };
      });

      // 5. Inject Bestsellers and New Arrivals
      const bestsellers = (products || []).filter(p => p.is_bestseller).slice(0, 8);
      const newArrivals = (products || []).filter(p => p.is_new_arrival).slice(0, 8);

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
