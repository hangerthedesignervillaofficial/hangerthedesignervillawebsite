"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ProductType } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function SidebarCategoryProducts({ href, handleClose }: { href: string; handleClose: () => void }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase.from("products").select("product_id, title, price, image");
        
        // Extract category_id if present
        if (href.includes("category=")) {
          const catId = href.split("category=")[1];
          query = query.eq("category_id", catId);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(4);
        
        if (!error && data) {
          setProducts(data as ProductType[]);
        }
      } catch (error) {
        console.error("Error fetching sidebar products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [href]);

  if (loading) {
    return (
      <div className="pt-2 pb-4 pl-4 flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-[#2C1810]/5 rounded-sm" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-24 bg-[#2C1810]/10 rounded" />
              <div className="h-2 w-16 bg-[#2C1810]/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pt-2 pb-4 pl-4">
        <p className="text-[10px] text-[#2C1810]/40 font-sans uppercase">No items found</p>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4 pl-4 flex flex-col gap-3 relative before:absolute before:left-1.5 before:top-2 before:bottom-4 before:w-[1px] before:bg-[#2C1810]/10">
      {products.map((product) => (
        <Link
          key={product.product_id}
          href={`/products/${product.product_id}`}
          onClick={handleClose}
          className="flex items-center gap-3 group py-1"
        >
          <div className="w-10 h-10 relative overflow-hidden bg-[#f4f0ea] border border-[#2C1810]/5 shrink-0 rounded-sm shadow-sm group-hover:border-[#D4AF37]/40 transition-colors">
            {product.image && (
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[11px] tracking-[0.1em] text-[#2C1810]/80 group-hover:text-[#D4AF37] transition-colors duration-200 line-clamp-1 leading-tight mb-0.5">
              {product.title}
            </span>
            <span className="font-sans text-[9px] text-[#7A6B5D] font-medium tracking-wider">
              ₹{product.price?.toLocaleString("en-IN") ?? 0}
            </span>
          </div>
        </Link>
      ))}
      <Link
        href={href}
        onClick={handleClose}
        className="mt-2 font-sans text-[9px] tracking-[0.25em] text-[#D4AF37] font-bold uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
      >
        Explore Category <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
