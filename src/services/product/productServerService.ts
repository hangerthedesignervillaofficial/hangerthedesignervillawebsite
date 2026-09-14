import { createStaticSupabase } from '@/lib/supabase/server';
import { ProductType } from '@/types';
import { slugify } from '@/utils/productSlug';

export const productServerService = {
  async getProducts(): Promise<ProductType[]> {
    try {
      const supabase = createStaticSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('title');

      if (error) {
        console.error('Server error fetching products:', error);
        return [];
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Server error in getProducts:', error);
      return [];
    }
  },

  async getProductById(idOrSlug: string): Promise<ProductType | null> {
    try {
      if (!idOrSlug) return null;
      const supabase = createStaticSupabase();
      const decodedParam = decodeURIComponent(idOrSlug).trim().toLowerCase();

      // 1. Direct UUID match (e.g. e5dd3cb1-7ee0-40d9-b8b7-7b6f398e20b9)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedParam);
      if (isUUID) {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('product_id', decodedParam)
          .single();

        if (data) return data as ProductType;
      }

      // 2. Trailing UUID in slug (e.g. title-slug--[uuid] or title-slug-[uuid])
      const uuidMatch = decodedParam.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
      if (uuidMatch) {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('product_id', uuidMatch[1])
          .single();

        if (data) return data as ProductType;
      }

      // 3. Clean Title Slug Match (e.g. "sicilian-sunset-linen-blend-midi-dress")
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('*, category:categories(*)');

      if (error || !allProducts) {
        console.error('Server error fetching products for slug resolution:', error);
        return null;
      }

      // Exact slug match
      const exactMatch = allProducts.find(
        (p) => slugify(p.title) === decodedParam
      );
      if (exactMatch) return exactMatch as ProductType;

      // Fuzzy fallback
      const partialMatch = allProducts.find((p) => {
        const s = slugify(p.title);
        return s.length > 0 && (s.includes(decodedParam) || decodedParam.includes(s));
      });
      if (partialMatch) return partialMatch as ProductType;

      return null;
    } catch (error) {
      console.error('Server error in getProductById:', error);
      return null;
    }
  },

  async getProductsByCategory(categoryId: number): Promise<ProductType[]> {
    try {
      const supabase = createStaticSupabase();

      // Check if this category has child subcategories
      const { data: subcategories } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', categoryId);

      const targetIds = [categoryId];
      if (subcategories && subcategories.length > 0) {
        subcategories.forEach((sub: { id: number }) => targetIds.push(sub.id));
      }

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .in('category_id', targetIds)
        .order('title');

      if (error) {
        console.error('Server error fetching products by category:', error);
        return [];
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Server error in getProductsByCategory:', error);
      return [];
    }
  },

  async searchProducts(query: string): Promise<ProductType[]> {
    try {
      const supabase = createStaticSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .ilike('title', `%${query}%`)
        .order('title');

      if (error) {
        console.error('Server error searching products:', error);
        return [];
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Server error in searchProducts:', error);
      return [];
    }
  },
};
