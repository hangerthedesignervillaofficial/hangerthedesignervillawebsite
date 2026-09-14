import { notFound, redirect } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import { productServerService } from "@/services/product/productServerService";
import { slugify } from "@/utils/productSlug";

// ISR edge caching: cache product page for 60 seconds
export const revalidate = 60;

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

  // Canonical luxury URL redirection:
  // If user arrives via a UUID (e.g. /products/805cd194-...), redirect to the clean luxury slug URL
  const canonicalSlug = product.title ? slugify(product.title) : null;
  const currentParam = decodeURIComponent(resolvedParams.productId).trim().toLowerCase();
  if (canonicalSlug && currentParam !== canonicalSlug) {
    redirect(`/products/${canonicalSlug}`);
  }

  let relatedProducts: any[] = [];
  if (product.category_id) {
    const categoryProducts = await productServerService.getProductsByCategory(product.category_id);
    relatedProducts = categoryProducts
      .filter((p) => p.product_id !== product.product_id)
      .slice(0, 16);
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
