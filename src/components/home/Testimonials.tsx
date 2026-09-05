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
    <section className="py-12 md:py-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 lg:px-8">
 
        {/* Top: Curated section (image + text) with Luxury Frame */}
        <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] mb-16 lg:mb-24 overflow-hidden shadow-xl group flex items-center justify-center rounded-sm">
          
          <div className="absolute inset-0 z-0">
            {media?.type === 'video' ? (
              <video src={media.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105 filter brightness-[0.7]" />
            ) : (
              <Image
                src={media?.mediaUrl || "/images/curated-couch.jpg"}
                alt="Curated Lifestyle"
                fill
                className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105 filter brightness-[0.7]"
                priority
              />
            )}
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/30 to-transparent" />
          </div>
          
          {/* Inner frame */}
          <div className="absolute inset-4 md:inset-6 border border-[#D4AF37]/30 pointer-events-none z-10 transition-colors duration-500 group-hover:border-[#D4AF37]/60" />

          {/* Text Content Centered & Elegant */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-8 w-full max-w-4xl mx-auto translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
            <span className="font-sans text-[9px] md:text-[11px] font-bold tracking-[0.4em] text-[#D4AF37] mb-4 uppercase">
              THE ART OF LUXURY
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide text-white uppercase leading-[1.15] mb-5 md:mb-6 drop-shadow-md" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              CURATED FOR<br />THE WAY YOU LIVE.
            </h2>
            <div className="w-10 md:w-16 h-[1px] bg-[#D4AF37] mb-5 md:mb-6" />
            <p className="font-sans text-[11px] md:text-[13px] font-light leading-relaxed text-white/90 mb-6 md:mb-8 max-w-xl mx-auto drop-shadow-sm px-2">
              Hanger, The Designer Shop brings together contemporary Indian fashion, handpicked pieces, and thoughtfully selected details—designed to move effortlessly from everyday moments to celebrations.
            </p>
            <Link href="/about" className="font-sans text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#1a1a1a] bg-white px-6 py-3 md:px-8 md:py-3.5 uppercase hover:bg-[#D4AF37] hover:text-white transition-colors duration-300">
              OUR STORY
            </Link>
          </div>
        </div>
 
        {/* Bottom: Testimonials Title */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] mb-3 uppercase block">
            OUR CLIENTELE
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-[#2C1810] uppercase leading-tight max-w-2xl mx-auto px-4" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            LOVED BY WOMEN WHO WEAR THEIR STYLE
          </h2>
        </div>
 
        {/* Desktop Layout: 3 Columns Grid with Luxury Cards */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col items-center text-center p-8 bg-white border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-md transition-all duration-300 relative rounded-sm"
            >
              <div className="text-[#D4AF37] font-serif text-5xl leading-none mb-2 select-none opacity-80 group-hover:opacity-100 transition-opacity">&ldquo;</div>
              <p className="font-serif italic text-[14px] text-[#5C4F44] mb-8 leading-relaxed flex-1" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                {t.content}
              </p>
              
              <div className="mt-auto flex flex-col items-center gap-2">
                <div className="w-8 h-[1px] bg-[#D4AF37]/40 mb-2" />
                <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
                  {t.name}
                </span>
                <div className="flex gap-1 mt-1">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37] stroke-none" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
 
        {/* Mobile Layout: Interactive Single Slide Carousel */}
        <div className="flex md:hidden flex-col items-center w-full mx-auto px-2">
          <div className="w-full bg-white border border-[#D4AF37]/15 p-8 shadow-sm relative rounded-sm text-center">
            <div className="text-[#D4AF37] font-serif text-4xl leading-none mb-2 select-none">&ldquo;</div>
            
            <div className="min-h-[100px] flex items-center justify-center text-center">
              <p className="font-serif italic text-[14px] text-[#5C4F44] leading-relaxed" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                {testimonials[activeSlide]?.content}
              </p>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-6 h-[1px] bg-[#D4AF37]/50 mb-1" />
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
                {testimonials[activeSlide]?.name}
              </span>
              <div className="flex gap-1 mt-1">
                {[...Array(testimonials[activeSlide]?.rating || 5)].map((_, idx) => (
                  <Star key={idx} className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37] stroke-none" />
                ))}
              </div>
            </div>
          </div>
 
          {/* Pagination and Arrows */}
          <div className="flex items-center gap-6 mt-6">
            <button 
              onClick={handlePrev} 
              className="h-8 w-8 flex items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#7A6B5D] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all bg-transparent active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "bg-[#D4AF37] w-4" : "bg-[#D4AF37]/20 w-1.5"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext} 
              className="h-8 w-8 flex items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#7A6B5D] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all bg-transparent active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
 
      </div>
    </section>
  );
}
