import { productServerService } from '@/services/product/productServerService';
import { ProductType } from '@/types';

export async function getProductByIdServer(
  id: string
): Promise<ProductType | null> {
  return productServerService.getProductById(id);
}
