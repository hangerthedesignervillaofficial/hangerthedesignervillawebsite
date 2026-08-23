"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Heart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function CartShoppingPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, isLoading } = useCart();
  const { addToWishlist } = useWishlist();

  const handleMoveToWishlist = (item: any) => {
    addToWishlist({
      product_id: item.product_id,
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      stock: item.stock || 10,
      created_at: new Date().toISOString()
    });
    removeFromCart(item.product_id);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-full border-t-2 border-b-2 border-[#D4AF37]"
          />
          <span className="text-[10px] font-sans tracking-[0.2em] text-[#7A6B5D] uppercase">
            Loading your bag...
          </span>
        </div>
      </div>
    );
  }



  // Free shipping variables
  const shippingThreshold = 999;
  const shippingCost = 99;
  const qualifiesForFreeShipping = subtotal >= shippingThreshold;
  const amountNeededForFreeShipping = shippingThreshold - subtotal;
  const progressPercentage = Math.min((subtotal / shippingThreshold) * 100, 100);
  const tax = subtotal * 0.18;
  const total = subtotal + tax + (qualifiesForFreeShipping ? 0 : shippingCost);

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FFFDFC] to-[#FDFBF7] border-b border-[#D4AF37]/15 relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-3 border border-[#D4AF37]/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#7A6B5D] hover:text-[#D4AF37] transition-all duration-300 mb-4 group/back"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[1.5] group-hover/back:-translate-x-1 transition-transform" />
            <span className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase">
              Back to Boutique
            </span>
          </Link>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
            <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Your Selection
            </span>
            <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
          </div>
          <h1
            className="font-serif text-3xl md:text-4xl font-normal tracking-[0.08em] text-[#2C1810] mt-3 uppercase"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Shopping Bag
          </h1>
          <p className="text-[9.5px] font-sans font-medium tracking-[0.15em] text-[#7A6B5D] uppercase mt-2">
            Private Edit — {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-14">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-6 max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 border border-[#D4AF37]/25 flex items-center justify-center bg-white rounded-full shadow-sm relative group/icon">
              <div 
                className="absolute inset-1 border border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none" 
                style={{ animation: "spin 15s linear infinite" }}
              />
              <ShoppingBag className="h-7 w-7 text-[#D4AF37] stroke-[1.2]" />
            </div>
            <div>
              <h2
                className="font-serif text-lg text-[#2C1810] tracking-[0.18em] uppercase mb-2"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Your bag is empty
              </h2>
              <p className="font-sans text-[10.5px] text-[#7A6B5D]/80 leading-relaxed uppercase tracking-wider">
                Explore our exquisite designer collections and select pieces to add to your private wardrobe.
              </p>
            </div>
            <Link
              href="/products"
              className="w-full sm:w-auto px-10 py-4.5 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/30 transition-all duration-300 rounded-none shadow-md"
            >
              Discover Collections
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#D4AF37]/15 px-2">
                <span className="col-span-6 font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Selected Silhouette</span>
                <span className="col-span-2 font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase text-center">Qty</span>
                <span className="col-span-2 font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase text-right">Price</span>
                <span className="col-span-2 font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase text-right">Total</span>
              </div>

              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center py-6 border-b border-[#D4AF37]/10 group hover:bg-[#FFFCF7]/40 transition-colors px-2 rounded-none"
                  >
                    {/* Image & Product Info */}
                    <div className="col-span-12 md:col-span-6 flex gap-4 md:gap-5">
                      <div className="w-20 h-24 md:w-24 md:h-28 flex-shrink-0 overflow-hidden border border-[#D4AF37]/15 bg-white relative shadow-sm group-hover:border-[#D4AF37]/40 transition-colors rounded-none">
                        <Image
                          src={item.image || ""}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-1.5 block">
                          Designer Silhouette
                        </span>
                        <h3 className="font-serif text-[13px] md:text-sm font-medium text-[#2C1810] tracking-wide truncate group-hover:text-[#4A0E17] transition-colors">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[9.5px] md:text-[10px] text-[#7A6B5D] mt-1 line-clamp-1 md:line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="text-[8px] font-sans font-bold tracking-[0.18em] uppercase text-[#7A6B5D]/80 hover:text-[#4A0E17] transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Heart className="h-3.5 w-3.5 stroke-[1.5] text-[#D4AF37]" />
                            Save to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Toggles */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0 pt-3 md:pt-0 border-t border-[#D4AF37]/10 md:border-t-0">
                      <span className="md:hidden font-sans text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase">Quantity</span>
                      <div className="flex items-center">
                        <div className="flex items-center border border-[#D4AF37]/35 bg-white rounded-none p-[1px]">
                          <button
                            onClick={() => updateQuantity(item.product_id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-[#2C1810] hover:bg-[#F0E6D8]/40 cursor-pointer transition-colors"
                          >
                            <Minus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                          <span className="w-8 text-center font-sans text-xs font-bold text-[#2C1810]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#2C1810] hover:bg-[#F0E6D8]/40 cursor-pointer transition-colors"
                          >
                            <Plus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="ml-3 w-7 h-7 flex items-center justify-center text-[#7A6B5D]/40 hover:text-red-700 hover:bg-red-50/50 cursor-pointer transition-all duration-300 rounded-full"
                          title="Remove piece"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Single Price (Hidden on mobile) */}
                    <div className="hidden md:block col-span-2 text-right">
                      <span className="font-sans text-xs font-medium text-[#7A6B5D]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Total Price */}
                    <div className="col-span-12 md:col-span-2 flex justify-between md:block text-right mt-2 md:mt-0 pt-2 md:pt-0 border-t border-dashed border-[#D4AF37]/10 md:border-t-0">
                      <span className="md:hidden font-sans text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase">Subtotal</span>
                      <span className="font-sans text-[13px] md:text-sm font-semibold text-[#2C1810]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sticky Order Summary Card */}
            <div className="lg:col-span-4 mt-4 lg:mt-0">
              <div className="sticky top-28 border border-[#D4AF37]/25 bg-[#FFFCF7]/95 backdrop-blur-md p-6 md:p-8 relative overflow-hidden shadow-xl shadow-[#D4AF37]/5 rounded-none">
                <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none rounded-none" />
                
                <div className="relative z-10">
                  <h3
                    className="font-serif text-base text-[#2C1810] tracking-[0.2em] uppercase mb-6 text-center"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    Boutique Summary
                  </h3>

                  {/* Free Shipping Tracker */}
                  <div className="mb-6 border-b border-[#D4AF37]/10 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-sans font-bold tracking-widest text-[#7A6B5D] uppercase">
                        Shipping Privilege
                      </span>
                      {qualifiesForFreeShipping ? (
                        <span className="text-[9px] font-sans font-bold text-green-600 tracking-wider flex items-center gap-1 uppercase">
                          <Check className="h-3 w-3" /> Qualified
                        </span>
                      ) : (
                        <span className="text-[9px] font-sans font-bold text-[#D4AF37] tracking-wider uppercase">
                          ₹{amountNeededForFreeShipping.toLocaleString("en-IN")} away
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-[#D4AF37]/10 rounded-none overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C59B27] rounded-none"
                      />
                    </div>
                    <p className="text-[9.5px] font-sans text-[#7A6B5D] leading-relaxed text-center italic">
                      {qualifiesForFreeShipping
                        ? "Your order qualifies for complimentary priority shipping."
                        : `Add items worth ₹${amountNeededForFreeShipping.toLocaleString("en-IN")} more to unlock complimentary shipping.`}
                    </p>
                  </div>

                  <div className="space-y-4 text-[11px] md:text-xs">
                    <div className="flex justify-between">
                      <span className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-[0.15em]">Bag Subtotal</span>
                      <span className="font-sans text-xs font-semibold text-[#2C1810]">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-[0.15em]">Estimated Tax (18%)</span>
                      <span className="font-sans text-xs font-semibold text-[#2C1810]">
                        ₹{tax.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-[0.15em]">Delivery Edit</span>
                      <span className="font-sans text-xs font-semibold text-[#D4AF37] tracking-widest uppercase">
                        {qualifiesForFreeShipping ? "Complimentary" : `₹${shippingCost}`}
                      </span>
                    </div>
                    <div className="w-full h-[1px] bg-[#D4AF37]/15 my-4" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#2C1810] uppercase">
                        Estimated Total
                      </span>
                      <span
                        className="font-serif text-xl md:text-2xl font-normal text-[#2C1810]"
                        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                      >
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full mt-8 py-4.5 bg-[#2C1810] text-[#D4AF37] hover:text-[#FFF] font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-center border border-[#D4AF37]/30 hover:bg-[#4A0E17] hover:tracking-[0.25em] transition-all duration-350 hover:shadow-lg hover:shadow-[#D4AF37]/10 rounded-none hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full mt-3 py-3.5 border border-[#D4AF37]/25 text-[#2C1810] font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-center bg-white/40 hover:border-[#D4AF37]/60 hover:bg-white transition-all duration-300 rounded-none"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D4AF37]/25 p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="block font-sans text-[8px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">Estimated Total</span>
            <span className="font-serif text-base font-semibold text-[#2C1810]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <Link
            href="/checkout"
            className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 border border-[#D4AF37]/35 shadow-md active:scale-95 transition-all"
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
