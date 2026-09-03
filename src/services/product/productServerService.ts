import { createServerSupabase } from '@/lib/supabase/server';
import { ProductType } from '@/types';

export const productServerService = {
  async getProducts(): Promise<ProductType[]> {
    try {
      const supabase = await createServerSupabase();
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

  async getProductById(id: string): Promise<ProductType | null> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('product_id', id)
        .single();

      if (error || !data) {
        console.error('Server error fetching product by ID:', error);
        return null;
      }

      return data as ProductType;
    } catch (error) {
      console.error('Server error in getProductById:', error);
      return null;
    }
  },

  async getProductsByCategory(categoryId: number): Promise<ProductType[]> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('category_id', categoryId)
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
      const supabase = await createServerSupabase();
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
