"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { orderService } from "@/services/order/orderService";
import { addressService } from "@/services/address/addressService";
import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

export function CheckoutClient() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Calculate totals
  const shippingCost = subtotal >= 999 ? 0 : (subtotal > 0 ? 99 : 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sync phone number to abandoned cart
  useEffect(() => {
    if (!formData.phone) return;
    
    const sessionId = localStorage.getItem("hanger_session_id");
    if (!sessionId) return;
    
    const timeoutId = setTimeout(() => {
      supabase.from('abandoned_carts')
        .update({ phone: formData.phone })
        .eq('session_id', sessionId)
        .then(() => {});
    }, 1500); // 1.5s debounce
    
    return () => clearTimeout(timeoutId);
  }, [formData.phone]);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Please fill in all shipping details");
      return false;
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    handlePaymentSuccess(`cod_payment_${Date.now()}`);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsProcessing(true);

    try {
      // Save the shipping address to Supabase to obtain a valid DB ID
      const savedAddress = await addressService.saveAddress({
        userId: user?.id || null as any,
        address: {
          street: formData.address,
          city: formData.city,
          state: "",
          zip_code: formData.postalCode,
          country: formData.country,
          is_default: true,
        } as any,
      });

      if (!savedAddress) {
        throw new Error("Failed to save shipping address");
      }

      const order = await orderService.createOrder({
        userId: user?.id || null as any,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: savedAddress as any,
        totalAmount: total,
        paymentIntentId,
      });

      await orderService.updateOrderStatus(order.id.toString(), "processing");
      await clearCart();
      
      // If guest user, store the order ID in localStorage to allow them to track it later
      if (!user) {
        try {
          const storedGuestOrders = localStorage.getItem("hanger_guest_orders");
          const guestOrders = storedGuestOrders ? JSON.parse(storedGuestOrders) : [];
          if (!guestOrders.includes(order.id)) {
            guestOrders.push(order.id);
            localStorage.setItem("hanger_guest_orders", JSON.stringify(guestOrders));
          }
        } catch (e) {
          console.error("Failed to save guest order to localStorage", e);
        }
      }
      
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?checkout_id=${order.id}`);

    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Payment successful but failed to create order. Please contact support.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-5 border border-[#D4AF37]/20 flex items-center justify-center">
            <ShoppingBag className="h-7 w-7 text-[#D4AF37]/40 stroke-[1.5]" />
          </div>
          <h2
            className="font-serif text-xl text-[#2C1810] tracking-wide mb-2"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Your Bag is Empty
          </h2>
          <p className="font-sans text-[11px] text-[#7A6B5D] mb-6">
            Add items to your bag before checking out.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all hover:from-[#4A0E17] hover:to-[#6B1A24]"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-[1px] bg-[#D4AF37]" />
            <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Secure Checkout
            </span>
          </div>
          <h1
            className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-[#2C1810]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-[#D4AF37]/20 bg-[#FDFBF7]"
            >
              <div className="p-6 md:p-8 border-b border-[#D4AF37]/10">
                <h2
                  className="font-serif text-lg text-[#2C1810] tracking-wide"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Shipping Details
                </h2>
              </div>
              <form id="checkout-form" onSubmit={handleProceedToPayment} className="p-6 md:p-8 space-y-6">

                {/* Contact section */}
                <div>
                  <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#D4AF37]/50" /> Contact
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative pt-4">
                      <input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder=" "
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                      />
                      <label 
                        htmlFor="firstName"
                        className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                      >
                        First Name <span className="text-[#D4AF37]">&bull;</span>
                      </label>
                    </div>
                    <div className="relative pt-4">
                      <input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder=" "
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                      />
                      <label 
                        htmlFor="lastName"
                        className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                      >
                        Last Name <span className="text-[#D4AF37]">&bull;</span>
                      </label>
                    </div>
                  </div>
                    <div className="relative pt-4">
                      <div className="flex items-center border-b border-[#D4AF37]/25 focus-within:border-[#D4AF37] transition-colors h-10">
                        <span className="font-sans text-sm text-[#7A6B5D] pr-2 border-r border-[#D4AF37]/20 mr-3 select-none">+91</span>
                        <input
                          id="phone"
                          name="phone"
                          required
                          type="tel"
                          maxLength={10}
                          placeholder=" "
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="peer flex-1 bg-transparent outline-none font-sans text-sm text-[#2C1810]"
                        />
                        <label 
                          htmlFor="phone" 
                          className="absolute left-10 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                        >
                          Phone Number <span className="text-[#D4AF37]">&bull;</span>
                        </label>
                      </div>
                    </div>
                </div>

                {/* Delivery section */}
                <div>
                  <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#D4AF37]/50" /> Delivery Address
                  </p>
                  <div className="space-y-4">
                    <div className="relative pt-4">
                      <input
                        id="address"
                        name="address"
                        required
                        placeholder=" "
                        value={formData.address}
                        onChange={handleInputChange}
                        className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                      />
                      <label 
                        htmlFor="address"
                        className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                      >
                        Street / Flat / Building <span className="text-[#D4AF37]">&bull;</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative pt-4">
                        <input
                          id="city"
                          name="city"
                          required
                          placeholder=" "
                          value={formData.city}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                        />
                        <label 
                          htmlFor="city"
                          className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                        >
                          City <span className="text-[#D4AF37]">&bull;</span>
                        </label>
                      </div>
                      <div className="relative pt-4">
                        <input
                          id="state"
                          name="state"
                          placeholder=" "
                          value={formData.state}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                        />
                        <label 
                          htmlFor="state"
                          className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                        >
                          State
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative pt-4">
                        <input
                          id="postalCode"
                          name="postalCode"
                          required
                          type="number"
                          maxLength={6}
                          placeholder=" "
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none h-10 font-sans text-sm text-[#2C1810] transition-colors"
                        />
                        <label 
                          htmlFor="postalCode"
                          className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-0 peer-focus:text-[10px] md:peer-focus:text-xs peer-focus:text-[#D4AF37] pointer-events-none"
                        >
                          PIN Code <span className="text-[#D4AF37]">&bull;</span>
                        </label>
                      </div>
                      <div className="relative pt-4">
                        <input
                          id="country"
                          name="country"
                          disabled
                          placeholder=" "
                          value="India 🇮🇳"
                          className="peer w-full bg-transparent border-b border-[#D4AF37]/10 outline-none h-10 font-sans text-sm text-[#7A6B5D]/50 cursor-not-allowed"
                        />
                        <label 
                          htmlFor="country"
                          className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-[10px] peer-placeholder-shown:top-0 pointer-events-none"
                        >
                          Country
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="sticky top-24 border border-[#D4AF37]/25 bg-[#FDFBF7] shadow-lg shadow-[#D4AF37]/5"
            >
              <div className="p-6 md:p-8 border-b border-[#D4AF37]/10">
                <h2
                  className="font-serif text-lg text-[#2C1810] tracking-wide"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Order Summary
                </h2>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                {/* Cart items list */}
                <div className="max-h-52 overflow-y-auto pr-2 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-12 h-12 flex-shrink-0 border border-[#D4AF37]/10 overflow-hidden bg-[#f4f0ea]">
                          <Image src={item.image} alt={item.title} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[11px] font-semibold text-[#2C1810] truncate">{item.title}</p>
                        <p className="font-sans text-[9px] text-[#7A6B5D]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-sans text-[11px] font-bold text-[#2C1810] flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="w-full h-[1px] bg-[#D4AF37]/15" />

                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="font-sans text-[11px] text-[#7A6B5D]">Subtotal</span>
                    <span className="font-sans text-[11px] font-semibold text-[#2C1810]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-[11px] text-[#7A6B5D]">Shipping</span>
                    <span className="font-sans text-[11px] font-semibold text-[#D4AF37]">
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-[11px] text-[#7A6B5D]">GST (18%)</span>
                    <span className="font-sans text-[11px] font-semibold text-[#2C1810]">₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-[#D4AF37]/20" />

                <div className="flex justify-between items-center pt-1">
                  <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-[#2C1810] uppercase">Total</span>
                  <span
                    className="font-serif text-xl font-normal text-[#2C1810]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all hover:from-[#4A0E17] hover:to-[#6B1A24] hover:shadow-lg hover:shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-3 w-3 stroke-[2]" />
                  {isProcessing ? "PROCESSING..." : "PLACE ORDER (CASH ON DELIVERY)"}
                </button>

                <p className="text-center font-sans text-[8px] text-[#7A6B5D]/60 tracking-wide">
                  Pay with cash when your order arrives
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
