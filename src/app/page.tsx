import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HorizontalProductCarousel } from "@/components/home/HorizontalProductCarousel";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { productServerService } from "@/services/product/productServerService";
import { createServerSupabase } from "@/lib/supabase/server";

export const revalidate = 30;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await productServerService.getProducts();

  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 8);
  const bestsellers = products.filter(p => p.is_bestseller).slice(0, 8);

  const supabase = await createServerSupabase();
  const { data: siteSettings } = await supabase.from('site_settings').select('*');

  const getSetting = (key: string) => siteSettings?.find(s => s.key === key)?.value;

  const heroBanner = getSetting('hero_banner');
  const homepageMedia = getSetting('homepage_media') || {};

  let initialHeroSlides = null;
  if (heroBanner) {
    if (Array.isArray(heroBanner) && heroBanner.length > 0) {
      initialHeroSlides = heroBanner;
    } else if (heroBanner.mediaUrl || heroBanner.image) {
      initialHeroSlides = [heroBanner];
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-[#F9F6F1]">
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
          {/* Section 1: Hero */}
          <HeroSlider initialSlides={initialHeroSlides} />
          
          {/* Section 2: Categories */}
          <CategoryGrid initialCategories={homepageMedia.category_grid} />
          
          {/* Section 3: New Arrivals / Best Sellers */}
          {newArrivals.length > 0 ? (
            <HorizontalProductCarousel 
              title="NEW ARRIVALS" 
              subtitle="FRESH SILHOUETTES. NEW STATEMENTS."
              products={newArrivals} 
            />
          ) : bestsellers.length > 0 ? (
            <HorizontalProductCarousel 
              title="BEST SELLERS" 
              subtitle="OUR MOST COVETED PIECES."
              products={bestsellers} 
            />
          ) : null}
          
          {/* Section 4: Brand Story */}
          <BrandStory />

          {/* Section 5: Clientele Testimonials */}
          <Testimonials />
          
          {/* Section 6: Social */}
          <InstagramGrid initialData={homepageMedia.instagram_grid} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
