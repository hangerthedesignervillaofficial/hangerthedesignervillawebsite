/**
 * Helper utilities for professional e-commerce product URL slugs
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except hyphen & space
    .replace(/\s+/g, '-')     // replace spaces with single hyphen
    .replace(/-+/g, '-');     // collapse multiple hyphens
}

/**
 * Returns a clean, professional e-commerce URL path for a product.
 * Example:
 * Title: "Sicilian Sunset Linen Blend Midi Dress"
 * Output: "/products/sicilian-sunset-linen-blend-midi-dress"
 */
export function getProductUrl(product: { product_id: string; title?: string }): string {
  if (!product) return '/products';
  if (product.title) {
    const slug = slugify(product.title);
    if (slug) {
      return `/products/${slug}`;
    }
  }
  return `/products/${product.product_id}`;
}
