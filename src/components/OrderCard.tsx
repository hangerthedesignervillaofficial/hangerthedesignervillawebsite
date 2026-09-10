"use client";
import { OrderItemType, OrderType } from "@/types";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { submitOrderCancellation } from "@/app/actions/orderActions";
import { ChevronDown, Package, Clock, X } from "lucide-react";

interface OrderCardProps {
  order: OrderType;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  delivered:  { label: "Delivered",  color: "text-emerald-700 bg-emerald-50 border-emerald-200",  dot: "bg-emerald-500" },
  shipped:    { label: "Shipped",    color: "text-sky-700 bg-sky-50 border-sky-200",              dot: "bg-sky-500 animate-pulse" },
  dispatched: { label: "Dispatched", color: "text-indigo-700 bg-indigo-50 border-indigo-200",     dot: "bg-indigo-500 animate-pulse" },
  out_for_delivery: { label: "Out for Delivery", color: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200", dot: "bg-fuchsia-500 animate-pulse" },
  packed:     { label: "Packed",     color: "text-orange-700 bg-orange-50 border-orange-200",     dot: "bg-orange-500" },
  processing: { label: "Processing", color: "text-amber-700 bg-amber-50 border-amber-200",        dot: "bg-amber-500 animate-pulse" },
  cancelled:  { label: "Cancelled",  color: "text-red-600 bg-red-50 border-red-200",              dot: "bg-red-400" },
  pending:    { label: "Pending",    color: "text-[#7A6B5D] bg-[#F5F0EA] border-[#D4AF37]/20",   dot: "bg-[#D4AF37]/60" },
};

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const submitCancelRequest = async () => {
    if (cancelReason.trim() === "") {
      toast.error("Reason is required to request cancellation.");
      return;
    }

    setIsSubmittingCancel(true);
    try {
      const result = await submitOrderCancellation(order.id, cancelReason);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Cancellation request submitted successfully.");
      setShowCancelModal(false);
      // We should ideally update the local state to show 'Cancellation Requested' instantly
      // For now, it might require a reload unless we mutate the order prop (which is a bad practice)
      // We'll trust the parent component's realtime subscription to update it.
    } catch (error) {
      console.error("Error submitting cancellation request:", error);
      toast.error("Failed to submit cancellation request");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[#D4AF37]/20 bg-white hover:border-[#D4AF37]/40 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#D4AF37]/5"
    >
      {/* Card Header */}
      <div
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Order icon badge */}
          <div className="w-10 h-10 flex-shrink-0 border border-[#D4AF37]/20 bg-[#FDFBF7] flex items-center justify-center">
            <Package className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-[9px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-0.5">
              Atelier Order
            </p>
            <p
              className="font-serif text-[#2C1810] text-base tracking-wide truncate"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {order.display_id || `#${order.id}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Status badge */}
          <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold font-sans tracking-[0.15em] uppercase border ${statusCfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>

          {/* Date */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-sans text-[#7A6B5D]">
            <Clock className="w-3 h-3 stroke-[1.5]" />
            {order.created_at ? format(new Date(order.created_at), "dd MMM yyyy") : "—"}
          </div>

          {/* Total */}
          <p
            className="font-serif text-[#2C1810] text-lg"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            ₹{order.total?.toLocaleString("en-IN") ?? "—"}
          </p>

          {/* Chevron */}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-4 h-4 text-[#7A6B5D] stroke-[1.5]" />
          </motion.div>
        </div>
      </div>

      {/* Mobile status row */}
      <div className="sm:hidden px-5 pb-4 flex items-center justify-between">
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold font-sans tracking-[0.15em] uppercase border ${statusCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
        <span className="flex items-center gap-1.5 text-[9px] font-sans text-[#7A6B5D]">
          <Clock className="w-3 h-3 stroke-[1.5]" />
          {order.created_at ? format(new Date(order.created_at), "dd MMM yyyy") : "—"}
        </span>
      </div>

      {/* Expandable Items Section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#D4AF37]/10 px-5 md:px-6 py-5 space-y-5">

              {/* Items list */}
              <div className="space-y-3">
                {order.order_items?.map((item: OrderItemType) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-[#D4AF37]/10 last:border-b-0"
                  >
                    {item.product?.image ? (
                      <div className="w-14 h-14 flex-shrink-0 border border-[#D4AF37]/15 overflow-hidden bg-[#F5F0EA]">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex-shrink-0 border border-[#D4AF37]/15 bg-[#F5F0EA] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#D4AF37]/40 stroke-[1.5]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[12px] font-semibold text-[#2C1810] truncate">
                        {item.product?.title || "Artisan Piece"}
                      </p>
                      <p className="font-sans text-[10px] text-[#7A6B5D] mt-0.5">
                        Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="font-sans text-[12px] font-bold text-[#2C1810] flex-shrink-0">
                      ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer: total + delete */}
              <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">
                    Order Total
                  </span>
                  <span
                    className="font-serif text-xl text-[#2C1810]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    ₹{order.total?.toLocaleString("en-IN") ?? "—"}
                  </span>
                </div>

                {order.status !== "cancelled" && order.status !== "delivered" && order.cancellation_status !== "requested" && order.cancellation_status !== "approved" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#4A0E17]/20 text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white font-sans text-[9px] font-bold tracking-[0.15em] uppercase transition-all cursor-pointer"
                  >
                    Request Cancellation
                  </button>
                )}

                {order.cancellation_status === "requested" && (
                  <span className="font-sans text-[9px] font-bold tracking-[0.15em] uppercase text-[#B89030]">
                    Cancellation Requested
                  </span>
                )}
                {order.cancellation_status === "rejected" && (
                  <span className="font-sans text-[9px] font-bold tracking-[0.15em] uppercase text-[#4A0E17]">
                    Cancellation Rejected
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A1A] p-8 shadow-2xl z-50 border border-[#D4AF37]/30 flex flex-col"
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute top-4 right-4 text-[#F9F6F1]/50 hover:text-[#D4AF37] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-serif text-2xl text-[#F9F6F1] mb-2" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>Cancel Order</h3>
              <p className="font-sans text-xs text-[#F9F6F1]/70 mb-6 uppercase tracking-widest">Order {order.display_id || `#${order.id}`}</p>
              
              <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] mb-2">Reason for Cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you are cancelling..."
                className="w-full bg-[#2C1810]/40 border border-[#D4AF37]/30 text-[#F9F6F1] p-4 text-sm font-sans focus:outline-none focus:border-[#D4AF37] resize-none h-32 mb-6"
              />
              
              <div className="flex justify-end gap-4 mt-auto">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-6 py-3 font-sans text-[10px] font-bold tracking-widest uppercase text-[#F9F6F1]/70 hover:text-[#F9F6F1] transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={submitCancelRequest}
                  disabled={isSubmittingCancel}
                  className="px-6 py-3 bg-[#D4AF37] text-[#1A1A1A] font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-[#B89030] transition-colors disabled:opacity-50"
                >
                  {isSubmittingCancel ? "Submitting..." : "Confirm Cancellation"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
