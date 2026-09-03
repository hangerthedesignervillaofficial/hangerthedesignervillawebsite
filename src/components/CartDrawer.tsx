"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, Trash2, Tag, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";

interface CartDrawerProps {
  children: React.ReactElement;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const router = useRouter();
  const { cartItems, totalItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  // Constants aligned with CartShoppingPage
  const shippingThreshold = 999;
  const shippingCost = 99;
  const qualifiesForFreeShipping = subtotal >= shippingThreshold;
  const shipping = qualifiesForFreeShipping ? 0 : (subtotal > 0 ? shippingCost : 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#D4AF37]/20 p-0 flex flex-col h-[100dvh] sm:h-full shadow-2xl z-[85] rounded-none">
        <SheetHeader className="p-5 md:p-6 border-b border-[#D4AF37]/15 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <SheetTitle className="font-serif text-base md:text-lg font-normal tracking-[0.2em] text-[#2C1810] flex items-center justify-between uppercase">
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-[#D4AF37] stroke-[1.5]" />
              <span>Your Selection</span>
            </span>
            <span className="font-sans text-[9px] font-bold text-[#7A6B5D] bg-[#F0E6D8]/50 border border-[#D4AF37]/20 px-3 py-1 tracking-widest rounded-full uppercase">
              {totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-[#7A6B5D] max-w-xs mx-auto py-20">
              <div className="w-20 h-20 border border-[#D4AF37]/25 flex items-center justify-center bg-white rounded-full shadow-sm relative group/icon">
                <div 
                  className="absolute inset-1 border border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none" 
                  style={{ animation: "spin 15s linear infinite" }}
                />
                <ShoppingBag className="h-7 w-7 text-[#D4AF37] stroke-[1.2] transition-transform duration-500 group-hover/icon:scale-110" />
              </div>
              <div className="space-y-2">
                <p className="font-serif text-sm text-[#2C1810] tracking-[0.2em] uppercase">Bag is vacant</p>
                <p className="font-sans text-[10px] text-[#7A6B5D]/80 leading-relaxed uppercase tracking-wider">
                  Explore our designer collections and select pieces to add to your private wardrobe.
                </p>
              </div>
              <Button 
                onClick={() => setOpen(false)}
                className="w-full bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 py-6 border border-[#D4AF37]/35 rounded-none shadow-md shadow-[#2C1810]/5 hover:-translate-y-0.5"
              >
                Discover Arrivals
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
                  className="flex gap-4 md:gap-5 items-center border-b border-[#D4AF37]/10 pb-5 group relative"
                >
                  {/* Thumbnail Image Container */}
                  <div className="h-28 w-20 md:h-32 md:w-24 rounded-none overflow-hidden bg-gray-50 border border-[#D4AF37]/15 flex-shrink-0 relative group/thumb shadow-sm">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/thumb:scale-108"
                      style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1596458514167-9359c25095d5?w=200'})` }}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col h-28 md:h-32 justify-between min-w-0 py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-[7.5px] md:text-[8px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-0.5 md:mb-1">
                          Designer Silhouette
                        </span>
                        <h4 className="font-serif font-medium text-[#2C1810] tracking-wide text-[12px] md:text-[13px] line-clamp-1 group-hover:text-[#4A0E17] transition-colors leading-tight">{item.title}</h4>
                        <p className="font-sans text-[10px] md:text-[11px] text-[#7A6B5D] mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-[#7A6B5D]/40 hover:text-[#4A0E17] hover:scale-110 active:scale-95 p-1.5 rounded-full transition-all cursor-pointer bg-[#FDFBF7]"
                        title="Remove piece"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <div className="flex items-center border border-[#D4AF37]/35 rounded-none bg-white p-[1px]">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-[#7A6B5D] hover:text-[#4A0E17] hover:bg-[#F0E6D8]/40 transition-colors cursor-pointer text-xs"
                          onClick={() => updateQuantity(item.product_id, -1)}
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="font-sans text-[10px] font-bold w-6 text-center text-[#2C1810]">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-[#7A6B5D] hover:text-[#4A0E17] hover:bg-[#F0E6D8]/40 transition-colors cursor-pointer text-xs"
                          onClick={() => updateQuantity(item.product_id, 1)}
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
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#D4AF37]/15 bg-white p-5 md:p-6 space-y-4 pb-20 sm:pb-6">
            
            {/* Free Shipping tracker */}
            <div className="pb-3 border-b border-[#D4AF37]/10">
              <div className="flex items-center justify-between text-[8px] md:text-[9px] font-sans font-bold tracking-widest text-[#7A6B5D] mb-1.5 uppercase">
                <span>Shipping Privilege</span>
                {qualifiesForFreeShipping ? (
                  <span className="text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">Qualified</span>
                ) : (
                  <span className="text-[#D4AF37]">{formatCurrency(shippingThreshold - subtotal)} away</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-[#D4AF37]/10 overflow-hidden relative rounded-none">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C59B27]"
                />
              </div>
            </div>

            {/* Promo Code Toggle */}
            <div className="border border-[#D4AF37]/20 bg-[#FFFCF7] p-1 overflow-hidden transition-all rounded-none">
              <button 
                onClick={() => setShowPromo(!showPromo)}
                className="w-full flex items-center justify-between p-1.5 md:p-2 text-[9px] font-bold tracking-[0.18em] text-[#2C1810] uppercase cursor-pointer hover:text-[#4A0E17] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#D4AF37] stroke-[1.5]" />
                  Have a Promo Code?
                </div>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform text-[#7A6B5D] ${showPromo ? 'rotate-90' : ''}`} />
              </button>
              {showPromo && (
                <div className="p-2 flex gap-2 animate-in slide-in-from-top-2 duration-300">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 border border-[#D4AF37]/25 bg-white text-xs px-3 py-2 focus:outline-none focus:border-[#D4AF37] rounded-none font-sans uppercase tracking-widest placeholder:text-[#7A6B5D]/40" 
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-[#D4AF37] text-[#2C1810] hover:bg-[#2C1810] hover:text-[#D4AF37] rounded-none font-sans text-[9px] tracking-widest uppercase font-bold"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 font-sans text-[11px] md:text-xs text-[#7A6B5D]">
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">Subtotal</span>
                <span className="font-semibold text-[#2C1810]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">Estimated Tax (18%)</span>
                <span className="font-semibold text-[#2C1810]">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">Delivery</span>
                <span className="font-semibold text-[#2C1810] uppercase tracking-wider">
                  {shipping === 0 ? "Complimentary" : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#D4AF37]/15 font-serif font-medium text-base text-[#2C1810]">
                <span className="uppercase tracking-[0.1em]">Total</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              className="w-full bg-[#2C1810] text-[#D4AF37] hover:text-white hover:bg-[#4A0E17] h-12 md:h-14 font-sans font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/35 transition-all duration-350 hover:tracking-[0.22em] shadow-lg rounded-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
