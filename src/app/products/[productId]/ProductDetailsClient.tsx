"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductType } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ReviewTab } from "./_components/review-tab";
import { NotifyMeModal } from "@/components/NotifyMeModal";

type ProductDetailsClientProps = {
  product: ProductType;
  relatedProducts?: ProductType[];
};

const getCategoryName = (categoryId?: number) => {
  switch (categoryId) {
    case 1:
      return "Clothing";
    case 2:
      return "Jewellery";
    case 3:
      return "Accessories";
    case 4:
      return "Footwear";
    default:
      return "Exclusive Collection";
  }
};

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
  const [openSection, setOpenSection] = useState<string | null>('details');
  const isFavorited = isInWishlist(product.product_id);

  // Get detailed specifications based on the product
  const getProductSpecs = (id: string) => {
    switch (id) {
      case "prod_1":
        return {
          fabric: "Premium Italian-Irish Linen",
          technique: "Hand-embellished Floral Art",
          fit: "Relaxed Tailored Silhouette",
          occasion: "Resort & Luxury Daywear",
          care: "Dry Clean Only",
          heritage: "Hand-finished by master tailors in our Delhi atelier, featuring intricate micro-bead embroidery."
        };
      case "prod_2":
        return {
          fabric: "100% Pure Mulberry Silk Organza",
          technique: "Hand-woven Lucknowi Chikankari",
          fit: "Classic Fluid Drape (5.5m)",
          occasion: "Heritage Festivities & Weddings",
          care: "Gentle Hand Wash / Dry Clean",
          heritage: "Each thread is shadow-stitched by hand over a span of 3 months by women artisans in Lucknow."
        };
      case "prod_3":
        return {
          fabric: "Mercerized Chanderi Silk-Cotton",
          technique: "Artisanal Gold Gota Patti Work",
          fit: "Flared A-Line Silhouette",
          occasion: "Mehendi & Festive Soirées",
          care: "Dry Clean Only",
          heritage: "Features gold-plated ribbon wire work layered onto handloom Chanderi fabric."
        };
      case "prod_4":
        return {
          fabric: "Pure Flowing Georgette",
          technique: "Micro-pleating & Scalloped Borders",
          fit: "Dramatic 24-Kali Flared Anarkali",
          occasion: "Evening Galas & Festivities",
          care: "Dry Clean Recommended",
          heritage: "A heavy flare silhouette featuring gold Zardozi embroidery with delicate hand-cut borders."
        };
      case "prod_5":
        return {
          fabric: "Handloom Tussar Silk",
          technique: "Traditional Punjabi Phulkari",
          fit: "Classic Straight-Cut Kurta",
          occasion: "Celebrations & Roka Ceremonies",
          care: "Dry Clean Only",
          heritage: "Adorned with geometric patola darning stitches using colorful untwisted silk floss."
        };
      case "prod_6":
        return {
          fabric: "22kt Gold-Plated Recycled Silver",
          technique: "Jadau Kundan & Basra Pearls",
          fit: "Chandelier Statement Earring (Pair)",
          occasion: "Trousseau & Royal Festivities",
          care: "Store in airtight pouch, avoid moisture",
          heritage: "Uncut stones are embedded into hand-refined silver foil, finished with real saltwater pearl drops."
        };
      case "prod_7":
        return {
          fabric: "100% Genuine Tuscan Leather",
          technique: "Hand-embellished Dabka Wirework",
          fit: "Ergonomic Cushioned Flat Sole",
          occasion: "Festive Walks & Day Celebrations",
          care: "Wipe clean, avoid water exposure",
          heritage: "Crafted in Punjab with hand-cushioned double leather soles and gold Dabka wire accents."
        };
      case "prod_8":
        return {
          fabric: "Premium sheer Organza Silk",
          technique: "Hand-painted Pastel Botanical Art",
          fit: "Ethereal Flowy Saree",
          occasion: "Hi-Tea & Summer Weddings",
          care: "Dry Clean Only",
          heritage: "Hand-painted individual flower motifs highlighted with delicate seed pearls and sequins."
        };
      default:
        return {
          fabric: "Handcrafted Premium Fabric",
          technique: "Artisan Embroidery Detailing",
          fit: "Custom Tailored Fit",
          occasion: "Luxury Occasions",
          care: "Dry Clean Recommended",
          heritage: "Designed and produced in limited runs under Hanger's luxury slow-fashion guidelines."
        };
    }
  };

  const specs = getProductSpecs(product.product_id);

  // Generate multiple images from the single image (mock data for demo)
  const productImages = product.image
    ? [product.image, ...(product.gallery || [])]
    : ["/placeholder-product.jpg"];

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size before adding to bag");
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          selected_size: selectedSize || undefined
        } as any);
      }
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-20 lg:pb-10">
      <div className="container mx-auto px-4 py-6 md:py-10">

        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          <Link href="/" className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#7A6B5D] hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <span className="text-[#D4AF37]/40 text-[8px]">●</span>
          <Link href="/products" className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#7A6B5D] hover:text-[#D4AF37] transition-colors">
            Shop
          </Link>
          <span className="text-[#D4AF37]/40 text-[8px]">●</span>
          <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#2C1810] font-semibold">
            {product.title}
          </span>
        </motion.nav>

        <div className="mb-16 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left: Product Images (Editorial Stack on Desktop, Edge-to-Edge Carousel on Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 w-full"
          >
            {/* Mobile: Edge-to-edge Carousel */}
            <div className="lg:hidden -mx-4 relative overflow-hidden">
              <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {productImages.map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] w-full flex-none snap-center bg-[#f4f0ea]">
                    <Image
                      src={img}
                      alt={`${product.title} - View ${i + 1}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
              {/* Floating action buttons on Mobile */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md text-[#2C1810] shadow-sm active:scale-95 transition-transform"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                >
                  <Heart
                    className={`h-4 w-4 stroke-[1.5] transition-all duration-300 ${
                      isFavorited ? "fill-[#4A0E17] text-[#4A0E17] scale-110" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Desktop: Stacked Masonry/Grid */}
            <div className="hidden lg:flex flex-col gap-4">
              {productImages.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] w-full bg-[#f4f0ea] group overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.title} - View ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Information (Sticky on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8 lg:pt-2 flex flex-col justify-start lg:sticky lg:top-24 self-start"
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
                className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal tracking-wide text-[#2C1810] leading-tight"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 pt-1">
                <span className="font-serif text-xl md:text-2xl font-normal text-[#2C1810]" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
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
            </div>

            <div className="w-full h-[1px] bg-[#D4AF37]/15" />

            {/* Accordion Sections */}
            <div className="border-t border-[#D4AF37]/15">
              {/* Description Accordion */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                  className="w-full flex items-center justify-between py-5 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">
                    The Details
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === 'details' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection === 'details' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 space-y-4">
                        <p className="font-sans text-[13px] text-[#7A6B5D] leading-relaxed">
                          {product.description}
                        </p>
                        <p className="font-serif text-[13px] text-[#2C1810] leading-relaxed italic">
                          "Designed as a tribute to classic Indian artisanal crafts, this piece balances structural geometry with fluid softness. It speaks to the contemporary wearer who seeks statement elements rooted in native craft legacy."
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Specifications Accordion */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === 'specs' ? null : 'specs')}
                  className="w-full flex items-center justify-between py-5 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">
                    Fabric & Fit
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection === 'specs' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 grid grid-cols-2 gap-y-5 gap-x-4">
                        <div className="space-y-1">
                          <span className="block font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">Fabrication</span>
                          <span className="font-serif text-[13px] text-[#2C1810]">{specs.fabric}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">Technique</span>
                          <span className="font-serif text-[13px] text-[#2C1810]">{specs.technique}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">Silhouette</span>
                          <span className="font-serif text-[13px] text-[#2C1810]">{specs.fit}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">Occasion</span>
                          <span className="font-serif text-[13px] text-[#2C1810]">{specs.occasion}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns Accordion */}
              <div className="border-b border-[#D4AF37]/15">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between py-5 cursor-pointer group"
                >
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase group-hover:text-[#D4AF37] transition-colors">
                    Shipping & Returns
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#7A6B5D] transition-transform duration-300 ${openSection === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 space-y-4">
                        <ul className="space-y-3 font-sans text-[12px] text-[#7A6B5D] leading-relaxed">
                          <li className="flex gap-3">
                            <Truck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                            <span>Complimentary express shipping on all domestic orders over ₹999. Delivered within 3-5 business days.</span>
                          </li>
                          <li className="flex gap-3">
                            <RotateCcw className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                            <span>30-day return window. Items must be unworn, unwashed, and have original tags attached.</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Size Selector */}
            {(product.sizes && product.sizes.length > 0) && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
                    Select Size
                  </h3>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[8px] font-sans text-[#7A6B5D] hover:text-[#4A0E17] underline tracking-wider uppercase cursor-pointer"
                  >
                    Size Guide
                  </button>
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
              <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#D4AF37]/20 bg-[#FFFDFC]">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                  <span className="w-10 text-center font-sans text-xs font-semibold text-[#2C1810] border-x border-[#D4AF37]/20">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center text-[#2C1810] hover:text-[#D4AF37] disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                  </button>
                </div>
                <span className="font-sans text-[9px] text-[#7A6B5D] tracking-wide uppercase">
                  {product.stock} pieces left
                </span>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="space-y-3 pt-2">
              {/* Add to Cart / Notify Me Button */}
              {(!product.stock || product.stock === 0) ? (
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
                    <>
                      <Check className="h-4 w-4 stroke-[2]" />
                      ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 stroke-[1.5]" />
                      ADD TO BAG — ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </>
                  )}
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="w-full h-11 flex items-center justify-center gap-2.5 border border-[#D4AF37]/25 text-[#2C1810] font-sans text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:border-[#D4AF37]/65 hover:text-[#4A0E17] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-transparent"
              >
                <Heart className={`h-3.5 w-3.5 stroke-[1.5] ${isFavorited ? "fill-[#4A0E17] text-[#4A0E17]" : ""}`} />
                {isFavorited ? "WISHLISTED" : "ADD TO WISHLIST"}
              </button>
            </div>

            {/* Brand Value Props */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/10">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37]/15">
                  <Truck className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <div>
                  <p className="font-sans text-[9px] font-bold text-[#2C1810] tracking-wide uppercase">Free Shipping</p>
                  <p className="font-sans text-[8px] text-[#7A6B5D] mt-0.5">Orders ₹999+</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37]/15">
                  <Shield className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <div>
                  <p className="font-sans text-[9px] font-bold text-[#2C1810] tracking-wide uppercase">Secure Pay</p>
                  <p className="font-sans text-[8px] text-[#7A6B5D] mt-0.5">SSL Encrypted</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37]/15">
                  <RotateCcw className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <div>
                  <p className="font-sans text-[9px] font-bold text-[#2C1810] tracking-wide uppercase">Easy Returns</p>
                  <p className="font-sans text-[8px] text-[#7A6B5D] mt-0.5">30-Day Policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

          {/* Reviews Section */}
          <div className="mt-12 lg:mt-16 space-y-6 pt-8 max-w-4xl mx-auto">
            <h3 className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#2C1810] uppercase text-center">
              Customer Reviews
            </h3>
            <div className="w-10 h-[1px] bg-[#D4AF37] mx-auto mb-8" />
            <ReviewTab product={product} />
          </div>

          {/* YOU MAY ALSO LIKE Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 lg:mt-32 pt-16 border-t border-[#D4AF37]/10">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl md:text-4xl text-[#2C1810] tracking-wide mb-4">
                  You May Also Like
                </h2>
                <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto" />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link key={relProduct.product_id} href={`/products/${relProduct.product_id}`} className="group block">
                    <div className="relative aspect-[3/4] bg-[#f4f0ea] mb-4 overflow-hidden">
                      <Image 
                        src={relProduct.image || "/placeholder-product.jpg"} 
                        alt={relProduct.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="font-serif text-[13px] text-[#2C1810] line-clamp-1">{relProduct.title}</h4>
                      <p className="font-sans text-[11px] tracking-wide text-[#7A6B5D]">₹{relProduct.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D4AF37]/25 p-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-16 border border-[#D4AF37]/15 bg-[#f4f0ea]">
            {product.image && (
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover" 
              />
            )}
          </div>
          <div>
            <h4 className="font-serif text-xs text-[#2C1810] line-clamp-1 max-w-[150px] uppercase tracking-wide">
              {product.title}
            </h4>
            <p className="font-sans text-[10px] text-[#7A6B5D] font-semibold mt-0.5">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {(!product.stock || product.stock === 0) ? (
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="bg-[#4A0E17] text-[#D4AF37] hover:bg-[#2C1810] hover:text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-5 py-3 border border-[#D4AF37]/35 flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
          >
            <Bell className="h-3 w-3 stroke-[1.5]" />
            Notify Me
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-5 py-3 border border-[#D4AF37]/35 flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
          >
            {isAddedToCart ? (
              <>
                <Check className="h-3 w-3 stroke-[2]" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 stroke-[1.5]" />
                Add to Bag
              </>
            )}
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
              
              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-[#7A6B5D] hover:text-[#2C1810] cursor-pointer transition-colors z-10"
              >
                ✕
              </button>

              <div className="relative z-10 space-y-5">
                <div className="text-center">
                  <h3 className="font-serif text-lg tracking-wider text-[#2C1810] uppercase">
                    Boutique Size Guide
                  </h3>
                  <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">
                    Standard Measurements in Inches
                  </p>
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
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">XS</td>
                            <td className="py-2">32</td>
                            <td className="py-2">26</td>
                            <td className="py-2">35</td>
                            <td className="py-2">14</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">S</td>
                            <td className="py-2">34</td>
                            <td className="py-2">28</td>
                            <td className="py-2">37</td>
                            <td className="py-2">14.5</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7] bg-[#FDFBF7]/30">
                            <td className="py-2 font-bold text-[#2C1810]">M</td>
                            <td className="py-2">36</td>
                            <td className="py-2">30</td>
                            <td className="py-2">39</td>
                            <td className="py-2">15</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">L</td>
                            <td className="py-2">38</td>
                            <td className="py-2">32</td>
                            <td className="py-2">41</td>
                            <td className="py-2">15.5</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/20 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">XL</td>
                            <td className="py-2">40</td>
                            <td className="py-2">34</td>
                            <td className="py-2">43</td>
                            <td className="py-2">16</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">36 (S)</td>
                            <td className="py-2">US 5.5</td>
                            <td className="py-2">UK 3.5</td>
                            <td className="py-2">22.8 cm</td>
                            <td className="py-2">India 3</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">37 (M)</td>
                            <td className="py-2">US 6.5</td>
                            <td className="py-2">UK 4.5</td>
                            <td className="py-2">23.5 cm</td>
                            <td className="py-2">India 4</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7] bg-[#FDFBF7]/30">
                            <td className="py-2 font-bold text-[#2C1810]">38 (L)</td>
                            <td className="py-2">US 7.5</td>
                            <td className="py-2">UK 5.5</td>
                            <td className="py-2">24.3 cm</td>
                            <td className="py-2">India 5</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">39 (XL)</td>
                            <td className="py-2">US 8.5</td>
                            <td className="py-2">UK 6.5</td>
                            <td className="py-2">25.1 cm</td>
                            <td className="py-2">India 6</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/20 hover:bg-[#FDFBF7]">
                            <td className="py-2 font-bold text-[#2C1810]">40 (XXL)</td>
                            <td className="py-2">US 9.5</td>
                            <td className="py-2">UK 7.5</td>
                            <td className="py-2">25.8 cm</td>
                            <td className="py-2">India 7</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#FDFBF7] p-3 border border-[#D4AF37]/15">
                  <p className="font-sans text-[9px] text-[#7A6B5D] leading-relaxed text-center uppercase tracking-wide">
                    * Fits true to size. If you are between sizes, we recommend ordering one size larger for a comfortable drape.
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
