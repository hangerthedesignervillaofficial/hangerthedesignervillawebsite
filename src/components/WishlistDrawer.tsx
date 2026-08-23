"use client";

import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistDrawerProps {
  children: React.ReactElement;
}

export function WishlistDrawer({ children }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  const handleMoveToCart = async (item: any) => {
    const success = await addToCart(item);
    if (success) {
      removeFromWishlist(item.product_id);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#D4AF37]/25 p-0 flex flex-col h-[100dvh] sm:h-full shadow-2xl z-[85] rounded-none">
        {/* Header */}
        <SheetHeader className="p-5 md:p-6 border-b border-[#D4AF37]/15 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <SheetTitle className="font-serif text-base md:text-lg font-normal tracking-[0.2em] text-[#2C1810] flex items-center justify-between uppercase">
            <span className="flex items-center gap-2.5">
              <Heart className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]/10 stroke-[1.5]" />
              <span>Your Lookbook</span>
            </span>
            <span className="font-sans text-[9px] font-bold text-[#7A6B5D] bg-[#F0E6D8]/50 border border-[#D4AF37]/20 px-3 py-1 tracking-widest rounded-full uppercase">
              {totalWishlistItems} {totalWishlistItems === 1 ? 'Piece' : 'Pieces'}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-[#7A6B5D] max-w-xs mx-auto py-20">
              <div className="w-20 h-20 border border-[#D4AF37]/25 flex items-center justify-center bg-white rounded-full shadow-sm relative group/icon">
                {/* Slow spinning dashed accent line */}
                <div 
                  className="absolute inset-1 border border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none" 
                  style={{ animation: "spin 15s linear infinite" }}
                />
                <Heart className="h-7 w-7 text-[#D4AF37] stroke-[1.2] transition-transform duration-500 group-hover/icon:scale-110" />
              </div>
              <div className="space-y-2">
                <p className="font-serif text-sm text-[#2C1810] tracking-[0.2em] uppercase">LOOKBOOK VACANT</p>
                <p className="font-sans text-[10px] text-[#7A6B5D]/80 leading-relaxed uppercase tracking-wider">
                  Browse our designer silhouettes and select pieces you wish to save for your personal collection.
                </p>
              </div>
              <Button 
                onClick={() => setOpen(false)}
                className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 py-6 border border-[#D4AF37]/35 rounded-none shadow-md shadow-[#2C1810]/5 hover:-translate-y-0.5 active:translate-y-0"
              >
                Discover arrivals
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
                  className="flex gap-4 md:gap-5 items-center border-b border-[#D4AF37]/10 pb-5 group relative"
                >
                  {/* Thumbnail Image Container */}
                  <div className="h-24 w-18 md:h-28 md:w-22 rounded-none overflow-hidden bg-gray-50 border border-[#D4AF37]/15 flex-shrink-0 relative group/thumb shadow-sm">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/thumb:scale-108"
                      style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1596458514167-9359c25095d5?w=200'})` }}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col h-24 md:h-28 justify-between min-w-0 py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-1">
                          Designer Silhouette
                        </span>
                        <h4 className="font-serif font-medium text-[#2C1810] tracking-wide text-[11px] md:text-xs line-clamp-1 group-hover:text-[#4A0E17] transition-colors">{item.title}</h4>
                        <p className="font-sans text-[9px] md:text-[10px] text-[#7A6B5D] mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="text-[#7A6B5D]/40 hover:text-red-700 hover:scale-110 hover:bg-red-50/50 p-1.5 rounded-full transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <span className="font-sans font-semibold text-xs md:text-sm text-[#2C1810]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      
                      <button 
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[8.5px] md:text-[9.5px] font-bold tracking-[0.15em] uppercase transition-all duration-300 border border-[#D4AF37]/30 cursor-pointer shadow-sm rounded-none active:scale-95"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        Move to Bag
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-[#D4AF37]/15 bg-white p-5 md:p-6 sticky bottom-0 z-20 pb-20 sm:pb-6">
            <Button 
              onClick={() => setOpen(false)}
              className="w-full bg-[#2C1810] text-[#D4AF37] hover:text-white hover:bg-[#4A0E17] h-12 md:h-14 font-sans font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/35 transition-all duration-350 hover:tracking-[0.22em] shadow-lg rounded-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
