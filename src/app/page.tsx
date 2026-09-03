import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HorizontalProductCarousel } from "@/components/home/HorizontalProductCarousel";
import { HangerEditsGrid } from "@/components/home/HangerEditsGrid";
import { ShopByMood } from "@/components/home/ShopByMood";
import { DressedToMakeImpression } from "@/components/home/DressedToMakeImpression";
import { MomentsBanner } from "@/components/home/MomentsBanner";
import { AsymmetricalFeatureGrid } from "@/components/home/AsymmetricalFeatureGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { productServerService } from "@/services/product/productServerService";
import { createServerSupabase } from "@/lib/supabase/server";

// Revalidate every 30 seconds so admin changes (product flags, CMS) reflect on live site quickly
export const revalidate = 30;

export default async function Home() {
  const products = await productServerService.getProducts();

  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 8);
  const bestsellers = products.filter(p => p.is_bestseller).slice(0, 8);

  // "The Hanger Edit" section — products tagged via admin display_tags
  // Falls back to bestsellers if no tagged products exist
  const hangerEditTagged = products.filter(
    p => p.display_tags?.includes('The Hanger Edit')
  ).slice(0, 4);
  
  // Premium fallback data for Hanger Edit if no products are tagged
  const dummyHangerEdit = [
    { product_id: 'edit-1', title: 'Midnight Velvet Obsidian Gown', price: 145000, image: '/images/hero-banner.jpg', type: 'dummy' },
    { product_id: 'edit-2', title: 'Golden Zari Handwoven Saree', price: 85000, image: '/images/moments-banner.jpg', type: 'dummy' },
    { product_id: 'edit-3', title: 'Polki Emerald Choker Set', price: 215000, image: '/images/jewellery.jpg', type: 'dummy' },
    { product_id: 'edit-4', title: 'Royal Maroon Bridal Lehenga', price: 325000, image: '/images/clothing.jpg', type: 'dummy' }
  ];

  const theHangerEdit = hangerEditTagged.length >= 2 
    ? hangerEditTagged 
    : bestsellers.length >= 4 
      ? bestsellers.slice(0, 4) 
      : dummyHangerEdit as any[];

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
      <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
          <HeroSlider initialSlides={initialHeroSlides} />
          <CategoryGrid initialCategories={homepageMedia.category_grid} />
          
          {newArrivals.length > 0 && (
            <HorizontalProductCarousel 
              title="NEW ARRIVALS" 
              subtitle="Fresh silhouettes. New statements."
              products={newArrivals} 
            />
          )}
          
          <MomentsBanner initialData={homepageMedia.moments_banner} />
          
          <ShopByMood initialMoods={homepageMedia.shop_by_mood} />
          
          {/* Hanger Edits: always shown — tagged products first, bestsellers as fallback */}
          {theHangerEdit.length > 0 && (
            <HangerEditsGrid products={theHangerEdit} />
          )}

          {bestsellers.length > 0 && (
            <HorizontalProductCarousel 
              title="BEST SELLERS" 
              subtitle="Our most coveted pieces."
              products={bestsellers} 
            />
          )}

          <AsymmetricalFeatureGrid initialData={homepageMedia.asymmetrical_grid} />
          
          <DressedToMakeImpression initialData={homepageMedia.dressed_to_impress} />
          <Testimonials initialMedia={homepageMedia.couch} />
          
          <InstagramGrid initialData={homepageMedia.instagram_grid} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
