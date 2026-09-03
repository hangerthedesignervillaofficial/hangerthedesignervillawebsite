"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ShoppingCart, Package, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Image from "next/image";

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarts();
  }, []);

  async function fetchCarts() {
    try {
      const { data, error: _error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (data) setCarts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate cart total
  const getCartTotal = (cartData: any[]) => {
    return cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Abandoned Carts</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Track visitors who added items to their cart but did not complete checkout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : carts.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-[#D4AF37]/20 bg-white shadow-sm">
            <ShoppingCart className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-4" />
            <p className="font-sans text-sm text-[#7A6B5D]">No abandoned carts found.</p>
          </div>
        ) : (
          carts.map((cart) => {
            const items = cart.cart_data || [];
            if (items.length === 0) return null; // Skip empty carts
            
            return (
              <div key={cart.id} className="bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-5 border-b border-[#D4AF37]/15 bg-[#FDFBF7]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                      {formatDistanceToNow(new Date(cart.updated_at), { addSuffix: true })}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#2C1810]">
                      ₹{getCartTotal(items).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {cart.email || cart.phone ? (
                    <div className="flex flex-col gap-1 text-[#2C1810]">
                      {cart.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-[#7A6B5D]" />
                          <span className="font-sans text-xs font-semibold">{cart.email}</span>
                        </div>
                      )}
                      {cart.phone && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7A6B5D]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span className="font-sans text-xs font-semibold">{cart.phone}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#7A6B5D] italic">Anonymous Visitor (Session: {cart.session_id.substring(0,8)})</div>
                  )}
                </div>
                
                {/* Items */}
                <div className="p-5 flex-1 bg-white space-y-4">
                  <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold mb-3 border-b border-[#D4AF37]/10 pb-2">
                    {items.length} Items Left Behind
                  </h4>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="relative w-12 h-16 bg-[#f4f0ea] border border-[#D4AF37]/15 shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Package className="w-4 h-4 text-[#7A6B5D]/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-[11px] text-[#2C1810] line-clamp-2 leading-snug">{item.title}</p>
                          <div className="flex justify-between mt-1">
                            <span className="font-sans text-[9px] text-[#7A6B5D] tracking-widest uppercase">
                              Qty: {item.quantity} {item.selected_size ? `| Size: ${item.selected_size}` : ''}
                            </span>
                            <span className="font-sans text-[10px] font-bold text-[#2C1810]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                {cart.email && (
                  <div className="p-4 border-t border-[#D4AF37]/15 bg-[#FDFBF7]">
                    <a 
                      href={`mailto:${cart.email}?subject=Did you leave something behind?&body=Hi there,%0D%0A%0D%0AWe noticed you left some items in your cart at Hanger. Can we help you complete your purchase?`}
                      className="block w-full py-3 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-all shadow-md text-center"
                    >
                      Send Reminder Email
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
