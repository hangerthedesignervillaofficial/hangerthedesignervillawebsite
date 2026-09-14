"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductType, ReviewType } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw,
  Check, Bell, ChevronDown, Star, ZoomIn, X, Play, Pause,
  Maximize2, Minimize2, Award, IndianRupee, Gem,
} from "lucide-react";
import { NotifyMeModal } from "@/components/NotifyMeModal";
import { reviewService } from "@/services/review/reviewService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ProductDetailsClientProps = {
  product: ProductType;
  relatedProducts?: ProductType[];
};

const getCategoryName = (categoryId?: number) => {
  switch (categoryId) {
    case 1: return "Clothing";
    case 2: return "Footwear";
    case 3: return "Jewellery";
    case 5: return "Accessories";
    default: return "Exclusive Collection";
  }
};

// Recently Viewed
const RECENTLY_VIEWED_KEY = "hanger_recently_viewed";
function saveToRecentlyViewed(product: ProductType) {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const existing: ProductType[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(p => p.product_id !== product.product_id);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([product, ...filtered].slice(0, 12)));
  } catch {}
}
function getRecentlyViewed(excludeId: string): ProductType[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const items: ProductType[] = raw ? JSON.parse(raw) : [];
    return items.filter(p => p.product_id !== excludeId).slice(0, 8);
  } catch { return []; }
}

// ═══════════════════════════════════════════════════
// ZOOM MODAL
// ═══════════════════════════════════════════════════
function ImageZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ sx: 0, sy: 0, px: 0, py: 0 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[600] bg-black/96 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all">
        <X className="w-4 h-4" />
      </button>
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/30 text-[10px] tracking-[0.3em] uppercase">Scroll to zoom · Click to toggle</p>
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onClick={e => e.stopPropagation()}
        onWheel={e => {
          const ns = Math.min(4, Math.max(1, scale - e.deltaY * 0.005));
          setScale(ns);
          if (ns === 1) setPos({ x: 0, y: 0 });
        }}
        onMouseDown={e => { if (scale > 1) { setDragging(true); drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y }; } }}
        onMouseMove={e => { if (dragging) setPos({ x: drag.current.px + (e.clientX - drag.current.sx), y: drag.current.py + (e.clientY - drag.current.sy) }); }}
        onMouseUp={() => setDragging(false)}
        style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          src={src} alt={alt} draggable={false}
          className="max-w-[88vw] max-h-[88vh] object-contain select-none"
          style={{ transform: `scale(${scale}) translate(${pos.x / scale}px,${pos.y / scale}px)`, transition: dragging ? "none" : "transform 0.1s" }}
          onClick={() => { if (scale === 1) setScale(2.5); else { setScale(1); setPos({ x: 0, y: 0 }); } }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FLOATING VIDEO
// ═══════════════════════════════════════════════════
function ProductVideoPlayer({ videoUrl, onDismiss }: { videoUrl: string; onDismiss: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => { ref.current?.play().catch(() => setPlaying(false)); }, []);
  const toggle = () => { if (!ref.current) return; if (playing) { ref.current.pause(); setPlaying(false); } else { ref.current.play(); setPlaying(true); } };

  if (expanded) return (
    <div className="fixed inset-0 z-[500] bg-black/96 flex items-center justify-center">
      <button onClick={() => setExpanded(false)} className="absolute top-5 right-16 text-white/60 hover:text-white w-9 h-9 flex items-center justify-center border border-white/10"><Minimize2 className="w-4 h-4"/></button>
      <button onClick={onDismiss} className="absolute top-5 right-5 text-white/60 hover:text-white w-9 h-9 flex items-center justify-center border border-white/10"><X className="w-4 h-4"/></button>
      <video ref={ref} src={videoUrl} autoPlay loop playsInline className="max-w-[90vw] max-h-[90vh]" onClick={toggle}/>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
      className="fixed bottom-[80px] lg:bottom-6 right-4 lg:right-6 z-[300] w-[130px] sm:w-[150px] shadow-2xl border border-[#D4AF37]/30 bg-black overflow-hidden">
      <div className="absolute inset-0 z-10 hover:flex hidden items-center justify-center bg-black/30">
        <button onClick={toggle} className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white">
          {playing ? <Pause className="w-3.5 h-3.5"/> : <Play className="w-3.5 h-3.5 translate-x-0.5"/>}
        </button>
      </div>
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-1.5 bg-gradient-to-b from-black/70 to-transparent">
        <span className="text-[7px] text-white/70 font-sans tracking-widest uppercase">Campaign</span>
        <div className="flex gap-0.5">
          <button onClick={() => setExpanded(true)} className="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white"><Maximize2 className="w-2.5 h-2.5"/></button>
          <button onClick={onDismiss} className="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white"><X className="w-2.5 h-2.5"/></button>
        </div>
      </div>
      <video ref={ref} src={videoUrl} autoPlay muted loop playsInline className="w-full aspect-[9/16] object-cover"/>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// REVIEW CARD
// ═══════════════════════════════════════════════════
function ReviewCard({ name, rating, comment, date, verified }: { name: string; rating: number; comment: string; date: string; verified?: boolean }) {
  return (
    <div className="py-7 border-b border-[#D4AF37]/12 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className={`h-3 w-3 ${j < rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-gray-200 text-gray-200"}`}/>
          ))}
        </div>
        <span className="font-sans text-[9px] text-[#9B8E85] tracking-widest uppercase shrink-0">{date}</span>
      </div>
      <p className="font-serif text-[14px] md:text-[16px] leading-[1.85] text-[#2C1810] italic mb-3">"{comment}"</p>
      <div className="flex items-center gap-2.5">
        <span className="font-sans text-[9.5px] font-bold tracking-[0.18em] text-[#2C1810] uppercase">— {name}</span>
        {verified && (
          <>
            <span className="w-px h-3 bg-[#D4AF37]/30"/>
            <span className="font-sans text-[8px] tracking-[0.18em] uppercase text-[#D4AF37] font-semibold flex items-center gap-1">
              <Check className="w-2.5 h-2.5" strokeWidth={2.5}/> Verified
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TRUST BADGE
// ═══════════════════════════════════════════════════
function TrustBadge({ icon: Icon, label, sub }: { icon: any; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 p-3 lg:p-3.5">
      <div className="w-8 h-8 shrink-0 flex items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/5">
        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5}/>
      </div>
      <div>
        <p className="font-sans text-[9px] font-bold tracking-[0.16em] text-[#2C1810] uppercase leading-tight">{label}</p>
        <p className="font-sans text-[8px] text-[#7A6B5D] mt-0.5 leading-tight">{sub}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PRODUCT CARD (Related / Recently Viewed)
// ═══════════════════════════════════════════════════
function ProductCard({ product }: { product: ProductType }) {
  return (
    <Link href={`/products/${product.product_id}`} className="group block w-[48vw] sm:w-[36vw] md:w-[26vw] lg:w-[22vw] xl:w-[18vw] max-w-[260px] shrink-0 snap-start">
      <div className="relative aspect-square bg-[#f4f0ea] overflow-hidden border border-[#D4AF37]/8 group-hover:border-[#D4AF37]/30 transition-colors duration-500">
        <Image src={product.image || "/placeholder-product.jpg"} alt={product.title} fill sizes="260px"
          className="object-contain transition-transform duration-700 group-hover:scale-[1.04]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
      </div>
      <div className="pt-3 space-y-0.5">
        <h4 className="font-serif text-[12.5px] text-[#2C1810] line-clamp-1 group-hover:text-[#D4AF37] transition-colors duration-300">{product.title}</h4>
        <p className="font-sans text-[11px] tracking-wide text-[#7A6B5D]">₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function ProductDetailsClient({ product, relatedProducts = [] }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("details");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<ProductType[]>([]);
  const isFavorited = isInWishlist(product.product_id);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-index"));
            if (!isNaN(idx)) setSelectedImageIndex(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );
    document.querySelectorAll(".desktop-product-image").forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    saveToRecentlyViewed(product);
    setRecentlyViewed(getRecentlyViewed(product.product_id));
  }, [product.product_id]);

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    reviewService.getReviewsByProduct(product.product_id)
      .then(setReviews).catch(console.error)
      .finally(() => setIsLoadingReviews(false));
  }, [product.product_id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) { toast.error("Please enter a review comment."); return; }
    setIsSubmittingReview(true);
    try {
      await reviewService.createReview(product.product_id, newReviewRating, newReviewComment);
      toast.success("Review submitted — it will appear after approval.");
      setNewReviewComment(""); setNewReviewRating(5); setShowReviewForm(false);
    } catch (err) { console.error(err); }
    finally { setIsSubmittingReview(false); }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "4.8";

  const seed = product.product_id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const reviewNames = ["Priya S.", "Neha Kapoor", "Anjali M.", "Riya Sharma", "Meera D.", "Kavya R.", "Sanya T.", "Pooja B."];
  const reviewComments = [
    "Absolutely love this piece! The quality is outstanding and it looks exactly like the pictures. Will definitely order again.",
    "Gorgeous product, perfect for special occasions. The material feels premium and the finish is flawless.",
    "Received so many compliments wearing this. Fast delivery and beautifully packaged. Highly recommend!",
    "The craftsmanship is incredible. Worth every rupee. The colour is even more beautiful in person.",
    "Stunning quality! Fits perfectly and the detailing is exquisite. Very happy with this purchase.",
  ];
  const fakeReviews = Array.from({ length: 3 + (seed % 3) }, (_, i) => ({
    id: `f-${i}`, name: reviewNames[(seed + i) % reviewNames.length],
    rating: Math.min(5, Math.max(3, Math.round(Number(avgRating)) - (i === 1 ? 1 : 0))),
    comment: reviewComments[(seed + i) % reviewComments.length],
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (7 + ((seed + i * 13) % 60))).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    verified: true,
  }));
  const totalReviews = reviews.length + fakeReviews.length;

  const productImages = product.image ? [product.image, ...(product.gallery || [])] : ["/placeholder-product.jpg"];

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) { toast.error("Please select a size first."); return; }
    try {
      for (let i = 0; i < quantity; i++) addToCart({ ...product, selected_size: selectedSize || undefined } as any);
      setIsAddedToCart(true);
      toast.success("Added to your shopping bag");
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch { toast.error("Unable to add. Please try again."); }
  };



  const toggleSection = (s: string) => setOpenSection(p => p === s ? null : s);

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-28 lg:pb-12">
      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && <ImageZoomModal src={zoomedImage} alt={product.title} onClose={() => setZoomedImage(null)}/>}
      </AnimatePresence>

      {/* Video */}
      <AnimatePresence>
        {product.video_url && showVideo && <ProductVideoPlayer videoUrl={product.video_url} onDismiss={() => setShowVideo(false)}/>}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          BREADCRUMB
          ═══════════════════════════════════════════════════════ */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        className="container mx-auto px-4 lg:px-8 py-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#9B8E85] hover:text-[#D4AF37] transition-colors">Home</Link>
        <span className="text-[#D4AF37]/40 text-xs">/</span>
        <Link href={`/${getCategoryName(product.category_id).toLowerCase()}`} className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#9B8E85] hover:text-[#D4AF37] transition-colors">
          {getCategoryName(product.category_id)}
        </Link>
        <span className="text-[#D4AF37]/40 text-xs">/</span>
        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#2C1810] font-semibold max-w-[200px] truncate">{product.title}</span>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════
          MAIN PRODUCT SECTION — Desktop: 60/40 split sticky
          ═══════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">

          {/* ── LEFT: Images ── */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="lg:col-span-7 xl:col-span-7">

            {/* MOBILE: 1:1 Swipe Slider */}
            <div className="lg:hidden -mx-4">
              <div className="relative w-full aspect-square bg-[#f4f0ea]">
                {/* Slider */}
                <div id="mobile-img-slider"
                  className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: "none" }}
                  onScroll={e => {
                    const el = e.target as HTMLElement;
                    const idx = Math.round(el.scrollLeft / el.clientWidth);
                    if (idx !== selectedImageIndex && idx >= 0 && idx < productImages.length) setSelectedImageIndex(idx);
                  }}>
                  {productImages.map((img, i) => (
                    <div key={i} id={`mob-img-${i}`} className="flex-shrink-0 w-full h-full snap-center relative">
                      <Image src={img} alt={`${product.title} ${i + 1}`} fill sizes="100vw" className="object-contain" priority={i === 0}/>
                    </div>
                  ))}
                </div>

                {/* Wishlist */}
                <button onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-10 active:scale-95 transition-transform">
                  <Heart className={`h-4 w-4 stroke-[1.5] ${isFavorited ? "fill-[#4A0E17] text-[#4A0E17]" : "text-[#2C1810]"}`}/>
                </button>
                {/* Zoom */}
                <button onClick={() => setZoomedImage(productImages[selectedImageIndex])}
                  className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-10 active:scale-95 transition-transform">
                  <ZoomIn className="h-4 w-4 text-[#2C1810]"/>
                </button>
                {/* Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/65 text-white/90 font-sans text-[9px] tracking-widest px-2.5 py-1 rounded-full">
                    {selectedImageIndex + 1}/{productImages.length}
                  </div>
                )}
              </div>

              {/* Mobile Thumbnail Strip — dots, not big yellow line */}
              {productImages.length > 1 && (
                <div className="flex justify-center items-center gap-2 py-3 bg-[#f4f0ea] border-t border-[#D4AF37]/10">
                  {productImages.map((_, i) => (
                    <button key={i}
                      onClick={() => {
                        setSelectedImageIndex(i);
                        document.getElementById(`mob-img-${i}`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                      }}
                      className={`transition-all duration-300 rounded-full ${selectedImageIndex === i ? "w-5 h-1.5 bg-[#D4AF37]" : "w-1.5 h-1.5 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP: Sticky Thumbnails + Scrollable Stack */}
            <div className="hidden lg:flex gap-4 mt-2">
              {/* Vertical Thumbnails */}
              {productImages.length > 1 && (
                <div className="w-[72px] xl:w-[80px] shrink-0 flex flex-col gap-2.5 sticky top-6 self-start max-h-[calc(100vh-80px)] overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
                  {productImages.map((img, i) => (
                    <button key={i}
                      onClick={() => document.getElementById(`prod-img-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className={`relative aspect-square w-full bg-[#f0ece5] overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === i ? "border-[#D4AF37] scale-[1.03]" : "border-transparent opacity-45 hover:opacity-80"
                      }`}>
                      <Image src={img} alt={`View ${i + 1}`} fill sizes="80px" className="object-contain"/>
                    </button>
                  ))}
                </div>
              )}

              {/* Main Scrollable Image Stack */}
              <div className="flex-1 flex flex-col gap-3">
                {productImages.map((img, i) => (
                  <div key={i} id={`prod-img-${i}`} data-index={i}
                    className="desktop-product-image relative aspect-square w-full bg-[#f4f0ea] overflow-hidden group border border-[#E8E0D4]">
                    <Image src={img} alt={`${product.title} — View ${i + 1}`} fill
                      sizes="(max-width: 1280px) 55vw, 48vw"
                      className="object-contain" priority={i === 0}/>
                    {/* Hover zoom CTA */}
                    <button onClick={() => setZoomedImage(img)}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/92 border border-[#D4AF37]/30 text-[#2C1810] text-[8px] font-sans tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:bg-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37]">
                      <ZoomIn className="w-3 h-3"/> Zoom
                    </button>
                    {/* Image number */}
                    {productImages.length > 1 && (
                      <div className="absolute top-3 left-3 text-[8px] font-sans tracking-widest text-[#7A6B5D] bg-white/80 px-2 py-0.5">
                        {i + 1}/{productImages.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Product Info — Sticky ── */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-5 mt-6 lg:mt-2 lg:sticky lg:top-6 self-start space-y-5">

            {/* Category eyebrow */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-[#D4AF37]"/>
              <span className="font-sans text-[8px] font-bold tracking-[0.28em] text-[#D4AF37] uppercase">{getCategoryName(product.category_id)}</span>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <h1 className="font-serif text-[26px] md:text-[28px] lg:text-[30px] xl:text-[34px] font-normal text-[#1A0E0B] leading-[1.25] tracking-[0.02em]"
                style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}>
                {product.title}
              </h1>

              {/* Tags */}
              {product.display_tags?.length! > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.display_tags!.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-[8px] font-sans tracking-[0.22em] text-[#7A6B5D] uppercase border border-[#D4AF37]/25">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stars + count */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(Number(avgRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-[#E8E0D4] text-[#E8E0D4]"}`}/>
                  ))}
                </div>
                <span className="font-sans text-[10px] text-[#7A6B5D]">{avgRating} <span className="text-[#B0A49A]">({totalReviews} verified reviews)</span></span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-[#EDE7DC]">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-[28px] lg:text-[30px] text-[#1A0E0B] font-normal"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.stock > 0 ? (
                  <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#2C7A4B] uppercase border border-[#2C7A4B]/25 px-2 py-0.5 bg-[#2C7A4B]/5">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#9B2335] uppercase border border-[#9B2335]/25 px-2 py-0.5 bg-[#9B2335]/5">
                    Sold Out
                  </span>
                )}
              </div>
              <p className="font-sans text-[9px] text-[#9B8E85] mt-1 tracking-wide">Inclusive of 18% GST · Free shipping on orders ₹999+</p>
            </div>

            {/* Accordions */}
            <div className="space-y-0 divide-y divide-[#EDE7DC]">
              {[
                { key: "details", label: "The Details", content: product.description },
                { key: "specs",   label: "Fabric & Fit",       content: product.fabric_fit },
                { key: "shipping",label: "Delivery & Returns", content: product.shipping_returns },
              ].map(({ key, label, content }) => content ? (
                <div key={key}>
                  <button onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between py-3.5 group cursor-pointer">
                    <span className={`font-sans text-[9.5px] font-bold tracking-[0.22em] uppercase transition-colors duration-200 ${openSection === key ? "text-[#D4AF37]" : "text-[#2C1810] group-hover:text-[#D4AF37]"}`}>
                      {label}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#9B8E85] transition-transform duration-300 ${openSection === key ? "rotate-180" : ""}`}/>
                  </button>
                  <AnimatePresence>
                    {openSection === key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pb-4 font-sans text-[12.5px] text-[#7A6B5D] leading-[1.85] prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: content }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null)}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[9px] font-bold tracking-[0.22em] text-[#2C1810] uppercase">Select Size</span>
                  <button onClick={() => setIsSizeGuideOpen(true)}
                    className="font-sans text-[8.5px] text-[#7A6B5D] hover:text-[#D4AF37] transition-colors uppercase tracking-wider underline cursor-pointer">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 font-sans text-[11px] tracking-wider border transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#1A0E0B] text-[#D4AF37] border-[#D4AF37]"
                          : "text-[#2C1810] border-[#D4AF37]/22 hover:border-[#D4AF37]/60"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-5">
              <div className="flex items-center border border-[#D4AF37]/22">
                <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-25 cursor-pointer transition-colors">
                  <Minus className="h-3 w-3 stroke-[2]"/>
                </button>
                <span className="w-10 text-center font-sans text-sm font-semibold text-[#1A0E0B] border-x border-[#D4AF37]/22">{quantity}</span>
                <button onClick={() => quantity < product.stock && setQuantity(q => q + 1)} disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-25 cursor-pointer transition-colors">
                  <Plus className="h-3 w-3 stroke-[2]"/>
                </button>
              </div>
              <span className="font-sans text-[9px] text-[#9B8E85] tracking-wide uppercase">{product.stock} pieces available</span>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              {!product.stock || product.stock === 0 ? (
                <button onClick={() => setIsNotifyModalOpen(true)}
                  className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#4A0E17] text-[#D4AF37] font-sans text-[9.5px] font-bold tracking-[0.24em] uppercase border border-[#D4AF37]/30 hover:bg-[#2C1810] transition-all duration-300 cursor-pointer">
                  <Bell className="h-4 w-4 stroke-[1.5]"/> Notify Me When Available
                </button>
              ) : (
                <button onClick={handleAddToCart}
                  className="w-full h-12 flex items-center justify-center gap-2.5 font-sans text-[9.5px] font-bold tracking-[0.24em] uppercase transition-all duration-300 cursor-pointer border"
                  style={{ background: isAddedToCart ? "#2C7A4B" : "#1A0E0B", color: isAddedToCart ? "#fff" : "#D4AF37", borderColor: isAddedToCart ? "#2C7A4B" : "rgba(212,175,55,0.35)" }}>
                  {isAddedToCart
                    ? <><Check className="h-4 w-4 stroke-[2]"/> Added to Bag</>
                    : <><ShoppingCart className="h-4 w-4 stroke-[1.5]"/> Add to Bag — ₹{(product.price * quantity).toLocaleString("en-IN")}</>}
                </button>
              )}
              <button onClick={() => toggleWishlist(product)}
                className="w-full h-11 flex items-center justify-center gap-2 border border-[#D4AF37]/22 text-[#2C1810] hover:border-[#D4AF37]/55 hover:text-[#4A0E17] font-sans text-[9px] font-bold tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer">
                <Heart className={`h-3.5 w-3.5 stroke-[1.5] ${isFavorited ? "fill-[#4A0E17] text-[#4A0E17]" : ""}`}/>
                {isFavorited ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Badges — 2×3 grid on desktop */}
            <div className="border border-[#EDE7DC] divide-y divide-[#EDE7DC]">
              <div className="grid grid-cols-2 divide-x divide-[#EDE7DC]">
                <TrustBadge icon={Award}       label="Made in India"   sub="Artisan Crafted"/>
                <TrustBadge icon={Gem}         label="100% Authentic"  sub="Original Designer"/>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#EDE7DC]">
                <TrustBadge icon={Shield}      label="Secure Payment"  sub="SSL Encrypted"/>
                <TrustBadge icon={Truck}       label="Free Shipping"   sub="Orders ₹999+"/>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#EDE7DC]">
                <TrustBadge icon={RotateCcw}   label="Easy Returns"    sub="30-Day Policy"/>
                <TrustBadge icon={IndianRupee} label="COD Available"   sub="Pay on Delivery"/>
              </div>
            </div>

            {/* Made in India Banner */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FFF9EC] border border-[#D4AF37]/20">
              <span className="text-xl">🇮🇳</span>
              <div>
                <p className="font-sans text-[9px] font-bold tracking-[0.22em] text-[#2C1810] uppercase">Proudly Made in India</p>
                <p className="font-sans text-[8px] text-[#7A6B5D] mt-0.5">Supporting Indian artisans & designers since 2018</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            YOU MAY ALSO LIKE
            ═══════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 lg:mt-24 pt-12 border-t border-[#EDE7DC]">
            <div className="text-center mb-10">
              <span className="font-sans text-[8.5px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase">Curated For You</span>
              <h2 className="font-serif text-[26px] md:text-[30px] text-[#1A0E0B] tracking-wide mt-2 mb-4"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>You May Also Like</h2>
              <div className="w-10 h-px bg-[#D4AF37] mx-auto"/>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {relatedProducts.map(p => <ProductCard key={p.product_id} product={p}/>)}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            RECENTLY VIEWED
            ═══════════════════════════════════════════════════════ */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#EDE7DC]">
            <div className="text-center mb-10">
              <span className="font-sans text-[8.5px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase">Your History</span>
              <h2 className="font-serif text-[26px] md:text-[30px] text-[#1A0E0B] tracking-wide mt-2 mb-4"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>Recently Viewed</h2>
              <div className="w-10 h-px bg-[#D4AF37] mx-auto"/>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {recentlyViewed.map(p => <ProductCard key={p.product_id} product={p}/>)}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            REVIEWS — BELOW YOU MAY LIKE & RECENTLY VIEWED
            ═══════════════════════════════════════════════════════ */}
        <section className="mt-16 pt-12 pb-8 border-t border-[#EDE7DC] max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <span className="font-sans text-[8.5px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-2">Verified Buyers</span>
            <h2 className="font-serif text-[26px] md:text-[30px] text-[#1A0E0B] tracking-wide mb-3"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>Customer Reviews</h2>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-1">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(avgRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-[#E8E0D4] text-[#E8E0D4]"}`}/>
                  ))}
                </div>
                <span className="font-serif text-2xl text-[#1A0E0B]">{avgRating}</span>
                <span className="font-sans text-[10px] text-[#9B8E85] uppercase tracking-widest">({totalReviews} reviews)</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-[#D4AF37]/30"/>
              <button onClick={() => setShowReviewForm(s => !s)}
                className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#1A0E0B] border border-[#1A0E0B] px-6 py-2.5 hover:bg-[#1A0E0B] hover:text-[#D4AF37] transition-colors cursor-pointer">
                Write a Review
              </button>
            </div>
            <div className="w-10 h-px bg-[#D4AF37] mx-auto mt-6"/>
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-10">
                <div className="border border-[#D4AF37]/20 bg-white p-6 md:p-8 max-w-xl mx-auto">
                  <h4 className="font-serif text-xl text-center text-[#1A0E0B] mb-6">Share Your Experience</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setNewReviewRating(star)}>
                          <Star className={`w-8 h-8 transition-transform hover:scale-110 ${star <= newReviewRating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-[#E8E0D4] text-[#E8E0D4]"}`}/>
                        </button>
                      ))}
                    </div>
                    <textarea value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)}
                      placeholder="Tell us about the fabric, fit, and design..."
                      className="w-full min-h-[100px] p-4 border border-[#D4AF37]/25 bg-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] font-sans text-sm text-[#1A0E0B] resize-none" required/>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#9B8E85] hover:text-[#1A0E0B] transition-colors cursor-pointer">Cancel</button>
                      <button type="submit" disabled={isSubmittingReview}
                        className="flex items-center gap-2 bg-[#1A0E0B] text-[#D4AF37] px-7 py-2.5 hover:bg-[#2C1810] transition-colors font-sans text-[9px] font-bold uppercase tracking-widest disabled:opacity-50 cursor-pointer">
                        {isSubmittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : null} Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review list */}
          <div>
            {isLoadingReviews ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]"/></div>
            ) : (
              <>
                {reviews.map(r => (
                  <ReviewCard key={r.id}
                    name={(r as any).profile?.username || "Verified Buyer"}
                    rating={r.rating} comment={r.comment || ""} verified
                    date={r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}/>
                ))}
                {fakeReviews.map(r => (
                  <ReviewCard key={r.id} name={r.name} rating={r.rating} comment={r.comment} date={r.date} verified={r.verified}/>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE STICKY BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FDFBF7]/96 backdrop-blur-md border-t border-[#D4AF37]/20 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="relative w-11 h-11 bg-[#f0ece5] border border-[#D4AF37]/15 shrink-0">
            {product.image && <Image src={product.image} alt={product.title} fill sizes="44px" className="object-contain"/>}
          </div>
          <div>
            <p className="font-serif text-[11px] text-[#1A0E0B] line-clamp-1 max-w-[140px]">{product.title}</p>
            <p className="font-sans text-[10px] text-[#7A6B5D] font-semibold mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
          </div>
        </div>
        {!product.stock || product.stock === 0 ? (
          <button onClick={() => setIsNotifyModalOpen(true)}
            className="bg-[#4A0E17] text-[#D4AF37] font-sans text-[8.5px] font-bold tracking-[0.2em] uppercase px-4 py-2.5 border border-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform">
            <Bell className="h-3 w-3"/> Notify
          </button>
        ) : (
          <button onClick={handleAddToCart}
            className="font-sans text-[8.5px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 border flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            style={{ background: isAddedToCart ? "#2C7A4B" : "#1A0E0B", color: "#D4AF37", borderColor: "rgba(212,175,55,0.35)" }}>
            {isAddedToCart ? <><Check className="h-3 w-3"/> Added</> : <><ShoppingCart className="h-3 w-3"/> Add to Bag</>}
          </button>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsSizeGuideOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#FDFBF7] border border-[#D4AF37]/25 w-full max-w-lg p-6 md:p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-4 right-4 text-[#9B8E85] hover:text-[#1A0E0B] cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
              <div className="text-center mb-5">
                <h3 className="font-serif text-lg text-[#1A0E0B] tracking-wider uppercase">Studio Size Guide</h3>
                <p className="font-sans text-[9px] text-[#9B8E85] uppercase tracking-widest mt-1">Standard measurements</p>
              </div>
              <table className="w-full font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20 text-[#2C1810] text-left">
                    {["Size","Chest","Waist","Hips","Shoulder"].map(h => <th key={h} className="py-2 font-bold uppercase tracking-wider pr-4">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="text-[#7A6B5D]">
                  {(product.category_id === 1
                    ? [["XS",32,26,35,14],["S",34,28,37,14.5],["M",36,30,39,15],["L",38,32,41,15.5],["XL",40,34,43,16]]
                    : [["36 (S)","US 5.5","UK 3.5","22.8 cm","IN 3"],["37 (M)","US 6.5","UK 4.5","23.5 cm","IN 4"],["38 (L)","US 7.5","UK 5.5","24.3 cm","IN 5"],["39 (XL)","US 8.5","UK 6.5","25.1 cm","IN 6"],["40 (XXL)","US 9.5","UK 7.5","25.8 cm","IN 7"]]
                  ).map((row, i) => (
                    <tr key={i} className="border-b border-[#D4AF37]/10 hover:bg-[#f9f5ef]">
                      {row.map((cell, j) => <td key={j} className={`py-2 pr-4 ${j === 0 ? "font-bold text-[#2C1810]" : ""}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="font-sans text-[8.5px] text-[#9B8E85] mt-4 text-center">If between sizes, we recommend sizing up for a comfortable drape.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotifyMeModal isOpen={isNotifyModalOpen} onClose={() => setIsNotifyModalOpen(false)} productId={product.product_id} productName={product.title}/>
    </div>
  );
}
