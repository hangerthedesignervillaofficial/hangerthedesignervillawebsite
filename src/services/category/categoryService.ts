import { supabase } from '@/lib/supabase/client';
import { CategoryType } from '../../types';
import { isNoRowsError, toUserFacingQueryError } from '@/utils/errorHandling';
import { mockCategories } from '@/utils/mockData';

export const categoryService = {
  async getCategories(): Promise<CategoryType[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error || !data || data.length === 0) {
        console.warn('Falling back to mock categories:', error);
        return mockCategories as CategoryType[];
      }

      return data as CategoryType[];
    } catch (error) {
      console.warn('Falling back to mock categories after catch:', error);
      return mockCategories as CategoryType[];
    }
  },

  async getCategoryById(id: number): Promise<CategoryType | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (isNoRowsError(error)) {
          const mockMatch = mockCategories.find(c => c.id === id);
          return (mockMatch as CategoryType) || null;
        }
        console.warn('Falling back to mock category due to error:', error);
        const mockMatch = mockCategories.find(c => c.id === id);
        if (mockMatch) return mockMatch as CategoryType;
        throw toUserFacingQueryError('Category', error);
      }

      return data as CategoryType;
    } catch (error) {
      console.warn('Falling back to mock category after catch:', error);
      const mockMatch = mockCategories.find(c => c.id === id);
      if (mockMatch) return mockMatch as CategoryType;
      throw error instanceof Error
        ? error
        : toUserFacingQueryError('Category', {});
    }
  },
};
