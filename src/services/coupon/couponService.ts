import { supabase } from "@/lib/supabase/client";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // e.g. 10 for 10%, or 500 for ₹500
  minOrderValue: number; // minimum cart subtotal required
  maxDiscountAmount?: number; // optional cap for percentage discounts
  validUntil: string; // ISO date format or YYYY-MM-DD
  usageLimit?: number; // total times usable
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "cpn-hanger10",
    code: "HANGER10",
    description: "10% off on luxury designer silhouettes",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 1999,
    maxDiscountAmount: 1500,
    validUntil: "2027-12-31",
    usageLimit: 1000,
    usedCount: 14,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cpn-royal500",
    code: "ROYAL500",
    description: "Flat ₹500 privilege voucher on orders above ₹2,999",
    discountType: "fixed",
    discountValue: 500,
    minOrderValue: 2999,
    validUntil: "2027-12-31",
    usageLimit: 500,
    usedCount: 28,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cpn-festive20",
    code: "FESTIVE20",
    description: "Festive Haute Couture 20% privilege discount",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 4999,
    maxDiscountAmount: 3000,
    validUntil: "2027-12-31",
    usageLimit: 200,
    usedCount: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

class CouponService {
  private cache: Coupon[] | null = null;

  async getCoupons(): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "store_coupons")
        .single();

      if (error || !data?.value || !Array.isArray(data.value)) {
        // Initialize default coupons in DB
        await this.saveCouponsToDb(DEFAULT_COUPONS);
        this.cache = DEFAULT_COUPONS;
        return DEFAULT_COUPONS;
      }

      this.cache = data.value as Coupon[];
      return this.cache;
    } catch (err) {
      console.error("Error fetching coupons:", err);
      return this.cache || DEFAULT_COUPONS;
    }
  }

  private async saveCouponsToDb(coupons: Coupon[]): Promise<boolean> {
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "store_coupons",
        value: coupons,
      });
      if (error) throw error;
      this.cache = coupons;
      return true;
    } catch (err) {
      console.error("Error saving coupons to DB:", err);
      return false;
    }
  }

  async saveCoupon(
    couponData: Omit<Coupon, "id" | "createdAt" | "usedCount">,
    id?: string
  ): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
    try {
      const coupons = await this.getCoupons();
      const codeUpper = couponData.code.trim().toUpperCase();

      // Check code uniqueness
      const existing = coupons.find(
        (c) => c.code === codeUpper && c.id !== id
      );
      if (existing) {
        return { success: false, error: `Coupon code "${codeUpper}" already exists` };
      }

      let updatedList: Coupon[];
      let savedCoupon: Coupon;

      if (id) {
        // Update existing
        const target = coupons.find((c) => c.id === id);
        savedCoupon = {
          ...(target || {}),
          ...couponData,
          id,
          code: codeUpper,
          usedCount: target?.usedCount || 0,
          createdAt: target?.createdAt || new Date().toISOString(),
        } as Coupon;
        updatedList = coupons.map((c) => (c.id === id ? savedCoupon : c));
      } else {
        // Create new
        savedCoupon = {
          ...couponData,
          id: `cpn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          code: codeUpper,
          usedCount: 0,
          createdAt: new Date().toISOString(),
        };
        updatedList = [savedCoupon, ...coupons];
      }

      const ok = await this.saveCouponsToDb(updatedList);
      if (!ok) return { success: false, error: "Failed to save coupon to database" };

      return { success: true, coupon: savedCoupon };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to save coupon" };
    }
  }

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      const coupons = await this.getCoupons();
      const updated = coupons.filter((c) => c.id !== id);
      return await this.saveCouponsToDb(updated);
    } catch (err) {
      console.error("Error deleting coupon:", err);
      return false;
    }
  }

  async toggleCouponStatus(id: string): Promise<boolean> {
    try {
      const coupons = await this.getCoupons();
      const updated = coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      );
      return await this.saveCouponsToDb(updated);
    } catch (err) {
      console.error("Error toggling coupon status:", err);
      return false;
    }
  }

  async validateCoupon(
    rawCode: string,
    subtotal: number
  ): Promise<{
    valid: boolean;
    discount: number;
    message: string;
    coupon?: Coupon;
  }> {
    if (!rawCode || !rawCode.trim()) {
      return { valid: false, discount: 0, message: "Please enter a valid coupon code" };
    }

    const code = rawCode.trim().toUpperCase();
    const coupons = await this.getCoupons();
    const coupon = coupons.find((c) => c.code === code);

    if (!coupon) {
      return { valid: false, discount: 0, message: `Coupon "${code}" is invalid` };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: `Coupon "${code}" is inactive` };
    }

    // Expiry check
    if (coupon.validUntil) {
      const expiryDate = new Date(coupon.validUntil);
      expiryDate.setHours(23, 59, 59, 999);
      if (new Date() > expiryDate) {
        return { valid: false, discount: 0, message: `Coupon "${code}" has expired` };
      }
    }

    // Usage limit check
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: `Coupon "${code}" usage limit reached` };
    }

    // Min Order Value check
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Add ₹${(coupon.minOrderValue - subtotal).toLocaleString("en-IN")} more to use "${code}" (Min: ₹${coupon.minOrderValue.toLocaleString("en-IN")})`,
      };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      discount,
      message: `Coupon "${code}" applied successfully! (₹${discount.toLocaleString("en-IN")} saved)`,
      coupon,
    };
  }

  async recordCouponUsage(couponId: string): Promise<void> {
    try {
      const coupons = await this.getCoupons();
      const updated = coupons.map((c) =>
        c.id === couponId ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c
      );
      await this.saveCouponsToDb(updated);
    } catch (err) {
      console.error("Failed to increment coupon usage:", err);
    }
  }
}

export const couponService = new CouponService();
