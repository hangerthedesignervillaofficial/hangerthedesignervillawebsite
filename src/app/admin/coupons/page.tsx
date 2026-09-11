"use client";

import { useState, useEffect } from "react";
import { couponService, Coupon } from "@/services/coupon/couponService";
import { toast } from "sonner";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  Percent,
  IndianRupee,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowUpDown,
  RefreshCcw,
  Clock,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    minOrderValue: 1999,
    maxDiscountAmount: 1000,
    validUntil: "2027-12-31",
    usageLimit: 500,
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    try {
      const data = await couponService.getCoupons();
      setCoupons(data);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 1999,
      maxDiscountAmount: 1000,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usageLimit: 500,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(coupon: Coupon) {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      validUntil: coupon.validUntil ? coupon.validUntil.split("T")[0] : "",
      usageLimit: coupon.usageLimit || 0,
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (formData.discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    setSaving(true);
    try {
      const res = await couponService.saveCoupon(
        {
          code: formData.code.trim().toUpperCase(),
          description: formData.description,
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderValue: Number(formData.minOrderValue) || 0,
          maxDiscountAmount:
            formData.discountType === "percentage" && formData.maxDiscountAmount
              ? Number(formData.maxDiscountAmount)
              : undefined,
          validUntil: formData.validUntil,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
          isActive: formData.isActive,
        },
        editingCoupon?.id
      );

      if (res.success) {
        toast.success(editingCoupon ? "Coupon updated successfully" : "Coupon created successfully");
        setIsModalOpen(false);
        loadCoupons();
      } else {
        toast.error(res.error || "Failed to save coupon");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    const ok = await couponService.deleteCoupon(id);
    if (ok) {
      toast.success(`Coupon "${code}" deleted`);
      loadCoupons();
    } else {
      toast.error("Failed to delete coupon");
    }
  }

  async function handleToggleStatus(id: string) {
    const ok = await couponService.toggleCouponStatus(id);
    if (ok) {
      toast.success("Coupon status updated");
      loadCoupons();
    } else {
      toast.error("Failed to update coupon status");
    }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen text-[#2C1810]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Privilege Rewards & Promotions
            </span>
          </div>
          <h1
            className="font-serif text-2xl md:text-3xl text-[#2C1810] tracking-wide uppercase"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Coupons & Discounts
          </h1>
          <p className="font-sans text-xs text-[#7A6B5D] mt-1">
            Configure boutique promo codes, order value thresholds, and customer privilege discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCoupons}
            className="p-2.5 rounded-none border border-[#D4AF37]/30 text-[#7A6B5D] hover:text-[#2C1810] hover:bg-[#D4AF37]/5 transition-colors cursor-pointer"
            title="Refresh coupons"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-[#FFFDFC] border border-[#D4AF37]/20 p-5 relative overflow-hidden shadow-sm">
          <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase block mb-1">
            Total Coupons
          </span>
          <span className="font-serif text-2xl font-bold text-[#2C1810]">
            {coupons.length}
          </span>
          <Tag className="w-8 h-8 text-[#D4AF37]/15 absolute right-4 bottom-4 pointer-events-none" />
        </div>

        <div className="bg-[#FFFDFC] border border-[#D4AF37]/20 p-5 relative overflow-hidden shadow-sm">
          <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase block mb-1">
            Active Vouchers
          </span>
          <span className="font-serif text-2xl font-bold text-green-700">
            {activeCount}
          </span>
          <CheckCircle2 className="w-8 h-8 text-green-700/15 absolute right-4 bottom-4 pointer-events-none" />
        </div>

        <div className="bg-[#FFFDFC] border border-[#D4AF37]/20 p-5 relative overflow-hidden shadow-sm">
          <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase block mb-1">
            Total Redemptions
          </span>
          <span className="font-serif text-2xl font-bold text-[#2C1810]">
            {totalUses}
          </span>
          <Layers className="w-8 h-8 text-[#D4AF37]/15 absolute right-4 bottom-4 pointer-events-none" />
        </div>

        <div className="bg-[#FFFDFC] border border-[#D4AF37]/20 p-5 relative overflow-hidden shadow-sm">
          <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase block mb-1">
            Store Privilege Status
          </span>
          <span className="font-sans text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mt-2">
            100% Operational
          </span>
          <Sparkles className="w-8 h-8 text-[#D4AF37]/15 absolute right-4 bottom-4 pointer-events-none" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4AF37]/25 text-xs font-sans text-[#2C1810] placeholder:text-[#7A6B5D]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
        <span className="text-[10px] font-sans font-bold text-[#7A6B5D] uppercase tracking-widest hidden sm:inline">
          Showing {filteredCoupons.length} of {coupons.length} Vouchers
        </span>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#FFFDFC] border border-[#D4AF37]/25 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-7 h-7 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-sans tracking-widest text-[#7A6B5D] uppercase">Loading boutique coupons...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-16 text-center text-[#7A6B5D] space-y-3">
            <Tag className="w-10 h-10 text-[#D4AF37]/30 mx-auto stroke-[1.2]" />
            <p className="font-serif text-base text-[#2C1810] uppercase tracking-wider">No Coupons Found</p>
            <p className="text-xs font-sans max-w-sm mx-auto">
              Create your first promotional discount voucher to reward customers with special checkout privileges.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#2C1810] text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.18em] uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> Create Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 bg-[#FDFBF7] text-[9px] font-sans font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">
                  <th className="py-4 px-5">Code</th>
                  <th className="py-4 px-5">Discount</th>
                  <th className="py-4 px-5">Min Order</th>
                  <th className="py-4 px-5">Valid Until</th>
                  <th className="py-4 px-5">Usage</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10 font-sans text-xs">
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();

                  return (
                    <tr key={coupon.id} className="hover:bg-[#F0E6D8]/20 transition-colors">
                      {/* Code */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs tracking-wider bg-[#2C1810] text-[#D4AF37] px-2.5 py-1">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="text-[#7A6B5D]/40 hover:text-[#2C1810] transition-colors p-1 cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[10px] text-[#7A6B5D] mt-1 line-clamp-1 max-w-xs">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-5 font-semibold text-[#2C1810]">
                        {coupon.discountType === "percentage" ? (
                          <span className="inline-flex items-center gap-1 text-[#2C1810]">
                            <Percent className="w-3 h-3 text-[#D4AF37]" />
                            {coupon.discountValue}% OFF
                            {coupon.maxDiscountAmount ? (
                              <span className="text-[9.5px] text-[#7A6B5D] font-normal">
                                (Up to ₹{coupon.maxDiscountAmount.toLocaleString("en-IN")})
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#2C1810]">
                            ₹{coupon.discountValue.toLocaleString("en-IN")} FLAT OFF
                          </span>
                        )}
                      </td>

                      {/* Min Order */}
                      <td className="py-4 px-5 text-[#7A6B5D]">
                        {coupon.minOrderValue > 0 ? (
                          <span>₹{coupon.minOrderValue.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="italic text-[#7A6B5D]/60">No minimum</span>
                        )}
                      </td>

                      {/* Valid Until */}
                      <td className="py-4 px-5">
                        {coupon.validUntil ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span className={isExpired ? "text-red-600 font-semibold" : "text-[#7A6B5D]"}>
                              {new Date(coupon.validUntil).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {isExpired && (
                              <span className="text-[8px] uppercase bg-red-100 text-red-700 px-1 py-0.5 rounded font-bold">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="italic text-[#7A6B5D]/60">Lifetime</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-5 text-[#7A6B5D]">
                        <span className="font-semibold text-[#2C1810]">{coupon.usedCount || 0}</span>
                        {coupon.usageLimit ? (
                          <span> / {coupon.usageLimit} uses</span>
                        ) : (
                          <span className="text-[10px] text-[#7A6B5D]/60"> (Unlimited)</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase cursor-pointer transition-colors ${
                            coupon.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {coupon.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                              Active
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-2 text-[#7A6B5D] hover:text-[#2C1810] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                            title="Edit coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-2 text-red-600/70 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#D4AF37]/30 shadow-2xl p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D4AF37]/20">
                <div>
                  <span className="text-[8px] font-sans font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                    Promotional Voucher
                  </span>
                  <h3
                    className="font-serif text-xl text-[#2C1810] uppercase"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#7A6B5D] hover:text-[#2C1810] hover:bg-[#2C1810]/5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5 stroke-[1.2]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                    Coupon Code * (Uppercase)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUXURY20"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                    }
                    className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% privilege discount on new collection"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })
                      }
                      className="w-full bg-white border border-[#D4AF37]/30 px-3 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans font-semibold text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Min Order & Max Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Max Cap (₹, % only)
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={formData.discountType !== "percentage"}
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Valid Until & Usage Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Valid Until (Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-sans font-bold tracking-[0.15em] text-[#7A6B5D] uppercase mb-1.5">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500 (blank = unlimited)"
                      value={formData.usageLimit || ""}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D4AF37]/30 px-3.5 py-2.5 text-xs font-sans text-[#2C1810] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="pt-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#2C1810] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-sans text-[#2C1810] cursor-pointer font-medium">
                    Make this coupon active immediately
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#D4AF37]/30 font-sans text-[10px] font-bold tracking-widest text-[#7A6B5D] uppercase hover:text-[#2C1810] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {saving ? "Saving..." : editingCoupon ? "Save Changes" : "Create Voucher"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
