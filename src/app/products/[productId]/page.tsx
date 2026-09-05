import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import { productServerService } from "@/services/product/productServerService";

interface ProductDetailsPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const product = await productServerService.getProductById(
    resolvedParams.productId,
  );

  if (!product) {
    notFound();
  }

  let relatedProducts: any[] = [];
  if (product.category_id) {
    const categoryProducts = await productServerService.getProductsByCategory(product.category_id);
    relatedProducts = categoryProducts
      .filter((p) => p.product_id !== product.product_id)
      .slice(0, 4);
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
