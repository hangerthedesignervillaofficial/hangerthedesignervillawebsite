"use client";

import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DrawerHeader } from "@/components/cart/DrawerHeader";
import { WishlistItemRow } from "@/components/cart/WishlistItemRow";
import { EmptyDrawerState } from "@/components/cart/EmptyDrawerState";
import { ProductType } from "@/types";

interface WishlistDrawerProps {
  children: React.ReactElement;
}

export function WishlistDrawer({ children }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isMovingAll, setIsMovingAll] = useState(false);

  const handleMoveToCart = async (item: ProductType) => {
    setMovingId(item.product_id);
    const success = await addToCart(item);
    if (success) {
      removeFromWishlist(item.product_id);
    }
    setMovingId(null);
  };

  const handleMoveAllToCart = async () => {
    setIsMovingAll(true);
    for (const item of wishlistItems) {
      await addToCart(item);
      removeFromWishlist(item.product_id);
    }
    setIsMovingAll(false);
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
          title="Your Lookbook"
          subtitle="Curated Haute Coutures"
          itemCount={totalWishlistItems}
          type="wishlist"
          onClose={() => setOpen(false)}
        />

        {/* Scrollable Lookbook Items Area */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 space-y-4 scrollbar-thin">
          {wishlistItems.length === 0 ? (
            <EmptyDrawerState
              type="wishlist"
              onAction={() => setOpen(false)}
            />
          ) : (
            <div className="space-y-0">
              <AnimatePresence initial={false}>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
                  >
                    <WishlistItemRow
                      item={item}
                      onMoveToCart={handleMoveToCart}
                      onRemove={removeFromWishlist}
                      isMoving={movingId === item.product_id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sticky Luxury Actions Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-[#E7DDC9] bg-[#FBF9F4] p-5 md:p-6 shadow-[0_-8px_30px_rgba(40,23,19,0.04)] shrink-0 space-y-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              disabled={isMovingAll}
              onClick={handleMoveAllToCart}
              className="w-full h-12 bg-[#281713] hover:bg-[#1a0f0d] text-[#FBF9F4] font-sans text-[9px] sm:text-[9.5px] font-semibold tracking-[0.24em] uppercase transition-all duration-300 border border-[#281713] hover:border-[#B99A45] cursor-pointer rounded-none flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#B99A45]" strokeWidth={1.25} />
              <span>{isMovingAll ? "Moving All Pieces..." : "Move All Pieces to Bag"}</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2 text-[#82756D] hover:text-[#281713] font-sans text-[8.5px] font-medium tracking-[0.22em] uppercase transition-colors text-center cursor-pointer"
            >
              Continue Browsing Lookbook
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
