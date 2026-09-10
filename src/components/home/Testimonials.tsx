"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const FALLBACK = [
  { name: "Aisha R.",  content: "Absolutely breathtaking craftsmanship. The attention to detail is unmatched, and I felt like royalty wearing it.",         rating: 5 },
  { name: "Meera K.",  content: "The quiet luxury aesthetic is perfectly captured in every piece. Truly an elevated shopping experience.",                  rating: 5 },
  { name: "Priya S.",  content: "Timeless pieces I know I will cherish forever. Beautiful design, impeccable quality, and such elegant packaging.",         rating: 5 },
  { name: "Lavanya T.", content: "I wore the embroidered kurta to a wedding and received compliments all night. Hanger never disappoints.",                 rating: 5 },
];

export function Testimonials({ initialTestimonials }: { initialTestimonials?: any[] }) {
  const [items, setItems]   = useState<any[]>(initialTestimonials ?? []);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(!initialTestimonials);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("testimonials")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });
        setItems(data?.length ? data : FALLBACK);
      } catch {
        setItems(FALLBACK);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-20 bg-[#F9F6F1]" />;
  if (!items.length) return null;

  const shown = items.slice(0, 6);
  const prev = () => setActive(a => (a - 1 + shown.length) % shown.length);
  const next = () => setActive(a => (a + 1) % shown.length);

  return (
    <section id="testimonials" className="bg-[#F9F6F1] py-20 md:py-32">
      <div className="container mx-auto px-5 md:px-10">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-14 md:mb-18"
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-[#C9A962] mb-4">
            OUR CLIENTELE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] max-w-2xl leading-snug">
            Loved By Women Who Wear Their Style
          </h2>
          <div className="w-10 h-px bg-[#C9A962]/60 mt-6" />
        </motion.div>

        {/* ── DESKTOP: 3-column card grid ── */}
        <div className="hidden md:grid grid-cols-3 gap-7 lg:gap-10 max-w-6xl mx-auto">
          {shown.slice(0, 3).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              className="flex flex-col items-center text-center p-10 bg-white border border-[#C9A962]/12 hover:border-[#C9A962]/35 shadow-sm hover:shadow-md transition-all duration-500"
            >
              {/* Opening quote mark */}
              <div className="font-serif text-[56px] leading-none text-[#C9A962]/25 select-none -mt-3 mb-2">&ldquo;</div>

              <p className="font-serif text-[15px] italic text-[#5A5A5A] leading-[1.8] flex-1 mb-8">
                {t.content}
              </p>

              <div className="flex flex-col items-center gap-2 mt-auto">
                {/* Gold rule */}
                <div className="w-6 h-px bg-[#C9A962]/50 mb-2" />
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
                  {t.name}
                </span>
                <div className="flex gap-1 mt-0.5">
                  {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-[#C9A962] text-[#C9A962] stroke-none" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── MOBILE: animated single-card carousel ── */}
        <div className="flex md:hidden flex-col items-center">
          <div className="w-full max-w-sm bg-white border border-[#C9A962]/15 shadow-sm p-8 text-center min-h-[260px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center"
              >
                <div className="font-serif text-[48px] leading-none text-[#C9A962]/25 select-none -mt-2 mb-2">&ldquo;</div>
                <p className="font-serif text-[15px] italic text-[#5A5A5A] leading-[1.8] mb-7">
                  {shown[active].content}
                </p>
                <div className="w-5 h-px bg-[#C9A962]/45 mb-3" />
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
                  {shown[active].name}
                </span>
                <div className="flex gap-1 mt-1.5">
                  {Array.from({ length: shown[active].rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-[#C9A962] text-[#C9A962] stroke-none" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-7">
            <button onClick={prev} aria-label="Previous review" className="text-[#7A7A7A] hover:text-[#C9A962] transition-colors">
              <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
            </button>
            <div className="flex gap-2.5">
              {shown.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Review ${i + 1}`}
                  className={`rounded-full transition-all duration-400 ${active === i ? "w-6 h-1.5 bg-[#C9A962]" : "w-1.5 h-1.5 bg-[#C9A962]/30"}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next review" className="text-[#7A7A7A] hover:text-[#C9A962] transition-colors">
              <ChevronRight className="h-5 w-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
