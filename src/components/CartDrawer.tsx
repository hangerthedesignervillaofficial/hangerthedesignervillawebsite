"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Tag,
  ChevronRight,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";
import { couponService, Coupon } from "@/services/coupon/couponService";

interface CartDrawerProps {
  children: React.ReactElement;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const router = useRouter();
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [open, setOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  // Constants
  const shippingThreshold = 999;
  const shippingCost = 99;
  const qualifiesForFreeShipping = subtotal >= shippingThreshold;
  const shipping = qualifiesForFreeShipping ? 0 : subtotal > 0 ? shippingCost : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.18;
  const total = discountedSubtotal + tax + shipping;

  // Load available coupons for 1-click tap
  useEffect(() => {
    couponService.getCoupons().then((list) => {
      setAvailableCoupons(list.filter((c) => c.isActive));
    });
  }, []);

  const handleApply = async (codeToUse?: string) => {
    const code = (codeToUse || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a voucher code");
      return;
    }
    setCouponError(null);
    setIsApplyingCoupon(true);
    const res = await applyCoupon(code);
    setIsApplyingCoupon(false);

    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponCodeInput("");
    }
  };

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#D4AF37]/20 p-0 flex flex-col h-[100dvh] sm:h-full shadow-2xl z-[110] rounded-none select-none"
      >
        {/* Luxury Custom Header - Zero Overlap with Close Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D4AF37]/20 bg-white/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/25">
              <ShoppingBag className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className="font-serif text-sm tracking-[0.2em] uppercase text-[#2C1810] font-bold"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Your Selection
                </span>
                <span className="font-sans text-[8px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 tracking-widest uppercase">
                  {totalItems} {totalItems === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <span className="font-sans text-[7.5px] tracking-[0.3em] text-[#7A6B5D] uppercase mt-0.5">
                Hanger Curated Boutique
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810] hover:bg-[#2C1810]/5 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin">
          {/* Free Shipping Tracker */}
          <div className="p-3.5 bg-white border border-[#D4AF37]/20 shadow-xs">
            <div className="flex justify-between items-center text-[9px] font-sans font-bold tracking-widest uppercase mb-1.5">
              <span className="text-[#7A6B5D]">White-Glove Shipping</span>
              {qualifiesForFreeShipping ? (
                <span className="text-green-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Qualified
                </span>
              ) : (
                <span className="text-[#D4AF37]">
                  {formatCurrency(shippingThreshold - subtotal)} away
                </span>
              )}
            </div>
            <div className="w-full h-1 bg-[#D4AF37]/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-[#D4AF37]"
              />
            </div>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 text-[#7A6B5D] max-w-xs mx-auto py-16">
              <div className="w-20 h-20 border border-[#D4AF37]/25 flex items-center justify-center bg-white rounded-full shadow-sm relative group/icon">
                <div
                  className="absolute inset-1 border border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none"
                  style={{ animation: "spin 15s linear infinite" }}
                />
                <ShoppingBag className="h-7 w-7 text-[#D4AF37] stroke-[1.2] transition-transform duration-500 group-hover/icon:scale-110" />
              </div>
              <div className="space-y-2">
                <p
                  className="font-serif text-sm text-[#2C1810] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Your Bag is Vacant
                </p>
                <p className="font-sans text-[10px] text-[#7A6B5D]/80 leading-relaxed uppercase tracking-wider">
                  Explore our designer collections and add hand-finished silhouettes to your private wardrobe.
                </p>
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 py-6 border border-[#D4AF37]/35 rounded-none shadow-md cursor-pointer"
              >
                Discover New Silhouettes
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                  className="flex gap-4 items-center border border-[#D4AF37]/15 bg-white p-3.5 relative group shadow-sm"
                >
                  {/* Thumbnail Image Container */}
                  <div className="h-24 w-18 md:h-28 md:w-22 rounded-none overflow-hidden bg-[#FDFBF7] border border-[#D4AF37]/15 flex-shrink-0 relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1596458514167-9359c25095d5?w=200"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col h-24 md:h-28 justify-between min-w-0 py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[7.5px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase block">
                          Designer Silhouette
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-[#7A6B5D]/40 hover:text-red-700 p-1 transition-colors cursor-pointer"
                          title="Remove piece"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                      <h4
                        className="font-serif font-medium text-[#2C1810] tracking-wide text-xs line-clamp-1 mt-0.5"
                        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                      >
                        {item.title}
                      </h4>
                      <p className="font-sans text-[9px] text-[#7A6B5D] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#D4AF37]/10">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#D4AF37]/35 bg-white">
                        <button
                          className="w-6 h-6 flex items-center justify-center text-[#7A6B5D] hover:text-[#2C1810] transition-colors cursor-pointer text-xs"
                          onClick={() => updateQuantity(item.product_id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="font-sans text-[10px] font-bold w-6 text-center text-[#2C1810]">
                          {item.quantity}
                        </span>
                        <button
                          className="w-6 h-6 flex items-center justify-center text-[#7A6B5D] hover:text-[#2C1810] transition-colors cursor-pointer text-xs"
                          onClick={() => updateQuantity(item.product_id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <span className="font-sans font-bold text-xs md:text-sm text-[#2C1810]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Luxury Promotional Voucher Section (inside scroll area) */}
          {cartItems.length > 0 && (
            <div className="border border-[#D4AF37]/25 bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="font-sans text-[9.5px] font-bold tracking-[0.18em] text-[#2C1810] uppercase">
                    Privilege Voucher & Promo
                  </span>
                </div>
                {appliedCoupon && (
                  <button
                    onClick={removeCoupon}
                    className="text-[8.5px] font-sans font-bold text-red-700 tracking-wider uppercase hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-3 bg-green-50/70 border border-green-600/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-green-700 shrink-0" />
                    <div>
                      <span className="font-mono text-xs font-bold text-green-800 tracking-wider uppercase block">
                        {appliedCoupon.code}
                      </span>
                      <span className="font-sans text-[9px] text-green-700">
                        {appliedCoupon.description || "Privilege discount applied"} (Saved {formatCurrency(discountAmount)})
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-xs font-bold text-green-800">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApply();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ""));
                        setCouponError(null);
                      }}
                      className="flex-1 bg-[#FDFBF7] border border-[#D4AF37]/30 px-3 py-2 text-xs font-mono font-bold tracking-widest text-[#2C1810] placeholder:text-[#7A6B5D]/40 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-widest uppercase transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </button>
                  </form>

                  {/* Inline Error Message */}
                  {couponError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-sans"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span>{couponError}</span>
                    </motion.div>
                  )}

                  {/* Quick Tap Coupons Chips */}
                  {availableCoupons.length > 0 && (
                    <div className="pt-2 border-t border-[#D4AF37]/10">
                      <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase block mb-2">
                        Available Boutique Privileges:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableCoupons.slice(0, 3).map((cpn) => {
                          const meetsThreshold = !cpn.minOrderValue || subtotal >= cpn.minOrderValue;

                          return (
                            <button
                              key={cpn.id}
                              type="button"
                              onClick={() => handleApply(cpn.code)}
                              className={`flex items-center gap-1 px-2.5 py-1 text-[8.5px] font-sans font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                                meetsThreshold
                                  ? "bg-[#FDFBF7] text-[#2C1810] border-[#D4AF37]/40 hover:bg-[#2C1810] hover:text-[#D4AF37]"
                                  : "bg-gray-50 text-[#7A6B5D]/60 border-gray-200 hover:border-gray-400"
                              }`}
                              title={
                                !meetsThreshold
                                  ? `Requires min order of ₹${cpn.minOrderValue.toLocaleString("en-IN")}`
                                  : `Apply ${cpn.code}`
                              }
                            >
                              <Tag className="w-2.5 h-2.5 text-[#D4AF37]" />
                              <span>{cpn.code}</span>
                              <span className="opacity-70 font-normal">
                                ({cpn.discountType === "percentage" ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Compact, Luxury Fixed Bottom Checkout Bar */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#D4AF37]/20 bg-[#FFFDFC] p-4 md:p-5 shadow-[0_-10px_30px_rgba(44,24,16,0.06)] shrink-0 space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="space-y-1.5 font-sans text-xs">
              <div className="flex justify-between text-[#7A6B5D]">
                <span className="text-[10px] uppercase tracking-wider">Subtotal</span>
                <span className="font-semibold text-[#2C1810]">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span className="text-[10px] uppercase tracking-wider">
                    Privilege Discount ({appliedCoupon?.code})
                  </span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7A6B5D]">
                <span className="text-[10px] uppercase tracking-wider">Delivery</span>
                <span className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[10px]">
                  {shipping === 0 ? "Complimentary" : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#D4AF37]/15">
                <div>
                  <span
                    className="font-serif text-sm font-bold tracking-[0.1em] text-[#2C1810] uppercase block"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    Estimated Total
                  </span>
                  <span className="text-[7.5px] font-sans text-[#7A6B5D] tracking-wider uppercase">
                    All Taxes Included (18% GST)
                  </span>
                </div>
                <span className="font-serif text-lg md:text-xl font-bold text-[#2C1810]">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white h-12 font-sans font-bold text-[10px] tracking-[0.22em] uppercase transition-all duration-300 shadow-md rounded-none border border-[#D4AF37]/35 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
