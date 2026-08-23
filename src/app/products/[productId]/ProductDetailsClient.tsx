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
  Share2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from "lucide-react";
import { ReviewTab } from "./_components/review-tab";

type ProductDetailsClientProps = {
  product: ProductType;
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
}: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const isFavorited = isInWishlist(product.product_id);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  // Mouse position state for magnification zoom on hover
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

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
    ? [product.image, product.image, product.image, product.image]
    : ["/placeholder-product.jpg"];

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
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

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
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

        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">

          {/* Left: Product Images (58% Grid span on Desktop for editorial focus) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-4"
          >
            <div 
              className="relative aspect-[3/4] overflow-hidden bg-[#f4f0ea] border border-[#D4AF37]/10 group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  className="relative h-full w-full transition-transform duration-75 ease-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isHovering ? "scale(1.8)" : "scale(1)"
                  }}
                >
                  {product.image ? (
                    <Image
                      src={productImages[selectedImageIndex]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f4f0ea]">
                      <span className="text-[#7A6B5D] text-sm font-sans">
                        No image available
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {productImages.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#D4AF37]/20 text-[#2C1810] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all cursor-pointer shadow-xs z-10"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  >
                    <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
                  </button>
                  <button
                    className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#D4AF37]/20 text-[#2C1810] hover:border-[#D4AF37] hover:text-[#4A0E17] transition-all cursor-pointer shadow-xs z-10"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  >
                    <ChevronRight className="h-4 w-4 stroke-[1.5]" />
                  </button>
                </>
              )}

              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  className="w-9 h-9 flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#D4AF37]/20 text-[#2C1810] hover:border-[#4A0E17] hover:text-[#4A0E17] transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                >
                  <Heart
                    className={`h-4 w-4 stroke-[1.5] transition-all duration-300 ${
                      isFavorited ? "fill-[#4A0E17] text-[#4A0E17] scale-110" : ""
                    }`}
                  />
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#D4AF37]/20 text-[#2C1810] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-4 w-4 stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex justify-center gap-2.5 md:grid md:grid-cols-4 md:gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 md:w-auto md:h-auto aspect-square md:aspect-[3/4] shrink-0 cursor-pointer overflow-hidden border transition-all duration-300 relative ${
                      selectedImageIndex === index
                        ? "border-[#D4AF37] shadow-[0_0_0_1px_#D4AF37]"
                        : "border-[#D4AF37]/10 hover:border-[#D4AF37]/45"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={120}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                    {selectedImageIndex !== index && (
                      <div className="absolute inset-0 bg-[#FFFDFC]/20 hover:bg-transparent transition-colors duration-300" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Information (42% Grid span on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6 lg:pt-2 flex flex-col justify-start"
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

            {/* Editorial Description Hook */}
            <p className="font-sans text-[13px] text-[#7A6B5D] leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Grid */}
            <div className="py-4 border-y border-[#D4AF37]/15">
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                <div>
                  <span className="block font-sans text-[8px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Fabrication</span>
                  <span className="font-serif text-[12px] text-[#2C1810] italic">{specs.fabric}</span>
                </div>
                <div>
                  <span className="block font-sans text-[8px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Technique</span>
                  <span className="font-serif text-[12px] text-[#2C1810] italic">{specs.technique}</span>
                </div>
                <div>
                  <span className="block font-sans text-[8px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Silhouette</span>
                  <span className="font-serif text-[12px] text-[#2C1810] italic">{specs.fit}</span>
                </div>
                <div>
                  <span className="block font-sans text-[8px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Occasion</span>
                  <span className="font-serif text-[12px] text-[#2C1810] italic">{specs.occasion}</span>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            {(product.category_id === 1 || product.category_id === 4) && (
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
                  {(product.category_id === 1 ? ["XS", "S", "M", "L", "XL"] : ["36", "37", "38", "39", "40"]).map((size) => (
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
              {/* Add to Cart Button */}
              <button
                className="w-full h-13 flex items-center justify-center gap-2.5 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white font-sans text-[10px] font-bold tracking-[0.22em] uppercase border border-[#D4AF37]/35 shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!product.stock || product.stock === 0}
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

        {/* Product Detail Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-16"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-[#D4AF37]/15 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer relative ${
                activeTab === "description"
                  ? "text-[#2C1810]"
                  : "text-[#7A6B5D] hover:text-[#2C1810]"
              }`}
            >
              Description & Details
              {activeTab === "description" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer relative ${
                activeTab === "reviews"
                  ? "text-[#2C1810]"
                  : "text-[#7A6B5D] hover:text-[#2C1810]"
              }`}
            >
              Reviews
              {activeTab === "reviews" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "description" ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="border border-[#D4AF37]/25 bg-[#FFFCF7] p-8 md:p-10 relative overflow-hidden"
              >
                {/* Decorative inner gold outline */}
                <div className="absolute inset-3 border border-[#D4AF37]/10 pointer-events-none" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Story */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-sm font-normal text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" /> The Designer's Note
                    </h4>
                    <p className="font-serif text-[13px] text-[#7A6B5D] leading-relaxed italic">
                      "Designed as a tribute to classic Indian artisanal crafts, this piece balances structural geometry with fluid softness. It speaks to the contemporary wearer who seeks statement elements rooted in native craft legacy."
                    </p>
                  </div>

                  {/* Middle Column: Heritage */}
                  <div className="space-y-3 border-t md:border-t-0 md:border-x border-[#D4AF37]/15 md:px-6">
                    <h4 className="font-serif text-sm font-normal text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" /> Heritage & Craft
                    </h4>
                    <p className="font-sans text-xs text-[#7A6B5D] leading-relaxed">
                      {specs.heritage} Our atelier supports slow-fashion practices and native weaving clusters to ensure long-term preservation of ancestral handwork and geometric embroidery styles.
                    </p>
                  </div>

                  {/* Right Column: Spec List */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-sm font-normal text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" /> Care & Details
                    </h4>
                    <ul className="space-y-2 text-xs text-[#7A6B5D] font-sans">
                      <li className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">✦</span> <strong>Composition:</strong> {specs.fabric}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">✦</span> <strong>Care Instructions:</strong> {specs.care}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">✦</span> <strong>Authenticity:</strong> 100% Handloom Certified
                      </li>
                      {product.sku && (
                        <li className="flex items-center gap-2 pt-1 border-t border-[#D4AF37]/10">
                          <span className="text-[#D4AF37]">✦</span> <strong>Product SKU:</strong> {product.sku}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ReviewTab product={product} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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

        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
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
    </div>
  );
}
