"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Bell, Loader2 } from "lucide-react";

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function NotifyMeModal({ isOpen, onClose, productId, productName }: NotifyMeModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("restock_notifications")
        .insert([
          {
            product_id: productId,
            email: email.trim(),
            status: "pending",
          },
        ]);

      if (error) throw error;

      toast.success("You're on the list! We'll notify you when it's back.");
      onClose();
    } catch (err: any) {
      console.error("Error subscribing:", err);
      if (err?.code === "23505") { // Unique constraint
        toast.info("You have already subscribed for this product.");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border border-[#D4AF37]/20 bg-[#FDFBF7] p-8 rounded-none shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center bg-[#2C1810]/5 border border-[#D4AF37]/20 rounded-full mb-2">
            <Bell className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <DialogTitle className="font-serif text-2xl text-center text-[#2C1810] tracking-wide" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            NOTIFY ME
          </DialogTitle>
          <DialogDescription className="font-sans text-[11px] text-center text-[#7A6B5D] tracking-wide">
            {productName} is currently out of stock. Leave your email below to be the first to know when it returns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-t-0 border-l-0 border-r-0 border-[#D4AF37]/30 rounded-none bg-transparent h-12 px-0 text-sm focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/50 text-center"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/35 transition-all shadow-md cursor-pointer rounded-none"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "JOIN WAITLIST"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
