"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_new_arrival", true)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 min-h-[70vh]">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="font-serif text-3xl md:text-5xl text-[#2C1810] tracking-wider mb-4 uppercase">New Arrivals</h1>
        <div className="w-16 h-px bg-[#D4AF37] mb-6" />
        <p className="font-sans text-sm md:text-base text-[#7A6B5D] tracking-wide max-w-2xl">Discover the latest additions to our luxury collection.</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-sans text-lg text-[#2C1810] mb-2">No new arrivals found</p>
          <p className="font-sans text-sm text-[#7A6B5D]">Check back soon for the latest pieces.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} badge="NEW" />
          ))}
        </div>
      )}
    </div>
  );
}
