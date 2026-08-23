import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Story | Hanger The Designer Villa",
  description: "Discover the heritage and craftsmanship behind Hanger The Designer Villa.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 mb-24 md:mb-32">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4">
            Heritage & Vision
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-[#2C1810] uppercase tracking-[0.1em] leading-tight mb-8" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Curating<br /> <span className="italic font-light">Elegance</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#7A6B5D] max-w-2xl mx-auto leading-relaxed">
            Hanger The Designer Villa was born from a singular vision: to bring the finest craftsmanship and most exquisite silhouettes to the modern connoisseur of fashion.
          </p>
        </div>

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#F0E6D8] border border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5">
          <Image 
            src="https://images.unsplash.com/photo-1596458514167-9359c25095d5?q=80&w=2000&auto=format&fit=crop"
            alt="Hanger Boutique Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 lg:px-8 mb-24 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="order-2 md:order-1 relative aspect-[3/4] w-full max-w-md mx-auto md:mx-0 overflow-hidden bg-[#F0E6D8] border border-[#D4AF37]/20">
            <Image 
              src="https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?q=80&w=1200&auto=format&fit=crop"
              alt="Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <span className="font-sans text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-4 border-l-2 border-[#D4AF37] pl-3">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2C1810] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              The Art of <br/>Being You
            </h2>
            <div className="space-y-4 font-sans text-sm text-[#7A6B5D] leading-loose">
              <p>
                We believe that true luxury lies in the details—the perfectly placed stitch, the meticulously sourced fabric, and the silhouette that moves effortlessly with you.
              </p>
              <p>
                Every piece in our collection is selected not just for its aesthetic appeal, but for the story it tells and the confidence it inspires. We are not just selling clothes; we are curating wardrobes for those who appreciate the poetry of design.
              </p>
            </div>
            <div className="mt-10">
              <Link href="/products" className="inline-flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase hover:text-[#D4AF37] transition-colors group">
                <span className="border-b border-[#2C1810] group-hover:border-[#D4AF37] pb-1 transition-colors">Explore The Collection</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Boutique */}
      <section className="bg-[#2C1810] py-24 md:py-32 text-center text-[#FDFBF7]">
        <div className="container mx-auto px-4">
          <span className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-6">
            Visit Us
          </span>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[0.15em] mb-8" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            The Designer Villa
          </h2>
          <p className="font-sans text-sm text-[#B89E8A] max-w-lg mx-auto leading-relaxed mb-12">
            Experience our curation in person. Our villa is designed to be a sanctuary of style, where you can explore our collections with personalized styling advice.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 font-sans text-xs tracking-widest text-[#D4AF37] uppercase">
            <div>
              <p className="font-bold mb-2">Location</p>
              <p className="text-[#FDFBF7] font-normal leading-loose">
                123 Luxury Avenue<br/>
                Fashion District, 110001
              </p>
            </div>
            <div>
              <p className="font-bold mb-2">Hours</p>
              <p className="text-[#FDFBF7] font-normal leading-loose">
                Mon - Sat: 11:00 AM - 8:00 PM<br/>
                Sun: By Appointment
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
