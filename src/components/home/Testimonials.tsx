"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export function Testimonials({ initialTestimonials, initialMedia }: { initialTestimonials?: any[], initialMedia?: any }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials || []);
  const [loading, setLoading] = useState(!initialTestimonials);
  const [media, setMedia] = useState<any>(initialMedia || null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error: _error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }

        const { data: mediaData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_media")
          .single();
          
        if (mediaData && mediaData.value?.couch) {
          setMedia(mediaData.value.couch);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return <div className="py-12 bg-[#FDFBF7]" />;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="pt-2 pb-4 md:pt-4 md:pb-6 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
 
        {/* Top: Curated section (image + text) with Luxury Frame */}
        <div className="relative w-full h-[65vh] min-h-[450px] lg:min-h-[550px] mb-12 lg:mb-20 overflow-hidden shadow-2xl group flex items-center justify-center">
          
          <div className="absolute inset-0 z-0">
            {media?.type === 'video' ? (
              <video src={media.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 filter brightness-75" />
            ) : (
              <Image
                src={media?.mediaUrl || "/images/curated-couch.jpg"}
                alt="Curated Lifestyle"
                fill
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 filter brightness-75"
                priority
              />
            )}
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/40 to-transparent" />
          </div>
          
          {/* Inner frame */}
          <div className="absolute inset-4 lg:inset-6 border border-[#D4AF37]/40 pointer-events-none z-10" />

          {/* Text Content Centered & Elegant */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto mt-20">
            <span className="font-sans text-[10px] lg:text-[11px] font-bold tracking-[0.4em] text-[#D4AF37] mb-5 uppercase">
              THE ART OF LUXURY
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal tracking-wide text-white uppercase leading-[1.1] mb-6 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              CURATED FOR<br />THE WAY YOU LIVE.
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mb-6" />
            <p className="font-sans text-[12px] lg:text-[14px] font-light leading-relaxed text-white/90 mb-8 max-w-xl hidden md:block drop-shadow-md">
              Hanger, The Designer Shop brings together contemporary Indian fashion, handpicked pieces, and thoughtfully selected details—designed to move effortlessly from everyday moments to celebrations.
            </p>
            <Link href="/about" className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#1a1a1a] bg-white px-8 py-3.5 uppercase hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
              OUR STORY
            </Link>
          </div>
        </div>
 
        {/* Bottom: Testimonials Title */}
        <div className="text-center mb-10">
          <span className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] mb-2 uppercase block">
            OUR CLIENTELE
          </span>
          <h2 className="font-serif text-xl md:text-2xl font-normal tracking-[0.08em] text-[#2C1810] uppercase leading-tight max-w-lg mx-auto" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            LOVED BY WOMEN WHO WEAR THEIR STYLE
          </h2>
        </div>
 
        {/* Desktop Layout: 3 Columns Grid with Luxury Double-Borders */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col items-center text-center px-6 py-10 bg-gradient-to-b from-white to-[#FFFDF9] border border-[#D4AF37]/20 rounded-none shadow-sm hover-lift transition-all hover:border-[#D4AF37]/50 duration-350 relative overflow-hidden"
            >
              {/* Inner border outline */}
              <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none group-hover:border-[#D4AF37]/25 transition-colors duration-300" />
              
              <div className="text-[#D4AF37] font-serif text-4xl leading-none mb-4 select-none">&ldquo;</div>
              <p className="font-serif italic text-[11.5px] lg:text-[12.5px] text-[#7A6B5D] mb-6 leading-relaxed flex-1 z-10 px-2" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                {t.content}
              </p>
              
              <div className="mt-auto flex flex-col items-center gap-2 z-10">
                <div className="w-6 h-[1px] bg-[#D4AF37]/30 mb-1" />
                <span className="font-sans text-[9px] lg:text-[9.5px] font-bold tracking-[0.15em] text-[#2C1810] uppercase">
                  {t.name}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="h-2.5 w-2.5 fill-[#D4AF37] text-[#D4AF37] stroke-none" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
 
        {/* Mobile Layout: Interactive Single Slide Carousel with Luxury Cards */}
        <div className="flex md:hidden flex-col items-center w-full mx-auto px-4 py-8 bg-gradient-to-b from-white to-[#FDFBF7] border border-[#D4AF37]/20 shadow-sm relative overflow-hidden">
          {/* Inner border outline */}
          <div className="absolute inset-2 border border-[#D4AF37]/5 pointer-events-none" />
          
          <div className="text-[#D4AF37] font-serif text-3xl leading-none mb-2 select-none">&ldquo;</div>
          
          <div className="min-h-[70px] flex items-center justify-center text-center px-2 z-10 w-full">
            <p className="font-serif italic text-[13px] text-[#7A6B5D] leading-relaxed" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              {testimonials[activeSlide]?.content}
            </p>
          </div>
          
          <div className="mt-5 flex flex-col items-center gap-1.5 z-10">
            <div className="w-4 h-[1px] bg-[#D4AF37]/40 mb-1" />
            <span className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
              {testimonials[activeSlide]?.name}
            </span>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(testimonials[activeSlide]?.rating || 5)].map((_, idx) => (
                <Star key={idx} className="h-2 w-2 fill-[#D4AF37] text-[#D4AF37] stroke-none" />
              ))}
            </div>
          </div>
 
          {/* Pagination and Luxury Gold Arrows */}
          <div className="flex items-center gap-4 mt-6 z-10">
            <button 
              onClick={handlePrev} 
              className="h-6 w-6 flex items-center justify-center rounded-full border border-[#D4AF37]/20 text-[#7A6B5D] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all bg-white cursor-pointer active:scale-90"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-3.5 w-3.5 stroke-[1.5]" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "bg-[#4A0E17] w-3" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext} 
              className="h-6 w-6 flex items-center justify-center rounded-full border border-[#D4AF37]/20 text-[#7A6B5D] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all bg-white cursor-pointer active:scale-90"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
 
        {/* Center Indicators for aesthetic alignment matching the layout */}
        <div className="hidden md:flex justify-center gap-1.5 mt-8">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === 0 ? "bg-[#4A0E17] w-3" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
 
      </div>
    </section>
  );
}
