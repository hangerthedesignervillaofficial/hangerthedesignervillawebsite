"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductType, ReviewType } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
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

// Recently Viewed — localStorage helper
const RECENTLY_VIEWED_KEY = "hanger_recently_viewed";
const MAX_RECENTLY_VIEWED = 12;

function saveToRecentlyViewed(product: ProductType) {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const existing: ProductType[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(p => p.product_id !== product.product_id);
    const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
}

function getRecentlyViewed(excludeId: string): ProductType[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const items: ProductType[] = raw ? JSON.parse(raw) : [];
    return items.filter(p => p.product_id !== excludeId).slice(0, 8);
  } catch { return []; }
}

// Image Zoom Modal
function ImageZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(4, Math.max(1, scale - e.deltaY * 0.005));
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: dragStart.current.posX + (e.clientX - dragStart.current.x),
      y: dragStart.current.posY + (e.clientY - dragStart.current.y),
    });
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close zoom"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
        Scroll to zoom · Click to close
      </div>
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          draggable={false}
          onClick={() => {
            if (scale === 1) setScale(2.5);
            else { setScale(1); setPosition({ x: 0, y: 0 }); }
          }}
        />
      </div>
    </div>
  );
}

// Floating Product Video Player
function ProductVideoPlayer({ videoUrl, onDismiss }: { videoUrl: string; onDismiss: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center">
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-16 text-white/70 hover:text-white z-10 w-10 h-10 flex items-center justify-center"
          aria-label="Minimize video"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-10 w-10 h-10 flex items-center justify-center"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          playsInline
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={togglePlay}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-[80px] lg:bottom-6 right-4 lg:right-6 z-[300] shadow-2xl"
    >
      <div className="relative w-[140px] sm:w-[160px] rounded-sm overflow-hidden border border-[#D4AF37]/30 bg-black">
        {/* Control overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>
        </div>

        {/* Top control bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-1.5 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white/80 text-[8px] font-sans tracking-widest uppercase">Campaign</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Expand video"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={onDismiss}
              className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Close video"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-[9/16] object-cover"
        />
      </div>
    </motion.div>
  );
}

export default function ProductDetailsClient({
  product,
  relatedProducts = [],
}: ProductDetailsClientProps) {
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

  // Intersection Observer for Desktop Scroll Spy
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) setSelectedImageIndex(index);
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );

    const imageElements = document.querySelectorAll(".desktop-product-image");
    imageElements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  // Save to recently viewed & load list
  useEffect(() => {
    saveToRecentlyViewed(product);
    setRecentlyViewed(getRecentlyViewed(product.product_id));
  }, [product.product_id]);

  // Reviews
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const fetchedReviews = await reviewService.getReviewsByProduct(product.product_id);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setIsLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product.product_id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) { toast.error("Please enter a review comment."); return; }
    setIsSubmittingReview(true);
    try {
      const review = await reviewService.createReview(product.product_id, newReviewRating, newReviewComment);
      if (review) {
        toast.success("Review submitted! It will appear after admin approval.");
        setNewReviewComment("");
        setNewReviewRating(5);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "4.8";

  // Dummy reviews
  const seed = product.product_id ? product.product_id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : 42;
  const reviewNames = ["Priya S.", "Neha Kapoor", "Anjali M.", "Riya Sharma", "Meera D.", "Kavya R.", "Sanya T.", "Pooja B."];
  const reviewComments = [
    "Absolutely love this piece! The quality is outstanding and it looks exactly like the pictures. Will definitely order again.",
    "Gorgeous product, perfect for special occasions. The material feels premium and the finish is flawless.",
    "Received so many compliments wearing this. Fast delivery and beautifully packaged. Highly recommend!",
    "The craftsmanship is incredible. Worth every rupee. The colour is even more beautiful in person.",
    "Stunning quality! Fits perfectly and the detailing is exquisite. Very happy with this purchase.",
  ];
  const fakeReviews = Array.from({ length: 3 + (seed % 3) }, (_, i) => ({
    id: `fake-${i}`,
    name: reviewNames[(seed + i) % reviewNames.length],
    rating: Math.min(5, Math.max(3, Math.round(Number(avgRating)) - (i === 1 ? 1 : 0))),
    comment: reviewComments[(seed + i) % reviewComments.length],
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (7 + ((seed + i * 13) % 60))).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    verified: true,
  }));
  const totalReviews = reviews.length + fakeReviews.length;

  // 1:1 image array
  const productImages = product.image
    ? [product.image, ...(product.gallery || [])]
    : ["/placeholder-product.jpg"];

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to your shopping bag");
      return;
    }
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({ ...product, selected_size: selectedSize || undefined } as any);
      }
      setIsAddedToCart(true);
      toast.success("Added to your shopping bag");
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Unable to add item to bag. Please try again.");
    }
  };

  const incrementQuantity = () => { if (quantity < product.stock) setQuantity(quantity + 1); };
  const decrementQuantity = () => { if (quantity > 1) setQuantity(quantity - 1); };

  // Trust badges data
  const trustBadges = [
    { icon: Award, label: "Made in India", sub: "Artisan Crafted" },
    { icon: Gem, label: "Authentic Designer", sub: "100% Original" },
    { icon: Shield, label: "Secure Payment", sub: "SSL Encrypted" },
    { icon: Truck, label: "Free Shipping", sub: "Orders ₹999+" },
    { icon: RotateCcw, label: "Easy Returns", sub: "30-Day Policy" },
    { icon: IndianRupee, label: "Cash on Delivery", sub: "Available" },
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-36 lg:pb-10">
      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <ImageZoomModal
            src={zoomedImage}
            alt={product.title}
            onClose={() => setZoomedImage(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Product Video */}
      <AnimatePresence>
        {product.video_url && showVideo && (
          <ProductVideoPlayer
            videoUrl={product.video_url}
            onDismiss={() => setShowVideo(false)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 md:py-10">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 mb-6 flex-wrap"
        >
          <Link href="/" className="font-sans text-[8px] tracking-[0.18em] uppercase text-[#7A6B5D] hover:text-[#D4AF37] transition-colors duration-200 py-1 px-2 bg-[#f4f0ea] rounded-sm">Home</Link>
          <span className="text-[#D4AF37]/60 text-[12px] font-thin">/</span>
          <Link href={`/${getCategoryName(product.category_id).toLowerCase()}`} className="font-sans text-[8px] tracking-[0.18em] uppercase text-[#7A6B5D] hover:text-[#D4AF37] transition-colors duration-200 py-1 px-2 bg-[#f4f0ea] rounded-sm">
            {getCategoryName(product.category_id)}
          </Link>
          <span className="text-[#D4AF37]/60 text-[12px] font-thin">/</span>
          <span className="font-sans text-[8px] tracking-[0.18em] uppercase text-[#2C1810] font-bold max-w-[160px] truncate py-1 px-2 bg-[#2C1810]/5 rounded-sm border border-[#D4AF37]/20">
            {product.title}
          </span>
        </motion.nav>

        <div className="mb-16 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ═══════════════════════════════════════════════════
              LEFT: Product Images
              ─ 1:1 aspect ratio, zoom button, quality preserving
              ═══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 w-full"
          >
            {/* ── MOBILE: 1:1 Swipeable Slider ── */}
            <div className="lg:hidden -mx-4">
              <div className="relative w-full aspect-square bg-[#f4f0ea]">
                <div
                  id="mobile-image-slider"
                  className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                  onScroll={(e) => {
                    const scrollLeft = (e.target as HTMLElement).scrollLeft;
                    const width = (e.target as HTMLElement).clientWidth;
                    const index = Math.round(scrollLeft / width);
                    if (index !== selectedImageIndex && index >= 0 && index < productImages.length) {
                      setSelectedImageIndex(index);
                    }
                  }}
                >
                  {productImages.map((img, i) => (
                    <div key={i} id={`mob-img-${i}`} className="flex-shrink-0 w-full h-full snap-center relative">
                      <Image
                        src={img}
                        alt={`${product.title} view ${i + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Wishlist button */}
                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-[#2C1810] shadow-md active:scale-95 transition-transform z-10"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-[18px] w-[18px] stroke-[1.5] transition-all duration-300 ${isFavorited ? "fill-[#4A0E17] text-[#4A0E17]" : ""}`} />
                </button>

                {/* Zoom button */}
                <button
                  className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-[#2C1810] shadow-md active:scale-95 transition-transform z-10"
                  onClick={() => setZoomedImage(productImages[selectedImageIndex])}
                  aria-label="Zoom image"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                {/* Slide counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-[#1A1A1A]/70 backdrop-blur-md text-[#F9F6F1] font-sans tracking-widest text-[9px] px-3 py-1.5 rounded-full border border-white/10">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {productImages.length > 1 && (
                <div className="bg-[#f4f0ea] border-t border-[#D4AF37]/10">
                  <div className="flex gap-2.5 overflow-x-auto px-4 py-3 hide-scrollbar">
                    {productImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedImageIndex(i);
                          const el = document.getElementById(`mob-img-${i}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        }}
                        className={`relative flex-shrink-0 w-[60px] h-[60px] border overflow-hidden transition-all duration-300 ${
                          selectedImageIndex === i
                            ? "border-[#D4AF37] shadow-sm opacity-100 scale-105"
                            : "border-[#D4AF37]/20 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} fill sizes="60px" className="object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── DESKTOP: 1:1 Scroll Spy Stack + Thumbnails ── */}
            <div className="hidden lg:flex gap-4">
              {/* Sticky Thumbnails */}
              {productImages.length > 1 && (
                <div className="w-[80px] flex-shrink-0 flex flex-col gap-3 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-4">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const el = document.getElementById(`prod-img-${i}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`relative aspect-square w-full bg-[#f4f0ea] border overflow-hidden transition-all duration-300 ${
                        selectedImageIndex === i
                          ? "border-[#D4AF37] opacity-100 shadow-sm scale-[1.02]"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} - Thumbnail ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Stack — 1:1 aspect ratio */}
              <div className="flex-1 flex flex-col gap-4">
                {productImages.map((img, i) => (
                  <div
                    key={i}
                    id={`prod-img-${i}`}
                    data-index={i}
                    className="desktop-product-image relative aspect-square w-full bg-[#f4f0ea] overflow-hidden border border-[#D4AF37]/10 group"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - View ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain"
                      priority={i === 0}
                    />
                    {/* Zoom overlay button */}
                    <button
                      onClick={() => setZoomedImage(img)}
                      className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 border border-[#D4AF37]/25 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════
              RIGHT: Product Information (Sticky on Desktop)
              ═══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-5 lg:pt-0 flex flex-col justify-start lg:sticky lg:top-24 self-start"
          >
            {/* Category tag */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-[#D4AF37]" />
              <span className="text-[8.5px] font-sans font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                {getCategoryName(product.category_id)}
              </span>
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <h1
                className="font-serif text-2xl md:text-3xl lg:text-[34px] font-normal tracking-wide text-[#2C1810] leading-tight"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {product.title}
              </h1>

              {/* Display Tags */}
              {product.display_tags && product.display_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.display_tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-transparent text-[9px] font-sans font-medium tracking-[0.25em] text-[#7A6B5D] uppercase border border-[#D4AF37]/30 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#D4AF37]/60" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating Summary */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(Number(avgRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <span className="font-sans text-[10px] text-[#7A6B5D] tracking-wide">{avgRating} ({totalReviews} reviews)</span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <span className="font-serif text-2xl md:text-3xl font-normal text-[#2C1810]" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.stock > 0 ? (
                  <span className="px-2.5 py-0.5 bg-[#2C1810]/5 text-[7.5px] font-sans font-bold tracking-[0.18em] text-[#2C1810] uppercase border border-[#D4AF37]/15">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-[#4A0E17]/10 text-[7.5px] font-sans font-bold tracking-[0.18em] text-[#4A0E17] uppercase border border-[#4A0E17]/20">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* GST Note */}
              <p className="text-[9px] font-sans text-[#9B8E85] tracking-wide">Inclusive of all taxes (18% GST)</p>
            </div>

            <div className="w-full h-[1px] bg-[#D4AF37]/15" />

            {/* Accordion Sections */}
            <div className="border-t border-[#D4AF37]/15">
              {/* Description Accordion */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === "details" ? null : "details")}
                  className="w-full flex items-center justify-between py-4 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">The Details</span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === "details" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "details" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-4 space-y-4">
                        <div className="font-sans text-[13px] text-[#7A6B5D] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fabric & Fit */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === "specs" ? null : "specs")}
                  className="w-full flex items-center justify-between py-4 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">Fabric & Fit</span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === "specs" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "specs" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-4 space-y-4">
                        <div className="font-sans text-[13px] text-[#7A6B5D] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.fabric_fit || "" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                  className="w-full flex items-center justify-between py-4 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">Shipping & Returns</span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === "shipping" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "shipping" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-4 space-y-4">
                        <div className="font-sans text-[13px] text-[#7A6B5D] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.shipping_returns || "" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">Select Size</h3>
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => setIsSizeGuideOpen(true)} className="text-[8.5px] font-sans text-[#7A6B5D] hover:text-[#4A0E17] underline tracking-wider uppercase cursor-pointer">
                      Size Chart
                    </button>
                    <span className="text-[#D4AF37]/40 text-[8px]">•</span>
                    <Link href="/help/size-guide" target="_blank" className="text-[8.5px] font-sans font-medium text-[#D4AF37] hover:underline tracking-wider uppercase">
                      Full Guide ↗
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 flex items-center justify-center font-sans text-xs tracking-wider border transition-all duration-300 cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#2C1810] text-[#D4AF37] border-[#D4AF37]"
                          : "bg-transparent text-[#2C1810] border-[#D4AF37]/25 hover:border-[#D4AF37]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#D4AF37]/20 bg-[#FFFDFC]">
                  <button onClick={decrementQuantity} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-30 cursor-pointer transition-colors">
                    <Minus className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                  <span className="w-10 text-center font-sans text-xs font-semibold text-[#2C1810] border-x border-[#D4AF37]/20">{quantity}</span>
                  <button onClick={incrementQuantity} disabled={quantity >= product.stock} className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-30 cursor-pointer transition-colors">
                    <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                </div>
                <span className="font-sans text-[9px] text-[#7A6B5D] tracking-wide uppercase">{product.stock} pieces left</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-1">
              {!product.stock || product.stock === 0 ? (
                <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="w-full h-13 flex items-center justify-center gap-2.5 bg-[#4A0E17] hover:bg-[#2C1810] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.22em] uppercase border border-[#D4AF37]/35 shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Bell className="h-4 w-4 stroke-[1.5]" />
                  NOTIFY ME WHEN AVAILABLE
                </button>
              ) : (
                <button
                  className="w-full h-13 flex items-center justify-center gap-2.5 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white font-sans text-[10px] font-bold tracking-[0.22em] uppercase border border-[#D4AF37]/35 shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {isAddedToCart ? (
                    <><Check className="h-4 w-4 stroke-[2]" /> ADDED TO BAG</>
                  ) : (
                    <><ShoppingCart className="h-4 w-4 stroke-[1.5]" /> ADD TO BAG — ₹{(product.price * quantity).toLocaleString("en-IN")}</>
                  )}
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className="w-full h-11 flex items-center justify-center gap-2.5 border border-[#D4AF37]/25 text-[#2C1810] font-sans text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:border-[#D4AF37]/65 hover:text-[#4A0E17] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-transparent"
              >
                <Heart className={`h-3.5 w-3.5 stroke-[1.5] ${isFavorited ? "fill-[#4A0E17] text-[#4A0E17]" : ""}`} />
                {isFavorited ? "WISHLISTED" : "ADD TO WISHLIST"}
              </button>
            </div>

            {/* ═══════════════════════════════════
                TRUST BADGES — Premium Section
                ═══════════════════════════════════ */}
            <div className="pt-4 border-t border-[#D4AF37]/10 space-y-3">
              <p className="font-sans text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase text-center">Quality Assured</p>
              <div className="grid grid-cols-3 gap-3">
                {trustBadges.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5 p-2.5 bg-[#f9f6f1] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors duration-200">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                    </div>
                    <div>
                      <p className="font-sans text-[8px] font-bold text-[#2C1810] tracking-wide uppercase leading-tight">{label}</p>
                      <p className="font-sans text-[7.5px] text-[#7A6B5D] mt-0.5 leading-tight">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Made in India Bar */}
              <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-[#2C1810]/5 border border-[#D4AF37]/15">
                <span className="text-lg">🇮🇳</span>
                <div>
                  <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">Proudly Made in India</p>
                  <p className="font-sans text-[8px] text-[#7A6B5D]">Supporting Indian artisans & designers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════
            REVIEWS SECTION
            ═══════════════════════════════════════ */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-[#D4AF37]/10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-2">Verified Buyers</span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#2C1810] tracking-wide mb-3" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>Customer Reviews</h3>
            <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(avgRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <span className="font-serif text-2xl text-[#2C1810]">{avgRating}</span>
                <span className="font-sans text-[10px] text-[#7A6B5D] tracking-widest uppercase">({totalReviews} reviews)</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-[#D4AF37]/30" />
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#2C1810] border border-[#2C1810] px-6 py-2 hover:bg-[#2C1810] hover:text-[#D4AF37] transition-colors"
              >
                Write a Review
              </button>
            </div>
            <div className="w-10 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-12">
                <div className="bg-white border border-[#D4AF37]/20 p-6 md:p-8 max-w-2xl mx-auto">
                  <h4 className="font-serif text-xl text-[#2C1810] mb-6 text-center">Share Your Experience</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-2">
                      <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7A6B5D]">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button type="button" key={star} onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                            <Star className={`w-8 h-8 ${star <= newReviewRating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-gray-200 text-gray-200"} hover:scale-110 transition-transform`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7A6B5D] block mb-2">Your Review</label>
                      <textarea value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} placeholder="Tell us about the fabric, fit, and design..." className="w-full min-h-[120px] p-4 border border-[#D4AF37]/30 bg-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] font-sans text-sm text-[#2C1810] resize-y" required />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setShowReviewForm(false)} className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7A6B5D] hover:text-[#2C1810] transition-colors px-4 py-2">Cancel</button>
                      <button type="submit" disabled={isSubmittingReview} className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-8 py-3 hover:bg-[#4A0E17] transition-colors disabled:opacity-50 font-sans text-[10px] font-bold uppercase tracking-widest">
                        {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Cards */}
          <div className="space-y-6">
            {isLoadingReviews ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" /></div>
            ) : (
              <>
                {reviews.map((review) => {
                  const reviewName = (review as any).profile?.username || "Verified Buyer";
                  const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
                  return (
                    <div key={review.id} className="py-6 border-b border-[#D4AF37]/15 last:border-0">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`h-3 w-3 ${j < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-transparent text-transparent stroke-[#D4AF37] stroke-[1px]"}`} />
                            ))}
                          </div>
                          <span className="font-sans text-[9px] text-[#9B8E85] tracking-widest uppercase">{reviewDate}</span>
                        </div>
                        <p className="font-serif text-[15px] md:text-[17px] leading-[1.8] text-[#2C1810] italic">"{review.comment}"</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">— {reviewName}</span>
                          <span className="w-[1px] h-3 bg-[#D4AF37]/30" />
                          <span className="font-sans text-[8.5px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[8px]">✓</span>
                            Verified Buyer
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {fakeReviews.map((review) => (
                  <div key={review.id} className="py-6 border-b border-[#D4AF37]/15 last:border-0">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3 w-3 ${j < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-transparent text-transparent stroke-[#D4AF37] stroke-[1px]"}`} />
                          ))}
                        </div>
                        <span className="font-sans text-[9px] text-[#9B8E85] tracking-widest uppercase">{review.date}</span>
                      </div>
                      <p className="font-serif text-[15px] md:text-[17px] leading-[1.8] text-[#2C1810] italic">"{review.comment}"</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">— {review.name}</span>
                        {review.verified && (
                          <>
                            <span className="w-[1px] h-3 bg-[#D4AF37]/30" />
                            <span className="font-sans text-[8.5px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold flex items-center gap-1.5">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[8px]">✓</span>
                              Verified Buyer
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            YOU MAY ALSO LIKE
            ═══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 lg:mt-16 pt-12 border-t border-[#D4AF37]/10">
            <div className="text-center mb-8">
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Curated For You</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#2C1810] tracking-wide mt-2 mb-4" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                You May Also Like
              </h2>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto" />
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.product_id} href={`/products/${relProduct.product_id}`} className="group block w-[55vw] sm:w-[42vw] md:w-[26vw] lg:w-[20vw] max-w-[240px] shrink-0 snap-start">
                  <div className="relative aspect-square bg-[#f4f0ea] mb-3 overflow-hidden border border-[#D4AF37]/5">
                    <Image src={relProduct.image || "/placeholder-product.jpg"} alt={relProduct.title} fill sizes="240px" className="object-contain transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif text-[13px] text-[#2C1810] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{relProduct.title}</h4>
                    <p className="font-sans text-[11px] tracking-wide text-[#7A6B5D] font-medium">₹{relProduct.price.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            RECENTLY VIEWED
            ═══════════════════════════════════════ */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12 pt-10 border-t border-[#D4AF37]/10">
            <div className="text-center mb-8">
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Your Browsing History</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#2C1810] tracking-wide mt-2 mb-4" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                Recently Viewed
              </h2>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto" />
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {recentlyViewed.map((rv) => (
                <Link key={rv.product_id} href={`/products/${rv.product_id}`} className="group block w-[55vw] sm:w-[42vw] md:w-[26vw] lg:w-[20vw] max-w-[240px] shrink-0 snap-start">
                  <div className="relative aspect-square bg-[#f4f0ea] mb-3 overflow-hidden border border-[#D4AF37]/5">
                    <Image src={rv.image || "/placeholder-product.jpg"} alt={rv.title} fill sizes="240px" className="object-contain transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif text-[13px] text-[#2C1810] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{rv.title}</h4>
                    <p className="font-sans text-[11px] tracking-wide text-[#7A6B5D] font-medium">₹{rv.price.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D4AF37]/25 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 border border-[#D4AF37]/15 bg-[#f4f0ea]">
            {product.image && <Image src={product.image} alt={product.title} fill sizes="48px" className="object-contain" />}
          </div>
          <div>
            <h4 className="font-serif text-xs text-[#2C1810] line-clamp-1 max-w-[150px] uppercase tracking-wide">{product.title}</h4>
            <p className="font-sans text-[10px] text-[#7A6B5D] font-semibold mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
          </div>
        </div>
        {!product.stock || product.stock === 0 ? (
          <button onClick={() => setIsNotifyModalOpen(true)} className="bg-[#4A0E17] text-[#D4AF37] hover:bg-[#2C1810] font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-5 py-3 border border-[#D4AF37]/35 flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all">
            <Bell className="h-3 w-3 stroke-[1.5]" /> Notify Me
          </button>
        ) : (
          <button onClick={handleAddToCart} className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-5 py-3 border border-[#D4AF37]/35 flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all">
            {isAddedToCart ? <><Check className="h-3 w-3 stroke-[2]" /> Added</> : <><ShoppingCart className="h-3 w-3 stroke-[1.5]" /> Add to Bag</>}
          </button>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFDFC] border border-[#D4AF37]/25 w-full max-w-lg p-6 md:p-8 relative shadow-2xl"
            >
              <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none" />
              <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-4 right-4 text-[#7A6B5D] hover:text-[#2C1810] cursor-pointer transition-colors z-10">✕</button>
              <div className="relative z-10 space-y-5">
                <div className="text-center">
                  <h3 className="font-serif text-lg tracking-wider text-[#2C1810] uppercase">Boutique Size Guide</h3>
                  <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">Standard Measurements in Inches</p>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#D4AF37]/20 text-[#2C1810]">
                        <th className="py-2.5 font-bold uppercase tracking-wider">Size</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Chest</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Waist</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Hips</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#7A6B5D]">
                      {product.category_id === 1 ? (
                        <>
                          {[["XS", 32, 26, 35, 14], ["S", 34, 28, 37, 14.5], ["M", 36, 30, 39, 15], ["L", 38, 32, 41, 15.5], ["XL", 40, 34, 43, 16]].map(([sz, c, w, h, sh]) => (
                            <tr key={sz} className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                              <td className="py-2 font-bold text-[#2C1810]">{sz}</td>
                              <td className="py-2">{c}</td><td className="py-2">{w}</td><td className="py-2">{h}</td><td className="py-2">{sh}</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {[["36 (S)", "US 5.5", "UK 3.5", "22.8 cm", "India 3"], ["37 (M)", "US 6.5", "UK 4.5", "23.5 cm", "India 4"], ["38 (L)", "US 7.5", "UK 5.5", "24.3 cm", "India 5"], ["39 (XL)", "US 8.5", "UK 6.5", "25.1 cm", "India 6"], ["40 (XXL)", "US 9.5", "UK 7.5", "25.8 cm", "India 7"]].map(([sz, c, w, h, sh]) => (
                            <tr key={sz} className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                              <td className="py-2 font-bold text-[#2C1810]">{sz}</td>
                              <td className="py-2">{c}</td><td className="py-2">{w}</td><td className="py-2">{h}</td><td className="py-2">{sh}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-[#FDFBF7] p-3 border border-[#D4AF37]/15">
                  <p className="font-sans text-[9px] text-[#7A6B5D] leading-relaxed text-center uppercase tracking-wide">
                    * Fits true to size. If between sizes, order one size larger for comfortable drape.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        productId={product.product_id}
        productName={product.title}
      />
    </div>
  );
}
