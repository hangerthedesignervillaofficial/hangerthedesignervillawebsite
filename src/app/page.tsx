import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HorizontalProductCarousel } from "@/components/home/HorizontalProductCarousel";
import { ShopByMood } from "@/components/home/ShopByMood";
import { DressedToMakeImpression } from "@/components/home/DressedToMakeImpression";
import { MomentsBanner } from "@/components/home/MomentsBanner";
import { AsymmetricalFeatureGrid } from "@/components/home/AsymmetricalFeatureGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { productService } from "@/services/product/productService";

export default async function Home() {
  const products = await productService.getProducts();

  // Create two different subsets for the carousels to make them look distinct
  const newArrivals = products.slice(0, 8);
  const theHangerEdit = [...products].reverse().slice(0, 8);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
          <HeroSlider />
          <CategoryGrid />
          
          {newArrivals.length > 0 && (
            <HorizontalProductCarousel 
              title="NEW ARRIVALS" 
              subtitle="Fresh silhouettes. New statements."
              products={newArrivals} 
            />
          )}
          
          <MomentsBanner />
          
          <ShopByMood />
          
          {theHangerEdit.length > 0 && (
            <HorizontalProductCarousel 
              title="THE HANGER EDIT" 
              subtitle="Premium handpicked pieces, getting back to you."
              products={theHangerEdit} 
            />
          )}

          <AsymmetricalFeatureGrid />
          
          <DressedToMakeImpression />
          <Testimonials />
          
          <InstagramGrid />
        </main>
      </div>
    </ErrorBoundary>
  );
}
