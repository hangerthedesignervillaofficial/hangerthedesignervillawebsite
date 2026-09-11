"use client";

import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag, X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface WishlistDrawerProps {
  children: React.ReactElement;
}

export function WishlistDrawer({ children }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleMoveToCart = async (item: any) => {
    setMovingId(item.product_id);
    const success = await addToCart(item);
    if (success) {
      removeFromWishlist(item.product_id);
    }
    setMovingId(null);
  };

  const handleMoveAllToCart = async () => {
    for (const item of wishlistItems) {
      await addToCart(item);
      removeFromWishlist(item.product_id);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#D4AF37]/25 p-0 flex flex-col h-[100dvh] sm:h-full shadow-2xl z-[110] rounded-none select-none"
      >
        {/* Luxury Header - Clean layout with 0 overlap */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D4AF37]/20 bg-white/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/25">
              <Heart className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]/20 stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className="font-serif text-sm tracking-[0.2em] uppercase text-[#2C1810] font-bold"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Your Lookbook
                </span>
                <span className="font-sans text-[8px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 tracking-widest uppercase">
                  {totalWishlistItems} {totalWishlistItems === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <span className="font-sans text-[7.5px] tracking-[0.3em] text-[#7A6B5D] uppercase mt-0.5">
                Curated Haute Coutures
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810] hover:bg-[#2C1810]/5 transition-colors cursor-pointer"
            aria-label="Close lookbook"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 scrollbar-thin">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-[#7A6B5D] max-w-xs mx-auto py-20">
              <div className="w-20 h-20 border border-[#D4AF37]/25 flex items-center justify-center bg-white rounded-full shadow-sm relative group/icon">
                <div
                  className="absolute inset-1 border border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none"
                  style={{ animation: "spin 15s linear infinite" }}
                />
                <Heart className="h-7 w-7 text-[#D4AF37] stroke-[1.2] transition-transform duration-500 group-hover/icon:scale-110" />
              </div>
              <div className="space-y-2">
                <p
                  className="font-serif text-sm text-[#2C1810] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Lookbook is Vacant
                </p>
                <p className="font-sans text-[10px] text-[#7A6B5D]/80 leading-relaxed uppercase tracking-wider">
                  Browse our designer silhouettes and save your favourite looks for your private wardrobe.
                </p>
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 py-6 border border-[#D4AF37]/35 rounded-none shadow-md cursor-pointer"
              >
                Discover Boutique Edit
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                  className="flex gap-4 items-center border border-[#D4AF37]/15 bg-white p-3.5 relative group shadow-sm"
                >
                  {/* Image */}
                  <div className="h-24 w-18 md:h-28 md:w-22 rounded-none overflow-hidden bg-[#FDFBF7] border border-[#D4AF37]/15 flex-shrink-0 relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1596458514167-9359c25095d5?w=200"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 h-24 md:h-28">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[7.5px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase block">
                          Designer Couture
                        </span>
                        <button
                          onClick={() => removeFromWishlist(item.product_id)}
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
                      <span className="font-sans font-bold text-xs md:text-sm text-[#2C1810]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>

                      <button
                        disabled={movingId === item.product_id}
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[8.5px] font-bold tracking-[0.15em] uppercase transition-all duration-300 border border-[#D4AF37]/30 cursor-pointer shadow-sm rounded-none active:scale-95 disabled:opacity-50"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        <span>{movingId === item.product_id ? "Moving..." : "Move to Bag"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Compact Luxury Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-[#D4AF37]/20 bg-[#FFFDFC] p-4 md:p-5 shadow-[0_-10px_30px_rgba(44,24,16,0.05)] shrink-0 space-y-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              onClick={handleMoveAllToCart}
              className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white h-11 font-sans font-bold text-[9.5px] tracking-[0.2em] uppercase transition-all duration-300 border border-[#D4AF37]/35 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All Pieces to Bag</span>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-[#7A6B5D] hover:text-[#2C1810] font-sans font-bold text-[9px] tracking-[0.18em] uppercase transition-colors text-center cursor-pointer"
            >
              Continue Browsing Lookbook
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
