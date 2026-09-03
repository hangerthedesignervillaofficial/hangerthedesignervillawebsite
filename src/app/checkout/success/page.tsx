"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, Package, MapPin, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface OrderDetails {
  id: number;
  total: number;
  status: string;
  created_at: string;
  shipping_address: any;
  items: Array<{
    quantity: number;
    price_at_time: number;
    selected_size: string | null;
    product: {
      title: string;
      image: string;
    }
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("checkout_id");
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!checkoutId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error: _error } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            shipping_address,
            items:order_items(
              quantity,
              price_at_time,
              selected_size,
              product:products(title, image)
            )
          `)
          .eq('id', checkoutId)
          .single();

        if (data) {
          // Normalize array return from Supabase
          const normalizedItems = (data.items || []).map((item: any) => ({
            ...item,
            product: Array.isArray(item.product) ? item.product[0] : item.product
          }));
          setOrder({ ...data, items: normalizedItems });
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [checkoutId]);

  if (isLoading) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="border border-[#D4AF37]/25 bg-white/70 backdrop-blur-md p-8 md:p-10 relative overflow-hidden shadow-xl shadow-[#D4AF37]/5">
            <div className="absolute inset-2.5 border border-[#D4AF37]/10 pointer-events-none" />
            <div className="relative z-10 py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 mx-auto mb-6 flex items-center justify-center"
              >
                <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin stroke-[1.2]" />
              </motion.div>
              <h2
                className="font-serif text-lg text-[#2C1810] tracking-[0.15em] uppercase mb-3"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Securing Your Order
              </h2>
              <p className="font-sans text-[10px] text-[#7A6B5D] leading-relaxed uppercase tracking-wider">
                Confirming receipt from the atelier...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full"
      >
        <div className="bg-[#FFFDFC] border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Thank you message & Summary */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D4AF37]/15 relative bg-[#FDFBF7]">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-br-full pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
                className="w-16 h-16 bg-[#FFFDFC] border border-[#D4AF37]/30 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="h-8 w-8 text-[#D4AF37] stroke-[1.5]" />
              </motion.div>

              <div>
                <h1 className="font-serif text-3xl md:text-4xl text-[#2C1810] mb-3 tracking-wide" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                  Order Confirmed
                </h1>
                <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed uppercase tracking-widest">
                  Thank you for choosing Hanger. Your luxury pieces are being prepared by our master tailors.
                </p>
              </div>

              {order && (
                <div className="space-y-4 pt-6 border-t border-[#D4AF37]/15">
                  <div className="flex items-start gap-3">
                    <Package className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">Order ID</p>
                      <p className="font-serif text-sm text-[#2C1810] tracking-wide">#{order.id}</p>
                    </div>
                  </div>
                  {order.shipping_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">Delivery To</p>
                        <p className="font-sans text-[11px] text-[#2C1810] line-clamp-2 leading-tight mt-1">
                          {order.shipping_address.name}<br/>
                          {order.shipping_address.street}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">Total Paid</p>
                      <p className="font-serif text-lg text-[#2C1810] font-bold mt-0.5">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-3">
              <button
                onClick={() => router.push("/")}
                className="w-full py-4 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                Continue Shopping <ArrowRight className="h-3 w-3 stroke-[2]" />
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="w-full py-4 border border-[#D4AF37]/30 text-[#2C1810] hover:border-[#D4AF37] hover:text-[#4A0E17] font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all active:scale-95 bg-transparent"
              >
                View My Orders
              </button>
            </div>
          </div>

          {/* Right Column: Ordered Items */}
          <div className="md:w-1/2 p-8 md:p-12 bg-white">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2C1810] font-bold mb-6 border-b border-[#D4AF37]/15 pb-4">
              Your Atelier Selection
            </h3>
            
            {!order ? (
              <p className="text-[#7A6B5D] text-[11px] uppercase tracking-widest">Loading selection...</p>
            ) : (
              <div className="space-y-6 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                {order.items.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex gap-5 items-center group"
                  >
                    <div className="relative w-20 h-28 bg-[#f4f0ea] border border-[#D4AF37]/15 shrink-0 overflow-hidden">
                      {item.product?.image ? (
                        <Image src={item.product.image} alt={item.product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#7A6B5D]/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-sm text-[#2C1810] line-clamp-2 leading-snug">{item.product?.title || 'Exclusive Item'}</h4>
                      <div className="flex flex-col gap-1 mt-2 font-sans text-[9px] text-[#7A6B5D] tracking-widest uppercase font-semibold">
                        {item.selected_size && <span>Size: {item.selected_size}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="font-sans text-xs font-bold text-[#2C1810] mt-3">
                        ₹{(item.price_at_time * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-[#D4AF37]/15 text-center">
              <p className="font-serif italic text-xs text-[#7A6B5D]">
                "An email receipt has been sent to your registered address."
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin stroke-[1.2]" />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
