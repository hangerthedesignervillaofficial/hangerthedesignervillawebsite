"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { couponService, Coupon } from "@/services/coupon/couponService";

import { DrawerHeader } from "@/components/cart/DrawerHeader";
import { ComplimentaryDeliveryBar } from "@/components/cart/ComplimentaryDeliveryBar";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { BoutiquePrivileges } from "@/components/cart/BoutiquePrivileges";
import { OrderSummaryFooter } from "@/components/cart/OrderSummaryFooter";
import { EmptyDrawerState } from "@/components/cart/EmptyDrawerState";

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
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  // Delivery & Tax Calculation
  const shippingThreshold = 999;
  const shippingCost = 99;
  const qualifiesForFreeShipping = subtotal >= shippingThreshold;
  const shipping = qualifiesForFreeShipping ? 0 : subtotal > 0 ? shippingCost : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.18;
  const total = discountedSubtotal + tax + shipping;

  // Load available active coupons for 1-click privilege chips
  useEffect(() => {
    couponService.getCoupons().then((list) => {
      setAvailableCoupons(list.filter((c) => c.isActive));
    });
  }, []);

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent
        showCloseButton={false}
        className="w-[94vw] max-w-[94vw] sm:w-[460px] sm:max-w-[460px] data-[side=right]:w-[94vw] sm:data-[side=right]:w-[460px] sm:data-[side=right]:max-w-[460px] data-[side=right]:sm:max-w-[460px] bg-[#FBF9F4] border-l border-[#E7DDC9] p-0 gap-0 flex flex-col h-[100dvh] shadow-2xl z-[110] rounded-none select-none"
      >
        {/* Editorial Luxury Header */}
        <DrawerHeader
          title="Your Selection"
          subtitle="Hanger Curated Boutique"
          itemCount={totalItems}
          type="cart"
          onClose={() => setOpen(false)}
        />

        {/* Scrollable Wardrobe Area */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 space-y-6 scrollbar-thin">
          {cartItems.length === 0 ? (
            <EmptyDrawerState
              type="cart"
              onAction={() => setOpen(false)}
            />
          ) : (
            <>
              {/* Complimentary White-Glove Delivery Tracker */}
              <ComplimentaryDeliveryBar
                subtotal={subtotal}
                threshold={shippingThreshold}
              />

              {/* Items List */}
              <div className="space-y-0">
                <AnimatePresence initial={false}>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.product_id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
                    >
                      <CartItemRow
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Boutique Privileges Section */}
              <BoutiquePrivileges
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
                subtotal={subtotal}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                availableCoupons={availableCoupons}
              />
            </>
          )}
        </div>

        {/* Sticky Luxury Order Summary & Checkout */}
        {cartItems.length > 0 && (
          <OrderSummaryFooter
            subtotal={subtotal}
            discountAmount={discountAmount}
            appliedCoupon={appliedCoupon}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
