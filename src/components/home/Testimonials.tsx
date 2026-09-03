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
    <section className="pt-4 pb-8 md:pt-6 md:pb-12 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
 
        {/* Top: Curated section (image + text) with Luxury Frame */}
        <div className="flex flex-col md:flex-row border-2 border-[#D4AF37]/25 mb-8 md:mb-12 overflow-hidden bg-gradient-to-br from-[#FFFDFC] to-[#FDFBF7] shadow-lg shadow-[#D4AF37]/5 w-full relative">
          {/* Inner decorative border */}
          <div className="absolute inset-3 border border-[#D4AF37]/10 pointer-events-none z-10" />
          
          <div className="w-full md:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start relative z-20 bg-white/40 backdrop-blur-sm">
            <span className="font-sans text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] mb-3 uppercase">
              THE ART OF LUXURY
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.06em] text-[#2C1810] uppercase leading-tight mb-4" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              CURATED FOR<br />THE WAY<br />YOU LIVE.
            </h2>
            <p className="hidden md:block font-sans text-[11px] md:text-[12px] font-light leading-relaxed text-[#7A6B5D] mb-8">
              Hanger, The Designer Shop brings together contemporary Indian fashion, handpicked pieces, and thoughtfully selected details—designed to move effortlessly from everyday moments to celebrations.
            </p>
            <Link href="/about" className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase flex items-center gap-2 hover:text-[#D4AF37] transition-all hover-gold-underline py-1 mt-auto">
              OUR STORY <span className="text-sm transition-transform duration-300 hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="w-full md:w-[60%] relative overflow-hidden bg-[#f4f0ea] min-h-[200px] md:min-h-[320px]">
            {media?.type === 'video' ? (
              <video src={media.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-700 ease-out" />
            ) : (
              <Image
                src={media?.mediaUrl || "/images/curated-couch.jpg"}
                alt="Curated Lifestyle"
                fill
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            )}
            {/* Subtle luxury overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
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
        <div className="flex md:hidden flex-col items-center max-w-sm mx-auto px-6 py-10 bg-gradient-to-b from-white to-[#FFFDF9] border-2 border-[#D4AF37]/25 shadow-md relative overflow-hidden">
          {/* Inner border outline */}
          <div className="absolute inset-2.5 border border-[#D4AF37]/10 pointer-events-none" />
          
          <div className="text-[#D4AF37] font-serif text-4xl leading-none mb-3 select-none">&ldquo;</div>
          
          <div className="min-h-[90px] flex items-center justify-center text-center px-2 z-10">
            <p className="font-serif italic text-[12.5px] text-[#7A6B5D] leading-relaxed" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              {testimonials[activeSlide]?.content}
            </p>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-2 z-10">
            <div className="w-6 h-[1px] bg-[#D4AF37]/30 mb-1" />
            <span className="font-sans text-[9.5px] font-bold tracking-[0.15em] text-[#2C1810] uppercase">
              {testimonials[activeSlide]?.name}
            </span>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(testimonials[activeSlide]?.rating || 5)].map((_, idx) => (
                <Star key={idx} className="h-2.5 w-2.5 fill-[#D4AF37] text-[#D4AF37] stroke-none" />
              ))}
            </div>
          </div>
 
          {/* Pagination and Luxury Gold Arrows */}
          <div className="flex items-center gap-6 mt-8 z-10">
            <button 
              onClick={handlePrev} 
              className="h-7 w-7 flex items-center justify-center rounded-full border border-[#D4AF37]/25 text-[#7A6B5D] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all bg-white cursor-pointer active:scale-90"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
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
              className="h-7 w-7 flex items-center justify-center rounded-full border border-[#D4AF37]/25 text-[#7A6B5D] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all bg-white cursor-pointer active:scale-90"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4 stroke-[1.5]" />
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
