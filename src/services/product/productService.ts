import { supabase } from '@/lib/supabase/client';
import { ProductType } from '../../types';
import { isNoRowsError, toUserFacingQueryError } from '@/utils/errorHandling';

export const productService = {
  async getProducts(): Promise<ProductType[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('title');

      if (error) {
        throw toUserFacingQueryError('Products', error);
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error instanceof Error
        ? error
        : toUserFacingQueryError('Products', {});
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
          return null;
        }
        throw toUserFacingQueryError('Product', error);
      }

      return data as ProductType;
    } catch (error) {
      console.error('Error in getProductById:', error);
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

      if (error) {
        throw toUserFacingQueryError('Products', error);
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error instanceof Error
        ? error
        : toUserFacingQueryError('Products', {});
    }
  },

  async searchProducts(query: string): Promise<ProductType[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .ilike('title', `%${query}%`)
        .order('title');

      if (error) {
        throw toUserFacingQueryError('Products', error);
      }

      return data as ProductType[] || [];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error instanceof Error
        ? error
        : toUserFacingQueryError('Products', {});
    }
  },
};
