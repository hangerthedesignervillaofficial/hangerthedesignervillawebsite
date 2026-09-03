"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/product/productService";
import { categoryService } from "@/services/category/categoryService";
import { ProductType, CategoryType } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const categoryId = parseInt(id as string);
          
          const [catData, prodsData] = await Promise.all([
            categoryService.getCategoryById(categoryId),
            productService.getProductsByCategory(categoryId)
          ]);
          
          setCategory(catData);
          setProducts(prodsData);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-3xl text-[#2C1810] mb-4">Category Not Found</h1>
        <p className="font-sans text-[#7A6B5D]">The category you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 min-h-[70vh]">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="font-serif text-3xl md:text-5xl text-[#2C1810] tracking-wider mb-4 uppercase">{category.name}</h1>
        <div className="w-16 h-px bg-[#D4AF37] mb-6" />
        {category.description && (
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] tracking-wide max-w-2xl">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-sans text-lg text-[#2C1810] mb-2">No products found</p>
          <p className="font-sans text-sm text-[#7A6B5D]">We're currently curating our collection for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
