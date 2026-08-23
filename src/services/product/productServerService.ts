import { createServerSupabase } from '@/lib/supabase/server';
import { ProductType } from '@/types';
import { getProductsWithCategories } from '@/utils/mockData';

export const productServerService = {
  async getProducts(): Promise<ProductType[]> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('title');

      if (error || !data || data.length === 0) {
        console.warn('Server: Falling back to mock products:', error);
        return getProductsWithCategories() as ProductType[];
      }

      return data as ProductType[];
    } catch (error) {
      console.warn('Server: Falling back to mock products after catch:', error);
      return getProductsWithCategories() as ProductType[];
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
        console.warn('Server: Falling back to mock product by ID due to query issue:', error);
        const mockMatch = getProductsWithCategories().find(p => p.product_id === id);
        return (mockMatch as ProductType) || null;
      }

      return data as ProductType;
    } catch (error) {
      console.warn('Server: Falling back to mock product by ID after catch:', error);
      const mockMatch = getProductsWithCategories().find(p => p.product_id === id);
      return (mockMatch as ProductType) || null;
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

      if (error || !data || data.length === 0) {
        console.warn('Server: Falling back to mock products by category:', error);
        return getProductsWithCategories().filter(p => p.category_id === categoryId) as ProductType[];
      }

      return data as ProductType[];
    } catch (error) {
      console.warn('Server: Falling back to mock products by category after catch:', error);
      return getProductsWithCategories().filter(p => p.category_id === categoryId) as ProductType[];
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

      if (error || !data || data.length === 0) {
        console.warn('Server: Falling back to mock search products:', error);
        return getProductsWithCategories().filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        ) as ProductType[];
      }

      return data as ProductType[];
    } catch (error) {
      console.warn('Server: Falling back to mock search products after catch:', error);
      return getProductsWithCategories().filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ) as ProductType[];
    }
  },
};
