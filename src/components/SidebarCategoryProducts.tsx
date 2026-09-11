"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ProductType } from "@/types";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import Image from "next/image";

interface SidebarCategoryProductsProps {
  categoryId?: string | number;
  subCategoryId?: string | number;
  href?: string;
  handleClose: () => void;
}

export function SidebarCategoryProducts({
  categoryId,
  subCategoryId,
  href,
  handleClose,
}: SidebarCategoryProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from("products")
          .select("product_id, title, price, image, category_id");

        if (subCategoryId) {
          query = query.eq("category_id", subCategoryId);
        } else if (categoryId) {
          // Check if this category has subcategories
          const { data: subCats } = await supabase
            .from("categories")
            .select("id")
            .eq("parent_id", categoryId);

          if (subCats && subCats.length > 0) {
            const allCatIds = [
              Number(categoryId),
              ...subCats.map((s) => s.id),
            ];
            query = query.in("category_id", allCatIds);
          } else {
            query = query.eq("category_id", categoryId);
          }
        } else if (href && href.includes("category=")) {
          const extractedCatId = href.split("category=")[1];
          // Check if this category has subcategories
          const { data: subCats } = await supabase
            .from("categories")
            .select("id")
            .eq("parent_id", extractedCatId);

          if (subCats && subCats.length > 0) {
            const allCatIds = [
              Number(extractedCatId),
              ...subCats.map((s) => s.id),
            ];
            query = query.in("category_id", allCatIds);
          } else {
            query = query.eq("category_id", extractedCatId);
          }
        }

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(4);

        if (!error && data) {
          setProducts(data as ProductType[]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching sidebar products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryId, subCategoryId, href]);

  const targetHref =
    subCategoryId
      ? `/products?category=${subCategoryId}`
      : categoryId
        ? `/products?category=${categoryId}`
        : href || "/products";

  if (loading) {
    return (
      <div className="pt-2 pb-3 pl-3 flex flex-col gap-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-[#2C1810]/5 rounded-sm shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-28 bg-[#2C1810]/10 rounded-xs" />
              <div className="h-2 w-16 bg-[#2C1810]/5 rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pt-2 pb-3 pl-3">
        <p className="text-[10px] text-[#7A6B5D]/60 font-sans uppercase tracking-wider flex items-center gap-1.5">
          <Package className="w-3 h-3 text-[#D4AF37]/50" />
          No products listed yet in this section
        </p>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-3 pl-3 flex flex-col gap-2.5 relative before:absolute before:left-1 before:top-2 before:bottom-3 before:w-[1px] before:bg-[#D4AF37]/20">
      {products.map((product) => (
        <Link
          key={product.product_id}
          href={`/products/${product.product_id}`}
          onClick={handleClose}
          className="flex items-center gap-3 group py-1 transition-all"
        >
          <div className="w-11 h-11 relative overflow-hidden bg-[#f4f0ea] border border-[#D4AF37]/20 shrink-0 rounded-xs shadow-xs group-hover:border-[#D4AF37] transition-colors">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[11px] tracking-[0.08em] text-[#2C1810]/90 group-hover:text-[#D4AF37] transition-colors duration-200 line-clamp-1 leading-tight mb-0.5">
              {product.title}
            </span>
            <span className="font-sans text-[10px] text-[#7A6B5D] font-semibold tracking-wider">
              ₹{product.price?.toLocaleString("en-IN") ?? 0}
            </span>
          </div>
        </Link>
      ))}

      <Link
        href={targetHref}
        onClick={handleClose}
        className="mt-1 font-sans text-[9px] tracking-[0.2em] text-[#D4AF37] font-bold uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
      >
        View Collection <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
