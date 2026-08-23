import { supabase } from '@/lib/supabase/client';
import { ProductType } from '../../types';
import { isNoRowsError, toUserFacingQueryError } from '@/utils/errorHandling';
import { getProductsWithCategories } from '@/utils/mockData';

export const productService = {
  async getProducts(): Promise<ProductType[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('title');

      if (error || !data || data.length === 0) {
        console.warn('Falling back to mock products:', error);
        return getProductsWithCategories() as ProductType[];
      }

      return data as ProductType[];
    } catch (error) {
      console.warn('Falling back to mock products after catch:', error);
      return getProductsWithCategories() as ProductType[];
    }
  },

  async getProductById(id: string): Promise<ProductType | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('product_id', id)
        .single();

      if (error) {
        if (isNoRowsError(error)) {
          const mockMatch = getProductsWithCategories().find(p => p.product_id === id);
          return (mockMatch as ProductType) || null;
        }
        console.warn('Falling back to mock product due to error:', error);
        const mockMatch = getProductsWithCategories().find(p => p.product_id === id);
        if (mockMatch) return mockMatch as ProductType;
        throw toUserFacingQueryError('Product', error);
      }

      return data as ProductType;
    } catch (error) {
      console.warn('Falling back to mock product after catch:', error);
      const mockMatch = getProductsWithCategories().find(p => p.product_id === id);
      if (mockMatch) return mockMatch as ProductType;
      throw error instanceof Error
        ? error
        : toUserFacingQueryError('Product', {});
    }
  },

  async getProductsByCategory(categoryId: number): Promise<ProductType[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('category_id', categoryId)
        .order('title');

      if (error || !data || data.length === 0) {
        console.warn('Falling back to mock products by category:', error);
        return getProductsWithCategories().filter(p => p.category_id === categoryId) as ProductType[];
      }

      return data as ProductType[];
    } catch (error) {
      console.warn('Falling back to mock products by category after catch:', error);
      return getProductsWithCategories().filter(p => p.category_id === categoryId) as ProductType[];
    }
  },
};
